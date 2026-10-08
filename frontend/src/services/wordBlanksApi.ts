/**
 * Resilient Word Blanks API Service
 * Handles level retrieval and generative guess evaluation with offline fallback and localStorage persistence.
 */

import {
  DiscoveredWord,
  WordBlanksEvaluationResponse,
  WordBlanksGuessRequest,
  WordBlanksLevel,
} from '@/types/wordBlanks';
import { CLIENT_WORD_BLANKS_LEVELS } from '@/engines/word_blanks/puzzlesData';

export { CLIENT_WORD_BLANKS_LEVELS };

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000';

// Seed fallback lemmas for zero-latency offline play across all 17 levels
const OFFLINE_SEED_WORDS: Record<string, { pos: string; def: string }> = {
  // Level 1: 3-Letter Onsets (_ A T, _ I N, _ O P, _ U N, _ E T, etc.)
  bat: { pos: 'noun', def: 'A nocturnal flying mammal, or a wooden club used in sports.' },
  cat: { pos: 'noun', def: 'A small domesticated carnivorous mammal with soft fur.' },
  hat: { pos: 'noun', def: 'A shaped covering for the head worn for warmth or style.' },
  mat: { pos: 'noun', def: 'A piece of coarse material placed on a floor.' },
  sat: { pos: 'verb', def: 'Past tense of sit; rested on the haunches.' },
  fat: { pos: 'adjective', def: 'Having an abundance of flesh or lipid tissue.' },
  pat: { pos: 'verb', def: 'To touch quickly and gently with the flat of the hand.' },
  rat: { pos: 'noun', def: 'A rodent resembling a large mouse with a pointed snout.' },
  bin: { pos: 'noun', def: 'A container for storing waste, food, or goods.' },
  fin: { pos: 'noun', def: 'A flattened appendage on an aquatic animal used for swimming.' },
  pin: { pos: 'noun', def: 'A thin piece of metal with a sharp point at one end.' },
  sin: { pos: 'noun', def: 'An immoral act considered a transgression against divine law.' },
  tin: { pos: 'noun', def: 'A silvery-white metal used in alloys and tinplate.' },
  win: { pos: 'verb', def: 'To be successful or achieve victory in a contest.' },
  cop: { pos: 'noun', def: 'Informal term for a police officer.' },
  hop: { pos: 'verb', def: 'To spring or leap on one foot or both feet.' },
  mop: { pos: 'noun', def: 'An implement consisting of a bundle of thick loose strings on a stick.' },
  pop: { pos: 'verb', def: 'To make a light explosive sound.' },
  top: { pos: 'noun', def: 'The highest or uppermost part of something.' },
  bun: { pos: 'noun', def: 'A small, sweet bread roll.' },
  fun: { pos: 'noun', def: 'Enjoyment, amusement, or lighthearted pleasure.' },
  gun: { pos: 'noun', def: 'A weapon consisting of a metal tube from which bullets are fired.' },
  run: { pos: 'verb', def: 'To move at a speed faster than walking.' },
  sun: { pos: 'noun', def: 'The luminous celestial body around which the earth revolves.' },
  bet: { pos: 'verb', def: 'To risk something on the outcome of an unpredictable event.' },
  get: { pos: 'verb', def: 'To come into possession of something; receive or acquire.' },
  jet: { pos: 'noun', def: 'A rapid stream of liquid or gas forced out through a small nozzle.' },
  let: { pos: 'verb', def: 'Not to prevent or forbid; allow or permit.' },
  met: { pos: 'verb', def: 'Past tense of meet; encountered.' },
  net: { pos: 'noun', def: 'A piece of open-meshed fabric.' },
  pet: { pos: 'noun', def: 'A domestic or tamed animal kept for companionship.' },
  set: { pos: 'verb', def: 'To put or place in a specified position or state.' },
  wet: { pos: 'adjective', def: 'Covered or saturated with water or other liquid.' },
  ban: { pos: 'verb', def: 'To officially or legally prohibit something.' },
  can: { pos: 'noun', def: 'A cylindrical metal container.' },
  fan: { pos: 'noun', def: 'An apparatus with rotating blades that creates a current of air.' },
  man: { pos: 'noun', def: 'An adult human male.' },
  pan: { pos: 'noun', def: 'A shallow container with a long handle used for cooking food.' },
  ran: { pos: 'verb', def: 'Past tense of run; moved swiftly.' },
  tan: { pos: 'noun', def: 'A brownish skin coloration from sun exposure.' },
  van: { pos: 'noun', def: 'A medium-sized motor vehicle used for transporting goods.' },
  dip: { pos: 'verb', def: 'To put something briefly into a liquid.' },
  hip: { pos: 'noun', def: 'The projection of the pelvis and upper thigh bone on each side.' },
  lip: { pos: 'noun', def: 'Either of the two fleshy parts forming the edges of the mouth.' },
  rip: { pos: 'verb', def: 'To tear or pull something quickly or forcibly away.' },
  sip: { pos: 'verb', def: 'To drink by taking small mouthfuls.' },
  tip: { pos: 'noun', def: 'The pointed or rounded end of something slender.' },
  zip: { pos: 'verb', def: 'To fasten or open with a zipper.' },
  cot: { pos: 'noun', def: 'A small portable bed, especially for an infant.' },
  dot: { pos: 'noun', def: 'A tiny round mark made by or as if by a point.' },
  got: { pos: 'verb', def: 'Past tense of get; obtained.' },
  hot: { pos: 'adjective', def: 'Having a high degree of heat or a high temperature.' },
  lot: { pos: 'noun', def: 'A large number or amount; a plot of land.' },
  not: { pos: 'adverb', def: 'Used with an auxiliary verb to form the negative.' },
  pot: { pos: 'noun', def: 'A deep container, typically rounded, used for cooking.' },
  rot: { pos: 'verb', def: 'To decay or cause to decay through the action of bacteria.' },
  cap: { pos: 'noun', def: 'A close-fitting head covering without a brim.' },
  gap: { pos: 'noun', def: 'A break or opening in a wall, fence, or line.' },
  lap: { pos: 'noun', def: 'The flat area formed by the thighs when seated.' },
  map: { pos: 'noun', def: 'A visual diagrammatic representation of an area of land or sea.' },
  nap: { pos: 'noun', def: 'A short sleep, especially during the day.' },
  rap: { pos: 'verb', def: 'To strike a hard surface with a series of rapid audible blows.' },
  sap: { pos: 'noun', def: 'The fluid containing sugars and mineral salts circulated in a plant.' },
  tap: { pos: 'verb', def: 'To strike lightly with a quick audible blow.' },
  den: { pos: 'noun', def: 'The lair or wild animal shelter.' },
  hen: { pos: 'noun', def: 'A female bird, especially of a domestic fowl.' },
  men: { pos: 'noun', def: 'Plural form of man.' },
  pen: { pos: 'noun', def: 'An instrument for writing or drawing with ink.' },
  ten: { pos: 'number', def: 'The cardinal number equal to nine plus one.' },
  bug: { pos: 'noun', def: 'A small insect or a software error.' },
  dug: { pos: 'verb', def: 'Past tense of dig.' },
  hug: { pos: 'verb', def: 'To squeeze someone tightly in one\'s arms.' },
  jug: { pos: 'noun', def: 'A cylindrical vessel with a handle and lip for holding liquids.' },
  mug: { pos: 'noun', def: 'A large cup with a handle used for hot beverages.' },
  rug: { pos: 'noun', def: 'A floor covering of thick woven material.' },
  tug: { pos: 'verb', def: 'To pull something hard or suddenly.' },
  big: { pos: 'adjective', def: 'Of considerable size, extent, or intensity.' },
  dig: { pos: 'verb', def: 'To break up and move earth or soil.' },
  fig: { pos: 'noun', def: 'A soft pear-shaped fruit with sweet dark flesh.' },
  pig: { pos: 'noun', def: 'An omnivorous domesticated hoofed mammal with a snout.' },
  wig: { pos: 'noun', def: 'An artificial covering of hair worn on the head.' },
  dog: { pos: 'noun', def: 'A domesticated carnivorous mammal of the genus Canis.' },
  fog: { pos: 'noun', def: 'A thick cloud of tiny water droplets suspended in the atmosphere.' },
  hog: { pos: 'noun', def: 'A domesticated pig, especially one kept for meat.' },
  jog: { pos: 'verb', def: 'To run at a steady, gentle pace.' },
  log: { pos: 'noun', def: 'A part of the trunk or a large branch of a tree.' },
  bed: { pos: 'noun', def: 'A piece of furniture for sleep or rest.' },
  fed: { pos: 'verb', def: 'Past tense of feed.' },
  led: { pos: 'verb', def: 'Past tense of lead.' },
  red: { pos: 'adjective', def: 'Of a color at the end of the spectrum next to orange.' },
  wed: { pos: 'verb', def: 'To marry or unite in matrimony.' },
  day: { pos: 'noun', def: 'Each of the twenty-four-hour periods of the Earth rotation.' },
  hay: { pos: 'noun', def: 'Grass that has been mown and dried for use as fodder.' },
  lay: { pos: 'verb', def: 'To put down gently or in a flat position.' },
  may: { pos: 'modal', def: 'Expressing possibility or permission.' },
  pay: { pos: 'verb', def: 'To give money that is due for goods or services.' },
  ray: { pos: 'noun', def: 'A narrow beam of light or energy.' },
  say: { pos: 'verb', def: 'To utter words so as to convey information or an opinion.' },
  way: { pos: 'noun', def: 'A method, style, or manner of doing something.' },
  box: { pos: 'noun', def: 'A rigid container with a flat base and sides.' },
  fox: { pos: 'noun', def: 'A carnivorous mammal of the dog family with a bushy tail.' },
  tax: { pos: 'noun', def: 'A compulsory contribution to state revenue.' },
  wax: { pos: 'noun', def: 'A sticky substance produced by bees or paraffin.' },

  // Level 2: 3-Letter Medial Vowels (C _ T, B _ D, H _ T, etc.)
  cot_l2: { pos: 'noun', def: 'A camp bed.' },
  cut: { pos: 'verb', def: 'To make an opening or incision with a sharp-edged tool.' },
  bad: { pos: 'adjective', def: 'Of poor quality or a low standard.' },
  bud: { pos: 'noun', def: 'A compact knoblike growth on a plant that develops into a leaf or flower.' },
  hit: { pos: 'verb', def: 'To bring one\'s hand or an implement into forceful contact.' },
  hut: { pos: 'noun', def: 'A small, simple, single-story house or shelter.' },

  // Level 3: 3-Letter Codas (C A _, B A _, P I _, S E _, etc.)
  cab: { pos: 'noun', def: 'A taxi or the driver\'s compartment in a truck or locomotive.' },
  cam: { pos: 'noun', def: 'A projecting part on a rotating wheel or shaft.' },
  car: { pos: 'noun', def: 'A road vehicle powered by an engine, designed to carry passengers.' },
  caw: { pos: 'noun', def: 'The harsh cry of a crow or rook.' },
  bar: { pos: 'noun', def: 'A long rigid piece of wood or metal.' },
  bay: { pos: 'noun', def: 'A broad inlet of the sea where the land curves inward.' },
  pie: { pos: 'noun', def: 'A baked dish of fruit, meat, or vegetables with a top pastry crust.' },
  see: { pos: 'verb', def: 'To perceive with the eyes; discern visually.' },
  sea: { pos: 'noun', def: 'The expanse of salt water that covers most of the earth\'s surface.' },

  // Level 4: 4-Letter Rhyming Rimes (_ A M E, _ I N E, etc.)
  came: { pos: 'verb', def: 'Past tense of come.' },
  dame: { pos: 'noun', def: 'An elderly or mature woman of high rank.' },
  fame: { pos: 'noun', def: 'The state of being known or talked about by many people.' },
  game: { pos: 'noun', def: 'An activity engaged in for diversion or amusement.' },
  name: { pos: 'noun', def: 'A word or set of words by which a person or thing is known.' },
  same: { pos: 'adjective', def: 'Identical; not different.' },
  tame: { pos: 'adjective', def: 'Domesticated; not dangerous or frightened of people.' },
  dine: { pos: 'verb', def: 'To eat dinner.' },
  fine: { pos: 'adjective', def: 'Of very high quality; very good of its kind.' },
  line: { pos: 'noun', def: 'A long, narrow mark or band.' },
  mine: { pos: 'noun', def: 'An excavation in the earth for extracting coal or other minerals.' },
  nine: { pos: 'number', def: 'Equivalent to the sum of eight and one.' },
  pine: { pos: 'noun', def: 'An evergreen coniferous tree with needle-shaped leaves.' },
  vine: { pos: 'noun', def: 'A climbing or trailing woody-stemmed plant of the grape family.' },

  // Level 6: Bounded Vowels (B _ L L, W _ L L, etc.)
  ball: { pos: 'noun', def: 'A solid or hollow spherical object used in games and sports.' },
  bell: { pos: 'noun', def: 'A hollow metal instrument that sounds a tone when struck.' },
  bill: { pos: 'noun', def: 'A statement of money owed, or the beak of a bird.' },
  bull: { pos: 'noun', def: 'An uncastrated adult male bovine animal.' },
  wall: { pos: 'noun', def: 'A continuous vertical brick or stone structure that encloses an area.' },
  well: { pos: 'noun', def: 'A shaft sunk into the ground to obtain water, oil, or gas.' },
  will: { pos: 'modal', def: 'Expressing the future tense or intention.' },

  // Level 7: Digraphs (B _ _ T, W _ _ D, etc.)
  boat: { pos: 'noun', def: 'A small vessel for travelling over water.' },
  boot: { pos: 'noun', def: 'A sturdy item of footwear covering the foot and ankle.' },
  wood: { pos: 'noun', def: 'The hard fibrous material forming the trunk and branches of a tree.' },
  word: { pos: 'noun', def: 'A single distinct meaningful element of speech or writing.' },
  ward: { pos: 'noun', def: 'A separate room or division in a hospital.' },
  wind: { pos: 'noun', def: 'The perceptible natural movement of the air.' },
  wild: { pos: 'adjective', def: 'Living or growing in the natural environment; not domesticated.' },

  // Level 10: Diphthongs (S P _ _ K)
  spark: { pos: 'noun', def: 'A small fiery particle thrown off from a fire or static discharge.' },
  speak: { pos: 'verb', def: 'To say something in order to convey information, opinion, or feeling.' },
  spook: { pos: 'verb', def: 'To frighten or startle unexpectedly.' },

  // Level 12: Compound Words (S U N _ _ _, B E D _ _ _, etc.)
  sunlit: { pos: 'adjective', def: 'Illuminated by direct sunlight.' },
  sunset: { pos: 'noun', def: 'The time in the evening when the sun disappears below the horizon.' },
  sunray: { pos: 'noun', def: 'A beam of sunlight.' },
  sunhat: { pos: 'noun', def: 'A wide-brimmed hat worn for protection from the sun.' },
  bedbug: { pos: 'noun', def: 'A blood-sucking bug which infests beds and bedding.' },
  bedpan: { pos: 'noun', def: 'A shallow vessel used as a toilet by a bedridden patient.' },
  bedroom: { pos: 'noun', def: 'A room used for sleeping in.' },
  bedside: { pos: 'noun', def: 'The area directly next to a bed.' },

  // Level 13: Distributed Templates (_ R _ N _ H)
  branch: { pos: 'noun', def: 'A part of a tree that grows out from the trunk or bough.' },
  wrench: { pos: 'noun', def: 'A tool used for gripping and turning nuts, bolts, or pipes.' },
  crunch: { pos: 'verb', def: 'To crush with the teeth, making a loud sound.' },
  trench: { pos: 'noun', def: 'A long, narrow ditch.' },
  spring: { pos: 'noun', def: 'The season between winter and summer, or a resilient coil.' },
  strong: { pos: 'adjective', def: 'Having great power, physical force, or endurance.' },
  string: { pos: 'noun', def: 'Material consisting of threads of twisted vegetable or synthetic fibers.' },
  bright: { pos: 'adjective', def: 'Giving out or reflecting a lot of light; shining.' },
  ground: { pos: 'noun', def: 'The solid surface of the earth.' },

  // Level 14: Inflectional Suffixes (_ _ _ K E R, _ _ _ I N G, etc.)
  baker: { pos: 'noun', def: 'A person whose trade is making bread and cakes.' },
  maker: { pos: 'noun', def: 'A person or thing that makes or produces something.' },
  talker: { pos: 'noun', def: 'A person who talks, especially one who speaks well or a lot.' },
  walker: { pos: 'noun', def: 'A person who walks, or a frame supporting disabled people.' },
  taking: { pos: 'noun', def: 'The action of seizing or receiving something.' },
  making: { pos: 'noun', def: 'The process of producing something.' },

  // Level 15: Prefixes (U N _ _ _ _, R E _ _ _ _, etc.)
  unfair: { pos: 'adjective', def: 'Not based on or behaving according to the principles of equality.' },
  unkind: { pos: 'adjective', def: 'Inconsiderate and harsh to other people.' },
  untold: { pos: 'adjective', def: 'Too much or too numerous to be measured.' },
  unseen: { pos: 'adjective', def: 'Not seen or noticed.' },
  replay: { pos: 'verb', def: 'To play back an audio or video recording.' },
  rewind: { pos: 'verb', def: 'To wind tape or film back towards the beginning.' },
  remake: { pos: 'verb', def: 'To make something again or differently.' },

  // Level 16: Derivational Suffixes (_ _ _ F U L, _ _ _ L E S S, etc.)
  joyful: { pos: 'adjective', def: 'Feeling, expressing, or causing great pleasure and happiness.' },
  useful: { pos: 'adjective', def: 'Able to be used for a practical purpose or in several ways.' },
  hopeful: { pos: 'adjective', def: 'Feeling or inspiring optimism about a future event.' },
  fearless: { pos: 'adjective', def: 'Lacking fear; brave and intrepid.' },
  endless: { pos: 'adjective', def: 'Having or seeming to have no end or limit.' },
  darkness: { pos: 'noun', def: 'The partial or total absence of light.' },
  kindness: { pos: 'noun', def: 'The quality of being friendly, generous, and considerate.' },

  // Level 17: Morphemic Matrices (P R E _ _ _ _, O V E R _ _ _, etc.)
  prepare: { pos: 'verb', def: 'To make ready for use or consideration.' },
  preview: { pos: 'noun', def: 'An advance inspection, viewing, or exhibition.' },
  prevent: { pos: 'verb', def: 'To keep something from happening or arising.' },
  predict: { pos: 'verb', def: 'To state what will happen in the future based on observation.' },
  overact: { pos: 'verb', def: 'To act a role in an exaggerated manner.' },
  overall: { pos: 'adjective', def: 'Taking everything into account; comprehensive.' },
  overlap: { pos: 'verb', def: 'To extend over so as to cover partly.' },
  overdue: { pos: 'adjective', def: 'Not having arrived, happened, or been done by expected time.' },
};

