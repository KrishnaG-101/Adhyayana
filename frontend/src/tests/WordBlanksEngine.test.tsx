import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from '@/context/NavigationContext';
import { LetterTileInput } from '@/engines/word_blanks/LetterTileInput';
import { DiscoveredWordsSidebar } from '@/engines/word_blanks/DiscoveredWordsSidebar';
import { WordBlanksBoard } from '@/engines/word_blanks/WordBlanksBoard';
import { PuzzleViewPage } from '@/pages/PuzzleViewPage';
import { CLIENT_WORD_BLANKS_LEVELS } from '@/services/wordBlanksApi';
import { DiscoveredWord } from '@/types/wordBlanks';

describe('Word Blanks Engine (विचारणशाला Generative Stem Recall)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('LetterTileInput Component', () => {
    it('renders locked stem tiles and editable blanks with auto-advancing focus', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <LetterTileInput
          stem="_ A T"
          onSubmit={handleSubmit}
        />
      );

      // Verify fixed tiles
      expect(screen.getByTestId('tile-fixed-1')).toHaveTextContent('A');
      expect(screen.getByTestId('tile-fixed-2')).toHaveTextContent('T');

      // Verify blank input
      const blankInput = screen.getByTestId('tile-blank-0') as HTMLInputElement;
      expect(blankInput).toBeInTheDocument();
      expect(blankInput.value).toBe('');

      // Submit should be disabled while blanks are incomplete
      const submitBtn = screen.getByTestId('submit-guess-button');
      expect(submitBtn).toBeDisabled();

      // Type letter 'B'
      await user.type(blankInput, 'b');
      expect(blankInput.value).toBe('B');
      expect(submitBtn).not.toBeDisabled();

      // Submit via button click
      await user.click(submitBtn);
      expect(handleSubmit).toHaveBeenCalledWith('BAT');
    });

    it('submits on Enter key when word is fully formed', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <LetterTileInput
          stem="B _ L L"
          onSubmit={handleSubmit}
        />
      );

      const blankInput = screen.getByTestId('tile-blank-0');
      await user.type(blankInput, 'a{Enter}');

      expect(handleSubmit).toHaveBeenCalledWith('BALL');
    });
  });

  describe('DiscoveredWordsSidebar Component', () => {
    it('renders empty encouragement prompt when 0 words are found', () => {
      render(
        <DiscoveredWordsSidebar
          discoveredWords={[]}
          currentLevel={1}
          minWordsToUnlock={3}
          isNextLevelUnlocked={false}
          totalXp={0}
        />
      );

      expect(screen.getByTestId('empty-lexicon-state')).toBeInTheDocument();
      expect(screen.getByText('+0 XP')).toBeInTheDocument();
      expect(screen.getByText('0 / 3')).toBeInTheDocument();
    });

    it('renders list of discovered words with definitions, part of speech, and XP chips', () => {
      const sampleWords: DiscoveredWord[] = [
        {
          word: 'BAT',
          part_of_speech: 'noun',
          definition: 'A small nocturnal flying mammal of the order Chiroptera.',
          xp_awarded: 20,
          discovered_at: new Date().toISOString(),
        },
        {
          word: 'CAT',
          part_of_speech: 'noun',
          definition: 'A small carnivorous mammal with soft fur.',
          xp_awarded: 20,
          discovered_at: new Date().toISOString(),
        },
      ];

      render(
        <DiscoveredWordsSidebar
          discoveredWords={sampleWords}
          currentLevel={1}
          minWordsToUnlock={3}
          isNextLevelUnlocked={false}
          totalXp={40}
        />
      );

      expect(screen.getByText('+40 XP')).toBeInTheDocument();
      expect(screen.getByText('2 words discovered')).toBeInTheDocument();
      expect(screen.getByTestId('word-card-BAT')).toBeInTheDocument();
      expect(screen.getByTestId('word-card-CAT')).toBeInTheDocument();
      expect(screen.getByText('A small nocturnal flying mammal of the order Chiroptera.')).toBeInTheDocument();
    });
  });

  describe('WordBlanksBoard Full Engine Canvas', () => {
    it('renders all 5 levels with sequential unlock logic and evaluates guess submissions', async () => {
      const user = userEvent.setup();

      // Mock level retrieval
      vi.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
        const urlStr = url.toString();
        if (urlStr.includes('/levels')) {
          return {
            ok: true,
            json: async () => CLIENT_WORD_BLANKS_LEVELS,
          } as Response;
        }
        if (urlStr.includes('/evaluate')) {
          const body = JSON.parse(init?.body as string);
          if (body.entered_word === 'BAT') {
            return {
              ok: true,
              json: async () => ({
                is_valid: true,
                is_duplicate: false,
                matches_pattern: true,
                discovered_word: {
                  word: 'BAT',
                  part_of_speech: 'noun',
                  definition: 'A nocturnal flying mammal.',
                  xp_awarded: 20,
                  discovered_at: new Date().toISOString(),
                },
                xp_awarded: 20,
                feedback_message: "Brilliant! 'BAT' discovered (+20 XP).",
              }),
            } as Response;
          }
        }
        return { ok: false, status: 404 } as Response;
      });

      render(<WordBlanksBoard />);

      // Verify Level 1 is unlocked and Level 2 is locked
      expect(screen.getByTestId('level-selector-btn-1')).toBeEnabled();
      expect(screen.getByTestId('level-selector-btn-2')).toBeDisabled();

      // Submit 'BAT'
      const blankInput = screen.getByTestId('tile-blank-0');
      await user.type(blankInput, 'b');

      const submitBtn = screen.getByTestId('submit-guess-button');
      await user.click(submitBtn);

      // Verify feedback and sidebar update
      await waitFor(() => {
        expect(screen.getByTestId('evaluation-feedback-banner')).toHaveTextContent(
          "Brilliant! 'BAT' discovered (+20 XP)."
        );
        expect(screen.getByTestId('word-card-BAT')).toBeInTheDocument();
        expect(screen.getByTestId('total-xp-badge')).toHaveTextContent('+20 XP');
      });
    });

    it('displays duplicate diagnostic feedback when the same word is submitted twice', async () => {
      const user = userEvent.setup();

      // Seed localStorage with BAT already found
      localStorage.setItem(
        'adhyayana:word-blanks:v1:level:1:words',
        JSON.stringify([
          {
            word: 'BAT',
            part_of_speech: 'noun',
            definition: 'A nocturnal flying mammal.',
            xp_awarded: 20,
            discovered_at: new Date().toISOString(),
          },
        ])
      );

      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        if (urlStr.includes('/levels')) {
          return {
            ok: true,
            json: async () => CLIENT_WORD_BLANKS_LEVELS,
          } as Response;
        }
        if (urlStr.includes('/evaluate')) {
          return {
            ok: true,
            json: async () => ({
              is_valid: true,
              is_duplicate: true,
              matches_pattern: true,
              discovered_word: null,
              xp_awarded: 0,
              feedback_message: "'BAT' was already discovered in this session!",
            }),
          } as Response;
        }
        return { ok: false, status: 404 } as Response;
      });

      render(<WordBlanksBoard />);

      // BAT should already be in sidebar
      expect(screen.getByTestId('word-card-BAT')).toBeInTheDocument();

      // Enter BAT again
      const blankInput = screen.getByTestId('tile-blank-0');
      await user.type(blankInput, 'b');

      const submitBtn = screen.getByTestId('submit-guess-button');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('evaluation-feedback-banner')).toHaveTextContent(
          "'BAT' was already discovered in this session!"
        );
      });
    });

    it('renders all 17 progressive level pills in the curriculum', async () => {
      render(<WordBlanksBoard />);

      for (let lvl = 1; lvl <= 17; lvl++) {
        expect(screen.getByTestId(`level-selector-btn-${lvl}`)).toBeInTheDocument();
      }
    });

    it('supports dynamic stepper navigation and clearance gating', async () => {
      const user = userEvent.setup();

      // Seed Level 1, Puzzle 1 with 3 words already cleared
      localStorage.setItem(
        'adhyayana:word-blanks:v1:l1:p1:words',
        JSON.stringify([
          { word: 'BAT', part_of_speech: 'noun', definition: 'A mammal.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'CAT', part_of_speech: 'noun', definition: 'A feline.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'HAT', part_of_speech: 'noun', definition: 'A cap.', xp_awarded: 20, discovered_at: 'now' },
        ])
      );

      render(<WordBlanksBoard />);

      // Previous button should be disabled on puzzle 1
      const prevBtn = screen.getByTestId('prev-puzzle-btn');
      expect(prevBtn).toBeDisabled();

      // Clearance badge should show Cleared
      expect(screen.getByTestId('puzzle-stepper-info')).toHaveTextContent('Puzzle 1 of 30');
      expect(screen.getByTestId('puzzle-stepper-info')).toHaveTextContent('Cleared');

      // Next button should be enabled because 3 words are discovered
      const nextBtn = screen.getByTestId('next-puzzle-btn');
      expect(nextBtn).toBeEnabled();

      // Click Next to advance to Puzzle 2 (_ I N)
      await user.click(nextBtn);

      expect(screen.getByTestId('puzzle-stepper-info')).toHaveTextContent('Puzzle 2 of 30');
      expect(screen.getByText('Stem Pattern:')).toBeInTheDocument();
      expect(screen.getByText('_ I N')).toBeInTheDocument();

      // Previous button is now enabled
      expect(prevBtn).toBeEnabled();
      await user.click(prevBtn);

      expect(screen.getByTestId('puzzle-stepper-info')).toHaveTextContent('Puzzle 1 of 30');
      expect(screen.getByText('_ A T')).toBeInTheDocument();
    });

    it('opens Quick-Jump modal and jumps to selected stage', async () => {
      const user = userEvent.setup();

      // Seed stage 1 and stage 2 as cleared so stage 3 is unlocked but stage 4 remains locked
      localStorage.setItem(
        'adhyayana:word-blanks:v1:l1:p1:words',
        JSON.stringify([
          { word: 'BAT', part_of_speech: 'noun', definition: 'A mammal.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'CAT', part_of_speech: 'noun', definition: 'A feline.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'HAT', part_of_speech: 'noun', definition: 'A cap.', xp_awarded: 20, discovered_at: 'now' },
        ])
      );
      localStorage.setItem(
        'adhyayana:word-blanks:v1:l1:p2:words',
        JSON.stringify([
          { word: 'BIN', part_of_speech: 'noun', definition: 'A container.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'PIN', part_of_speech: 'noun', definition: 'A fastener.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'TIN', part_of_speech: 'noun', definition: 'A metal.', xp_awarded: 20, discovered_at: 'now' },
        ])
      );

      render(<WordBlanksBoard />);

      const quickJumpBtn = screen.getByTestId('quick-jump-btn');
      await user.click(quickJumpBtn);

      // Verify modal is open
      expect(screen.getByTestId('quick-jump-modal')).toBeInTheDocument();
      expect(screen.getByText(/Level 1 Stages:/i)).toBeInTheDocument();

      // Verify stage 4 is locked and disabled
      const stage4Btn = screen.getByTestId('quick-jump-stage-4');
      expect(stage4Btn).toBeDisabled();

      // Click stage 3 (_ O P) which is unlocked
      const stage3Btn = screen.getByTestId('quick-jump-stage-3');
      expect(stage3Btn).toBeEnabled();
      expect(stage3Btn).toHaveTextContent('_ O P');
      await user.click(stage3Btn);

      // Modal closes and active puzzle is now 3
      expect(screen.queryByTestId('quick-jump-modal')).not.toBeInTheDocument();
      expect(screen.getByTestId('puzzle-stepper-info')).toHaveTextContent('Puzzle 3 of 30');
      expect(screen.getByText('_ O P')).toBeInTheDocument();
    });

    it('evaluates Level 3 coda blanks with C A _ stem', async () => {
      const user = userEvent.setup();

      // Unlock Level 2 and Level 3 via localStorage by clearing all puzzles in Level 1 and 2
      for (let p = 1; p <= 30; p++) {
        localStorage.setItem(
          `adhyayana:word-blanks:v1:l1:p${p}:words`,
          JSON.stringify([
            { word: 'BAT', part_of_speech: 'noun', definition: 'A bat.', xp_awarded: 20, discovered_at: 'now' },
            { word: 'CAT', part_of_speech: 'noun', definition: 'A cat.', xp_awarded: 20, discovered_at: 'now' },
            { word: 'HAT', part_of_speech: 'noun', definition: 'A hat.', xp_awarded: 20, discovered_at: 'now' },
          ])
        );
        localStorage.setItem(
          `adhyayana:word-blanks:v1:l2:p${p}:words`,
          JSON.stringify([
            { word: 'COT', part_of_speech: 'noun', definition: 'A cot.', xp_awarded: 20, discovered_at: 'now' },
            { word: 'CUT', part_of_speech: 'verb', definition: 'To cut.', xp_awarded: 20, discovered_at: 'now' },
            { word: 'CAT', part_of_speech: 'noun', definition: 'A cat.', xp_awarded: 20, discovered_at: 'now' },
          ])
        );
      }

      vi.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
        const urlStr = url.toString();
        if (urlStr.includes('/levels')) {
          return {
            ok: true,
            json: async () => CLIENT_WORD_BLANKS_LEVELS,
          } as Response;
        }
        if (urlStr.includes('/evaluate')) {
          const body = JSON.parse(init?.body as string);
          if (body.entered_word === 'CAR') {
            return {
              ok: true,
              json: async () => ({
                is_valid: true,
                is_duplicate: false,
                matches_pattern: true,
                discovered_word: {
                  word: 'CAR',
                  part_of_speech: 'noun',
                  definition: 'A four-wheeled road vehicle.',
                  xp_awarded: 20,
                  discovered_at: new Date().toISOString(),
                },
                xp_awarded: 20,
                feedback_message: "Brilliant! 'CAR' discovered (+20 XP).",
              }),
            } as Response;
          }
        }
        return { ok: false, status: 404 } as Response;
      });

      render(<WordBlanksBoard />);

      // Switch to Level 3 tab
      const lvl3Btn = screen.getByTestId('level-selector-btn-3');
      expect(lvl3Btn).toBeEnabled();
      await user.click(lvl3Btn);

      // Verify Level 3 coda stem C A _
      expect(screen.getByText('C A _')).toBeInTheDocument();

      // Type 'r' in the blank coda tile (which is tile-blank-0)
      const blankInput = screen.getByTestId('tile-blank-0');
      await user.type(blankInput, 'r');

      const submitBtn = screen.getByTestId('submit-guess-button');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('evaluation-feedback-banner')).toHaveTextContent(
          "Brilliant! 'CAR' discovered (+20 XP)."
        );
        expect(screen.getByTestId('word-card-CAR')).toBeInTheDocument();
      });
    });
  });

  describe('Focus Mode Mounting on PuzzleViewPage', () => {
    it('mounts WordBlanksBoard when route is /puzzles/word-blanks', async () => {
      render(
        <MemoryRouter initialEntries={['/puzzles/word-blanks']}>
          <NavigationProvider>
            <Routes>
              <Route path="/puzzles/:puzzleId" element={<PuzzleViewPage />} />
            </Routes>
          </NavigationProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('word-blanks-board')).toBeInTheDocument();
      expect(screen.getByText('Engine: word-blanks')).toBeInTheDocument();
    });
  });
});
