"""Dictionary verification service for Adhyayana linguistic engines.

Integrates with https://freedictionaryapi.com/ with in-memory caching and
offline pedagogical lemma seed fallback for robust uptime and zero-flake testing.
"""

import logging
from typing import Dict, Optional, TypedDict
import httpx

logger = logging.getLogger(__name__)


class WordLookupResult(TypedDict):
    is_valid: bool
    part_of_speech: Optional[str]
    definition: Optional[str]


# Offline lemma fallback seeded for Word Blanks Levels 1 to 5
SEED_LEMMA_DICTIONARY: Dict[str, Dict[str, str]] = {
    # Level 1: _ A T / _ I N / _ O P
    "bat": {"pos": "noun", "def": "A small nocturnal flying mammal of the order Chiroptera, or a wooden club used in sports."},
    "cat": {"pos": "noun", "def": "A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws."},
    "hat": {"pos": "noun", "def": "A shaped covering for the head worn for warmth, protection, or as a fashion accessory."},
    "mat": {"pos": "noun", "def": "A piece of coarse material placed on a floor for wiping shoes, or a protective pad."},
    "sat": {"pos": "verb", "def": "Past tense of sit; to rest with the torso vertical and supported by the hips or buttocks."},
    "fat": {"pos": "adjective", "def": "Having a large amount of excess flesh; or oily or greasy substances."},
    "pat": {"pos": "verb", "def": "To touch quickly and gently with the flat of the hand."},
    "rat": {"pos": "noun", "def": "A rodent resembling a large mouse, typically having a pointed snout and long tail."},
    "pin": {"pos": "noun", "def": "A thin piece of metal with a sharp point at one end, used for fastening."},
    "win": {"pos": "verb", "def": "To be successful or victorious in a contest or battle."},
    "hop": {"pos": "verb", "def": "To move by jumping on one foot or both feet at once."},
    "sun": {"pos": "noun", "def": "The luminous star around which the earth and other planets revolve."},

    # Level 2: C _ T / B _ D / H _ T
    "cot": {"pos": "noun", "def": "A small bed, especially for a baby or child."},
    "cut": {"pos": "verb", "def": "To divide or penetrate with a sharp-edged instrument."},
    "bad": {"pos": "adjective", "def": "Not good; deficient in qualities required for a particular purpose."},
    "bed": {"pos": "noun", "def": "A piece of furniture on which a person sleeps."},
    "bid": {"pos": "verb", "def": "To offer a certain sum of money for something, especially at an auction."},
    "bud": {"pos": "noun", "def": "A small part of a plant that develops into a flower or leaf."},
    "hit": {"pos": "verb", "def": "To bring a hand or an instrument into contact with someone or something with force."},
    "hot": {"pos": "adjective", "def": "Having a high degree of heat or a high temperature."},
    "hut": {"pos": "noun", "def": "A small, simple single-story building or shelter."},
    "pan": {"pos": "noun", "def": "A metal container used for cooking food in."},
    "pen": {"pos": "noun", "def": "An instrument for writing or drawing with ink."},
    "pun": {"pos": "noun", "def": "A humorous play on words using double meanings."},

    # Level 3: C A _ / B A _ / P I _
    "cab": {"pos": "noun", "def": "A taxi or chauffeur-driven vehicle for hire."},
    "can": {"pos": "noun", "def": "A cylindrical metal container, or to be able to."},
    "cap": {"pos": "noun", "def": "A close-fitting covering for the head with a visor."},
    "car": {"pos": "noun", "def": "A four-wheeled road vehicle powered by an engine."},
    "bag": {"pos": "noun", "def": "A container made of flexible material with an opening at the top."},
    "ban": {"pos": "verb", "def": "To officially prohibit or outlaw something."},
    "bar": {"pos": "noun", "def": "A long rigid piece of wood, metal, or other material."},
    "bay": {"pos": "noun", "def": "A broad inlet of the sea where the land curves inward."},
    "pig": {"pos": "noun", "def": "An omnivorous domesticated hoofed animal with a broad snout."},
    "pip": {"pos": "noun", "def": "A small seed inside a fruit like an apple or orange."},
    "pit": {"pos": "noun", "def": "A large hole or cavity in the ground."},
    "see": {"pos": "verb", "def": "To perceive with the eyes; to observe or discern visually."},
    "sea": {"pos": "noun", "def": "The expanse of salt water that covers most of the earth's surface."},
    "set": {"pos": "verb", "def": "To put, lay, or stand something in a specified place."},
    "dad": {"pos": "noun", "def": "One's father."},
    "day": {"pos": "noun", "def": "Each of the twenty-four-hour periods of time."},

    # Level 4: _ A M E / _ I N E
    "came": {"pos": "verb", "def": "Past tense of come."},
    "fame": {"pos": "noun", "def": "The state of being known or talked about by many people."},
    "game": {"pos": "noun", "def": "An activity governed by rules in which participants compete."},
    "name": {"pos": "noun", "def": "A word or set of words by which a person or thing is known."},
    "same": {"pos": "adjective", "def": "Identical; not different."},
    "fine": {"pos": "adjective", "def": "Of very high quality; very good of its kind."},
    "line": {"pos": "noun", "def": "A long, narrow mark or band."},
    "mine": {"pos": "pronoun", "def": "Belonging to or associated with me."},
    "bake": {"pos": "verb", "def": "To cook food by dry heat without direct exposure to a flame, typically in an oven."},
    "cake": {"pos": "noun", "def": "An item of soft sweet food made from a mixture of flour, shortening, eggs, and sugar."},

    # Level 5: L I _ T / B E _ T
    "lift": {"pos": "verb", "def": "To raise to a higher position or level."},
    "list": {"pos": "noun", "def": "A number of connected items or names written consecutively."},
    "best": {"pos": "adjective", "def": "Of the most excellent, effective, or desirable quality."},
    "belt": {"pos": "noun", "def": "A strip of leather or other material worn around the waist."},
    "part": {"pos": "noun", "def": "An amount or section which, with others, makes up the whole."},
    "past": {"pos": "noun", "def": "The time or a period of time before the moment of speaking or writing."},
    "fact": {"pos": "noun", "def": "A thing that is known or proved to be true."},
    "fast": {"pos": "adjective", "def": "Moving or capable of moving at high speed."},

    # Level 6: B _ L L / F _ L L
    "ball": {"pos": "noun", "def": "A solid or hollow spherical or ovoid object used in games and sports."},
    "bell": {"pos": "noun", "def": "A hollow metal instrument that sounds a tone when struck."},
    "bill": {"pos": "noun", "def": "A statement of money owed for goods or services, or the beak of a bird."},
    "bull": {"pos": "noun", "def": "An uncastrated adult male bovine animal."},
    "fall": {"pos": "verb", "def": "To descend freely by the force of gravity."},
    "fill": {"pos": "verb", "def": "To make or become full."},
    "full": {"pos": "adjective", "def": "Containing or holding as much or as many as possible."},
    "sing": {"pos": "verb", "def": "To make musical sounds with the voice."},
    "song": {"pos": "noun", "def": "A short poem or other set of words set to music."},
    "ring": {"pos": "noun", "def": "A small circular band, typically of precious metal, worn on a finger."},

    # Level 7: B _ _ T / W _ _ D
    "bait": {"pos": "noun", "def": "Food used to entice fish or other animals as prey."},
    "beat": {"pos": "verb", "def": "To strike repeatedly so as to hurt or break."},
    "boat": {"pos": "noun", "def": "A small vessel for travelling over water."},
    "boot": {"pos": "noun", "def": "A sturdy item of footwear covering the foot and ankle."},
    "meat": {"pos": "noun", "def": "The flesh of an animal as food."},
    "meet": {"pos": "verb", "def": "To arrange or happen to come into the presence of someone."},
    "word": {"pos": "noun", "def": "A single distinct meaningful element of speech or writing used with others to form sentences."},
    "ward": {"pos": "noun", "def": "A separate room or division in a hospital, or an electoral district of a municipality."},
    "wind": {"pos": "noun", "def": "The perceptible natural movement of the air, especially in the form of a current of air."},
    "wood": {"pos": "noun", "def": "The hard fibrous material forming the main substance of the trunk or branches of a tree."},
    "wild": {"pos": "adjective", "def": "Living or growing in the natural environment; not domesticated or cultivated."},

    # Level 8: _ _ A T / _ _ I P
    "chat": {"pos": "verb", "def": "To talk in a friendly and informal way."},
    "flat": {"pos": "adjective", "def": "Having a level surface; without raised areas or indentations."},
    "that": {"pos": "pronoun", "def": "Used to identify a specific person or thing observed or mentioned."},
    "chip": {"pos": "noun", "def": "A small piece of something removed by chopping, cutting, or breaking."},
    "ship": {"pos": "noun", "def": "A large boat for transporting people or goods by sea."},
    "trip": {"pos": "noun", "def": "A journey or excursion, especially for pleasure."},

    # Level 9: S T _ N D / T R _ I N
    "stand": {"pos": "verb", "def": "To have or maintain an upright position on the feet."},
    "train": {"pos": "noun", "def": "A series of connected railway carriages or wagons moved by a locomotive."},
    "blank": {"pos": "adjective", "def": "Bare, not written on, or empty."},
    "blink": {"pos": "verb", "def": "To open and close the eyes quickly."},

    # Level 10: S P _ _ K / S T _ _ M
    "spark": {"pos": "noun", "def": "A small fiery particle thrown off from a fire, alight in ashes, or produced by static friction."},
    "speak": {"pos": "verb", "def": "To say something in order to convey information, an opinion, or a feeling."},
    "spook": {"pos": "verb", "def": "To frighten or become frightened; to startle unexpectedly."},
    "steam": {"pos": "noun", "def": "The vapor into which water is converted when heated."},
    "storm": {"pos": "noun", "def": "A violent disturbance of the atmosphere with strong winds and usually rain, thunder, or snow."},
    "cloud": {"pos": "noun", "def": "A visible mass of condensed water vapor floating in the atmosphere."},

    # Level 12: Compound Words
    "sunset": {"pos": "noun", "def": "The time in the evening when the sun disappears below the horizon."},
    "sunlit": {"pos": "adjective", "def": "Illuminated by direct sunlight."},
    "icebox": {"pos": "noun", "def": "An insulated cabinet or chest packed with ice to keep food cold."},

    # Level 13: Distributed Templates
    "branch": {"pos": "noun", "def": "A part of a tree which grows out from the trunk or from a bough."},
    "wrench": {"pos": "noun", "def": "A tool used for gripping and turning nuts, bolts, or pipes."},
    "crunch": {"pos": "verb", "def": "To crush with the teeth, making a loud sound; or a sound of crushing."},
    "spring": {"pos": "noun", "def": "The season after winter and before summer."},
    "string": {"pos": "noun", "def": "Material consisting of threads of twisted yarn or other fiber."},

    # Level 14: Suffixes
    "baker": {"pos": "noun", "def": "A person who bakes and sells bread and cakes."},
    "maker": {"pos": "noun", "def": "A person or thing that makes or produces something."},
    "caring": {"pos": "adjective", "def": "Displaying kindness and concern for others."},

    # Level 15: Prefixes
    "unfair": {"pos": "adjective", "def": "Not based on or behaving according to the principles of equality and justice."},
    "unlock": {"pos": "verb", "def": "To undo the lock of a door, gate, or container using a key."},
    "refill": {"pos": "verb", "def": "To fill a container again."},

    # Level 16: Derivational Suffixes
    "joyful": {"pos": "adjective", "def": "Feeling, expressing, or causing great pleasure and happiness."},
    "homeless": {"pos": "adjective", "def": "Without a home, and typically living on the streets."},
    "darkness": {"pos": "noun", "def": "The partial or total absence of light."},

    # Level 17: Advanced Morphemic Matrices
    "predict": {"pos": "verb", "def": "To say or estimate that a specified thing will happen in the future."},
    "preview": {"pos": "noun", "def": "An inspection or viewing of something before it is bought or becomes generally available."},
    "prevent": {"pos": "verb", "def": "To keep something from happening of arising."},
}