/**
 * Fetches Word Blanks progression levels from backend, falling back to local specifications.
 */
export async function fetchWordBlanksLevels(): Promise<WordBlanksLevel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/puzzles/word-blanks/levels`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: WordBlanksLevel[] = await response.json();
    return data;
  } catch (error) {
    console.warn(
      '[Word Blanks API] Backend unavailable; falling back to client-side levels',
      error
    );
    return CLIENT_WORD_BLANKS_LEVELS;
  }
}

/**
 * Evaluates a Word Blanks guess via FastAPI evaluator with transparent offline fallback.
 */
export async function evaluateWordBlanksGuess(
  request: WordBlanksGuessRequest
): Promise<WordBlanksEvaluationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/puzzles/word-blanks/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: WordBlanksEvaluationResponse = await response.json();
    return data;
  } catch (error) {
    console.warn(
      '[Word Blanks API] Backend evaluation unavailable; using offline evaluator fallback',
      error
    );
    return evaluateOfflineFallback(request);
  }
}

/**
 * Client-side evaluation fallback executing pattern matching and seed lemma lookup.
 */
function evaluateOfflineFallback(
  request: WordBlanksGuessRequest
): WordBlanksEvaluationResponse {
  const levelConfig =
    CLIENT_WORD_BLANKS_LEVELS.find((l) => l.level === request.level) ||
    CLIENT_WORD_BLANKS_LEVELS[0];

  const puzzleNumber = request.puzzle_number ?? 1;
  const targetPuzzle =
    levelConfig.puzzles?.find((p) => p.puzzle_number === puzzleNumber) ||
    levelConfig.puzzles?.[puzzleNumber - 1] ||
    levelConfig.puzzles?.[0];

  const activeStem = targetPuzzle?.stem || levelConfig.stem || '_ A T';
  const entered = request.entered_word.trim().toUpperCase();

  // Stem pattern matching
  const stemChars = activeStem.replace(/\s+/g, '');
  if (entered.length !== stemChars.length) {
    return {
      is_valid: false,
      is_duplicate: false,
      matches_pattern: false,
      discovered_word: null,
      xp_awarded: 0,
      feedback_message: `'${entered}' does not match the length of stem '${activeStem}'.`,
    };
  }

  for (let i = 0; i < stemChars.length; i++) {
    const expected = stemChars[i];
    if (expected !== '_' && expected !== entered[i]) {
      return {
        is_valid: false,
        is_duplicate: false,
        matches_pattern: false,
        discovered_word: null,
        xp_awarded: 0,
        feedback_message: `'${entered}' does not match the fixed characters in '${activeStem}'.`,
      };
    }
  }

  // Duplicate suppression
  const normalizedDiscovered = request.session_discovered.map((w) => w.toUpperCase());
  if (normalizedDiscovered.includes(entered)) {
    return {
      is_valid: true,
      is_duplicate: true,
      matches_pattern: true,
      discovered_word: null,
      xp_awarded: 0,
      feedback_message: `'${entered}' was already discovered in this session!`,
    };
  }

  // Seed dictionary check
  const lookupKey = entered.toLowerCase();
  const lookup = OFFLINE_SEED_WORDS[lookupKey];
  if (!lookup) {
    return {
      is_valid: false,
      is_duplicate: false,
      matches_pattern: true,
      discovered_word: null,
      xp_awarded: 0,
      feedback_message: `'${entered}' is not in the offline seed dictionary. Connect backend for full 8.5M+ Wiktionary vocabulary.`,
    };
  }

  const xp = levelConfig.xp_per_word;
  const discovered: DiscoveredWord = {
    word: entered,
    part_of_speech: lookup.pos,
    definition: lookup.def,
    xp_awarded: xp,
    discovered_at: new Date().toISOString(),
  };

  return {
    is_valid: true,
    is_duplicate: false,
    matches_pattern: true,
    discovered_word: discovered,
    xp_awarded: xp,
    feedback_message: `Brilliant! '${entered}' discovered (+${xp} XP).`,
  };
}

// ---------------------------------------------------------------------------
// LocalStorage Persistence Helpers
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = 'adhyayana:word-blanks:v1';

export function getStoredDiscoveredWords(
  level: number,
  puzzleNumber: number = 1
): DiscoveredWord[] {
  try {
    // 1. Check primary key: l{level}:p{puzzleNumber}:words
    const key = `${STORAGE_PREFIX}:l${level}:p${puzzleNumber}:words`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as DiscoveredWord[];
    }

    // 2. Backward compatibility fallback for puzzle 1
    if (puzzleNumber === 1) {
      const legacyRaw = localStorage.getItem(`${STORAGE_PREFIX}:level:${level}:words`);
      if (legacyRaw) {
        return JSON.parse(legacyRaw) as DiscoveredWord[];
      }
    }

    return [];
  } catch (err) {
    console.error('Failed to load discovered words from localStorage', err);
    return [];
  }
}

export function saveStoredDiscoveredWords(
  level: number,
  words: DiscoveredWord[],
  puzzleNumber: number = 1
): void {
  try {
    const key = `${STORAGE_PREFIX}:l${level}:p${puzzleNumber}:words`;
    localStorage.setItem(key, JSON.stringify(words));
  } catch (err) {
    console.error('Failed to save discovered words to localStorage', err);
  }
}

export function clearStoredLevelProgress(
  level: number,
  puzzleNumber?: number
): void {
  try {
    if (puzzleNumber !== undefined) {
      localStorage.removeItem(`${STORAGE_PREFIX}:l${level}:p${puzzleNumber}:words`);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}:level:${level}:words`);
      // Clear all puzzles for this level (1 to 50)
      for (let p = 1; p <= 50; p++) {
        localStorage.removeItem(`${STORAGE_PREFIX}:l${level}:p${p}:words`);
      }
    }
  } catch (err) {
    console.error('Failed to clear stored level progress', err);
  }
}

export function isPuzzleCleared(
  level: number,
  puzzleNumber: number,
  minWordsToClear: number = 3
): boolean {
  const words = getStoredDiscoveredWords(level, puzzleNumber);
  return words.length >= minWordsToClear;
}

export function getClearedPuzzlesCount(
  level: number,
  totalPuzzles: number,
  minWordsToClear: number = 3
): number {
  let count = 0;
  for (let p = 1; p <= totalPuzzles; p++) {
    if (isPuzzleCleared(level, p, minWordsToClear)) {
      count++;
    }
  }
  return count;
}
