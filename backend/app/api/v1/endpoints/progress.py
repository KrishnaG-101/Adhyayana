"""Game Progress and Cross-Device Synchronization Endpoints.

Implements routes registered in docs/specs/api-contracts.json:
- GET /api/v1/games/{game_id}/progress
- POST /api/v1/games/{game_id}/progress
"""

from datetime import datetime, timezone
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.core.firebase import (
    get_game_progress,
    save_game_progress,
    save_user_profile,
)
from app.schemas.progress import (
    DiscoveredWordRecord,
    SyncGameProgressRequest,
    SyncGameProgressResponse,
    WordBlanksProgressData,
)
from app.schemas.users import UserProfile

router = APIRouter()


@router.get(
    "/games/{game_id}/progress",
    response_model=WordBlanksProgressData,
    summary="Fetch Game Progress",
    description="Retrieves the authenticated learner's persistent progress document from Cloud Firestore users/{uid}/game_progress/{game_id}.",
)
async def get_progress(
    game_id: str,
    current_user: UserProfile = Depends(get_current_user),
) -> WordBlanksProgressData:
    """Returns persistent game progress, or a fresh initial baseline if none exists."""
    if game_id != "word_blanks":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "GAME_NOT_FOUND", "message": f"Game engine '{game_id}' is not registered."},
        )

    stored = get_game_progress(current_user.uid, game_id)
    if stored:
        try:
            return WordBlanksProgressData.model_validate(stored)
        except Exception:
            pass

    # Default initial baseline for fresh accounts
    return WordBlanksProgressData(
        game_id="word_blanks",
        unlocked_levels=[1],
        cleared_stages=[],
        discovered_words={},
        total_words_count=0,
        total_xp_earned=0,
        last_played_at=datetime.now(timezone.utc),
    )


@router.post(
    "/games/{game_id}/progress",
    response_model=SyncGameProgressResponse,
    summary="Synchronize Game Progress",
    description="Merges discovered words, unlocked levels, and cleared stages into Firestore users/{uid}/game_progress/{game_id} and credits XP to the player profile.",
)
async def sync_progress(
    game_id: str,
    payload: SyncGameProgressRequest,
    current_user: UserProfile = Depends(get_current_user),
) -> SyncGameProgressResponse:
    """Merges incoming client game progress into persistent Firestore storage."""
    if game_id != "word_blanks":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "GAME_NOT_FOUND", "message": f"Game engine '{game_id}' is not registered."},
        )

    now = datetime.now(timezone.utc)

    # 1. Fetch existing stored progress to merge
    existing = get_game_progress(current_user.uid, game_id) or {}

    # 2. Merge unlocked levels
    existing_unlocked: List[int] = existing.get("unlocked_levels", [1])
    merged_unlocked = sorted(list(set(existing_unlocked + payload.unlocked_levels)))
    if 1 not in merged_unlocked:
        merged_unlocked.insert(0, 1)

    # 3. Merge cleared stages
    existing_stages: List[str] = existing.get("cleared_stages", [])
    merged_stages = sorted(list(set(existing_stages + payload.cleared_stages)))

    # 4. Merge discovered words map
    existing_words: Dict[str, Any] = existing.get("discovered_words", {})
    merged_words: Dict[str, List[DiscoveredWordRecord]] = {}

    # Copy existing records
    for stage_key, words_list in existing_words.items():
        records: List[DiscoveredWordRecord] = []
        for item in words_list:
            try:
                records.append(DiscoveredWordRecord.model_validate(item))
            except Exception:
                pass
        merged_words[stage_key] = records

    # Merge incoming records
    for stage_key, incoming_list in payload.discovered_words.items():
        current_list = merged_words.get(stage_key, [])
        seen_words = {r.word.upper() for r in current_list}
        for inc in incoming_list:
            if inc.word.upper() not in seen_words:
                current_list.append(inc)
                seen_words.add(inc.word.upper())
        merged_words[stage_key] = current_list

    # 5. Count total distinct words and engine XP
    total_distinct_words = sum(len(w_list) for w_list in merged_words.values())
    engine_total_xp = sum(
        sum(r.xp_awarded for r in w_list) for w_list in merged_words.values()
    )

    # 6. Build updated game progress document
    updated_progress = WordBlanksProgressData(
        game_id="word_blanks",
        unlocked_levels=merged_unlocked,
        cleared_stages=merged_stages,
        discovered_words=merged_words,
        total_words_count=total_distinct_words,
        total_xp_earned=engine_total_xp,
        last_played_at=now,
    )

    # Save to Firestore subcollection users/{uid}/game_progress/word_blanks
    save_game_progress(
        current_user.uid, game_id, updated_progress.model_dump(mode="json")
    )

    # 7. Credit XP and update user profile stats
    if payload.new_xp_delta > 0:
        current_user.stats.total_xp += payload.new_xp_delta

    current_user.stats.word_blanks_cleared = max(
        current_user.stats.word_blanks_cleared, len(merged_stages)
    )
    current_user.stats.games_won = max(
        current_user.stats.games_won, current_user.stats.word_blanks_cleared
    )
    current_user.stats.games_played = max(
        current_user.stats.games_played, current_user.stats.games_won
    )
    current_user.last_active_at = now

    save_user_profile(current_user)

    return SyncGameProgressResponse(
        success=True,
        game_id=game_id,
        synced_stages_count=len(merged_stages),
        synced_words_count=total_distinct_words,
        total_xp=current_user.stats.total_xp,
        message=(
            f"Game progress synchronized: {len(merged_stages)} stages cleared, "
            f"{total_distinct_words} words recorded."
        ),
        updated_profile=current_user,
    )
