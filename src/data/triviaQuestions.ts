import { TriviaQuestion } from '../types';

export const triviaQuestions: TriviaQuestion[] = [
  // Easy Questions
  {
    id: 'trivia_easy_1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Paris has been the capital of France since 508 AD and is known for landmarks like the Eiffel Tower.',
    category: 'Geography'
  },
  {
    id: 'trivia_easy_2',
    question: 'How many legs does a spider have?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'All spiders have 8 legs, which is what distinguishes them from insects that have 6 legs.',
    category: 'Science'
  },
  {
    id: 'trivia_easy_3',
    question: 'What color do you get when you mix red and blue?',
    options: ['Green', 'Purple', 'Orange', 'Yellow'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Red and blue are primary colors that combine to make purple, a secondary color.',
    category: 'Art'
  },
  {
    id: 'trivia_easy_4',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mars', 'Mercury', 'Earth'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Mercury is the closest planet to the Sun, with an average distance of about 36 million miles.',
    category: 'Science'
  },
  {
    id: 'trivia_easy_5',
    question: 'What is 5 + 7?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Basic addition: 5 + 7 = 12',
    category: 'Math'
  },

  // Medium Questions
  {
    id: 'trivia_medium_1',
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It is now housed in the Louvre Museum.',
    category: 'Art'
  },
  {
    id: 'trivia_medium_2',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Ag', 'Gd'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Gold\'s chemical symbol is Au, derived from the Latin word "aurum" meaning gold.',
    category: 'Science'
  },
  {
    id: 'trivia_medium_3',
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'World War II ended in 1945, with Germany surrendering in May and Japan in September.',
    category: 'History'
  },
  {
    id: 'trivia_medium_4',
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The Blue Whale is the largest mammal and animal ever known to have lived on Earth.',
    category: 'Science'
  },
  {
    id: 'trivia_medium_5',
    question: 'Which Shakespeare play features the characters Romeo and Juliet?',
    options: ['Hamlet', 'Macbeth', 'Romeo and Juliet', 'Othello'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Romeo and Juliet is a tragedy written by William Shakespeare early in his career.',
    category: 'Literature'
  },

  // Hard Questions
  {
    id: 'trivia_hard_1',
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: 'Vatican City is the smallest sovereign state in the world, covering just 0.17 square miles.',
    category: 'Geography'
  },
  {
    id: 'trivia_hard_2',
    question: 'Who developed the theory of relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Albert Einstein developed both the special and general theories of relativity in the early 20th century.',
    category: 'Science'
  },
  {
    id: 'trivia_hard_3',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Quartz', 'Diamond', 'Titanium', 'Graphite'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Diamond is the hardest natural substance, rating 10 on the Mohs scale of mineral hardness.',
    category: 'Science'
  },
  {
    id: 'trivia_hard_4',
    question: 'In which city is the International Court of Justice located?',
    options: ['Geneva', 'Brussels', 'The Hague', 'Vienna'],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: 'The International Court of Justice is located in The Hague, Netherlands.',
    category: 'Politics'
  },
  {
    id: 'trivia_hard_5',
    question: 'What is the chemical formula for ozone?',
    options: ['O2', 'O3', 'CO2', 'H2O'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Ozone is O3, consisting of three oxygen atoms bonded together.',
    category: 'Science'
  }
];