class DictionaryService:
    """Async client verifying lexical validity against Free Dictionary API with local cache."""

    API_BASE_URL = "https://freedictionaryapi.com/api/v1/entries/en"
    REQUEST_HEADERS = {
        "User-Agent": "Adhyayana-App/1.0",
        "Accept": "application/json",
    }

    def __init__(self) -> None:
        self._cache: Dict[str, WordLookupResult] = {}

    def get_cached(self, word: str) -> Optional[WordLookupResult]:
        return self._cache.get(word.strip().lower())

    async def lookup_word(self, word: str) -> WordLookupResult:
        """Looks up a word, checking memory cache, live Wiktionary API, and fallback seed lemmas.

        Args:
            word: Target English word to validate.

        Returns:
            WordLookupResult containing validity flag, part of speech, and primary definition.
        """
        normalized = word.strip().lower()
        if not normalized or not normalized.isalpha():
            return {"is_valid": False, "part_of_speech": None, "definition": None}

        # 1. Return cached lookup if available
        if normalized in self._cache:
            return self._cache[normalized]

        # 2. Query external Free Dictionary API
        try:
            async with httpx.AsyncClient(timeout=5.0, headers=self.REQUEST_HEADERS) as client:
                response = await client.get(f"{self.API_BASE_URL}/{normalized}")
                if response.status_code == 200:
                    data = response.json()
                    entries = data.get("entries", [])
                    if isinstance(entries, list) and len(entries) > 0:
                        first_entry = entries[0]
                        pos = first_entry.get("partOfSpeech")
                        definition = None
                        senses = first_entry.get("senses", [])
                        if senses and isinstance(senses, list) and len(senses) > 0:
                            definition = senses[0].get("definition")

                        result: WordLookupResult = {
                            "is_valid": True,
                            "part_of_speech": pos,
                            "definition": definition,
                        }
                        self._cache[normalized] = result
                        return result
                    else:
                        # Empty entries means non-existent word according to freedictionaryapi spec
                        negative_result: WordLookupResult = {
                            "is_valid": False,
                            "part_of_speech": None,
                            "definition": None,
                        }
                        self._cache[normalized] = negative_result
                        return negative_result
        except Exception as exc:
            logger.warning("FreeDictionary API query for '%s' failed (%s); checking seed fallback.", normalized, exc)

        # 3. Fallback to seed lemma dictionary (for offline development or network timeouts)
        if normalized in SEED_LEMMA_DICTIONARY:
            seed = SEED_LEMMA_DICTIONARY[normalized]
            fallback_result: WordLookupResult = {
                "is_valid": True,
                "part_of_speech": seed["pos"],
                "definition": seed["def"],
            }
            self._cache[normalized] = fallback_result
            return fallback_result

        # 4. Unknown word
        unrecognized_result: WordLookupResult = {
            "is_valid": False,
            "part_of_speech": None,
            "definition": None,
        }
        self._cache[normalized] = unrecognized_result
        return unrecognized_result


# Global singleton instance
dictionary_service = DictionaryService()
