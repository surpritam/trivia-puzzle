import { WordPuzzle } from '../types';

export const wordPuzzles: WordPuzzle[] = [
  // Easy Puzzles
  {
    id: 'word_easy_1',
    type: 'riddle',
    question: 'I am tall when I am young, and I am short when I am old. What am I?',
    answer: 'candle',
    hints: [
      'Think about something that gets smaller as it\'s used',
      'It provides light',
      'It has a flame'
    ],
    difficulty: 'easy',
    explanation: 'A candle is tall when new and gets shorter as the wax melts from burning.'
  },
  {
    id: 'word_easy_2',
    type: 'scrambled',
    question: 'Unscramble this word: TAC',
    answer: 'cat',
    hints: [
      'It\'s a common pet',
      'It says "meow"',
      'It has whiskers'
    ],
    difficulty: 'easy',
    explanation: 'CAT is a common household pet that is often kept for companionship.'
  },
  {
    id: 'word_easy_3',
    type: 'anagram',
    question: 'Rearrange the letters in "LISTEN" to make another word',
    answer: 'silent',
    hints: [
      'It means making no sound',
      'The opposite of loud',
      'What you do when you don\'t speak'
    ],
    difficulty: 'easy',
    explanation: 'SILENT uses all the same letters as LISTEN, just rearranged.'
  },
  {
    id: 'word_easy_4',
    type: 'riddle',
    question: 'What has keys but no locks, space but no room, and you can enter but not go inside?',
    answer: 'keyboard',
    hints: [
      'You use it with a computer',
      'It has letters and numbers',
      'You type on it'
    ],
    difficulty: 'easy',
    explanation: 'A keyboard has keys you press, a space bar, and an enter key, but no physical locks or rooms.'
  },
  {
    id: 'word_easy_5',
    type: 'scrambled',
    question: 'Unscramble this word: KOOB',
    answer: 'book',
    hints: [
      'You read it',
      'It has pages',
      'Libraries are full of them'
    ],
    difficulty: 'easy',
    explanation: 'A BOOK is something you read, made up of pages with text.'
  },

  // Medium Puzzles
  {
    id: 'word_medium_1',
    type: 'riddle',
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    answer: 'map',
    hints: [
      'You use it for navigation',
      'It shows locations',
      'It can be folded'
    ],
    difficulty: 'medium',
    explanation: 'A map shows cities, mountains, and water bodies but doesn\'t contain the actual physical things.'
  },
  {
    id: 'word_medium_2',
    type: 'anagram',
    question: 'Rearrange "ASTRONOMER" to spell what they study',
    answer: 'moon starer',
    hints: [
      'Two words',
      'Someone who looks at celestial objects',
      'The first word is what they observe at night'
    ],
    difficulty: 'medium',
    explanation: 'MOON STARER is an anagram of ASTRONOMER, describing what astronomers do.'
  },
  {
    id: 'word_medium_3',
    type: 'scrambled',
    question: 'Unscramble: TNEMERIUQER',
    answer: 'requirement',
    hints: [
      'Something that is needed',
      'A necessary condition',
      'Often used in job postings'
    ],
    difficulty: 'medium',
    explanation: 'A REQUIREMENT is something that is needed or mandatory.'
  },
  {
    id: 'word_medium_4',
    type: 'riddle',
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'footsteps',
    hints: [
      'You make them when you walk',
      'They show where you\'ve been',
      'They can be tracked'
    ],
    difficulty: 'medium',
    explanation: 'The more steps you take, the more footprints you leave behind you.'
  },
  {
    id: 'word_medium_5',
    type: 'anagram',
    question: 'Rearrange "FUNERAL" to make a word meaning enjoyable',
    answer: 'fun real',
    hints: [
      'Two words',
      'Describes something entertaining',
      'The opposite of boring'
    ],
    difficulty: 'medium',
    explanation: 'FUN REAL is an anagram of FUNERAL, meaning genuinely enjoyable.'
  },

  // Hard Puzzles
  {
    id: 'word_hard_1',
    type: 'riddle',
    question: 'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
    answer: 'echo',
    hints: [
      'It\'s a sound phenomenon',
      'You hear it in mountains or empty buildings',
      'It repeats what you say'
    ],
    difficulty: 'hard',
    explanation: 'An echo is a sound that reflects off surfaces and returns to the listener, seeming to "speak" without having a physical form.'
  },
  {
    id: 'word_hard_2',
    type: 'anagram',
    question: 'Rearrange "DESPERATION" to make a word meaning separated',
    answer: 'separated no',
    hints: [
      'Two words',
      'Means kept apart',
      'The opposite of together'
    ],
    difficulty: 'hard',
    explanation: 'SEPARATED NO is an anagram of DESPERATION, though this is quite challenging to spot.'
  },
  {
    id: 'word_hard_3',
    type: 'scrambled',
    question: 'Unscramble: YGOLONHCET',
    answer: 'technology',
    hints: [
      'Modern devices and systems',
      'Computers, phones, etc.',
      'Advancing rapidly in the 21st century'
    ],
    difficulty: 'hard',
    explanation: 'TECHNOLOGY refers to the application of scientific knowledge for practical purposes.'
  },
  {
    id: 'word_hard_4',
    type: 'riddle',
    question: 'I am not alive, but I grow. I don\'t have lungs, but I need air. I don\'t have a mouth, but water kills me. What am I?',
    answer: 'fire',
    hints: [
      'It\'s hot and bright',
      'It consumes fuel',
      'It can spread quickly'
    ],
    difficulty: 'hard',
    explanation: 'Fire grows by consuming fuel, needs oxygen to survive, but is extinguished by water.'
  },
  {
    id: 'word_hard_5',
    type: 'anagram',
    question: 'Rearrange "PRESBYTERIAN" to make a word meaning someone who refuses to give up',
    answer: 'persister ban',
    hints: [
      'Two words',
      'Someone who keeps trying',
      'Won\'t quit despite difficulties'
    ],
    difficulty: 'hard',
    explanation: 'PERSISTER BAN is an anagram of PRESBYTERIAN, describing someone who persists despite obstacles.'
  }
];