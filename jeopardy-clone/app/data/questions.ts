export interface Clue {
  question: string;
  answer: string;
  isDailyDouble: boolean;
}

export interface Category {
  name: string;
  clues: Clue[];
}

export const VALUES = [200, 400, 600, 800, 1000];

export const CATEGORIES: Category[] = [
  {
    name: "World History",
    clues: [
      {
        question: "This ancient wonder stood at the harbor of Rhodes",
        answer: "Colossus of Rhodes",
        isDailyDouble: false,
      },
      {
        question: "Napoleon's final defeat occurred at this battle in 1815",
        answer: "Waterloo",
        isDailyDouble: false,
      },
      {
        question: "This 'unsinkable' British ocean liner sank in 1912",
        answer: "Titanic",
        isDailyDouble: false,
      },
      {
        question: "Mao Zedong founded this political party that rules China",
        answer: "Chinese Communist Party",
        isDailyDouble: true,
      },
      {
        question: "This Macedonian king conquered Persia and Egypt by age 25",
        answer: "Alexander the Great",
        isDailyDouble: false,
      },
    ],
  },
  {
    name: "Science",
    clues: [
      {
        question: "The chemical symbol Au stands for this precious metal",
        answer: "Gold",
        isDailyDouble: false,
      },
      {
        question: "This force keeps planets orbiting the sun",
        answer: "Gravity",
        isDailyDouble: false,
      },
      {
        question: "DNA stands for this full scientific name",
        answer: "Deoxyribonucleic Acid",
        isDailyDouble: false,
      },
      {
        question: "This scientist developed the theory of relativity",
        answer: "Einstein",
        isDailyDouble: false,
      },
      {
        question: "The study of heredity and genes is called this",
        answer: "Genetics",
        isDailyDouble: true,
      },
    ],
  },
  {
    name: "Pop Culture",
    clues: [
      {
        question:
          "This wizard attended Hogwarts School of Witchcraft and Wizardry",
        answer: "Harry Potter",
        isDailyDouble: false,
      },
      {
        question: "She sang 'Rolling in the Deep' and 'Hello'",
        answer: "Adele",
        isDailyDouble: false,
      },
      {
        question: "This streaming giant produces 'Stranger Things'",
        answer: "Netflix",
        isDailyDouble: false,
      },
      {
        question: "Tony Stark's superhero alter ego in the MCU",
        answer: "Iron Man",
        isDailyDouble: true,
      },
      {
        question: "The virtual currency powered by blockchain technology",
        answer: "Bitcoin",
        isDailyDouble: false,
      },
    ],
  },
  {
    name: "Geography",
    clues: [
      {
        question: "The world's smallest country by area",
        answer: "Vatican City",
        isDailyDouble: false,
      },
      {
        question: "This river is the longest in the world",
        answer: "The Nile",
        isDailyDouble: false,
      },
      {
        question: "Africa's highest mountain peak",
        answer: "Kilimanjaro",
        isDailyDouble: false,
      },
      {
        question: "This ocean separates Europe from the Americas",
        answer: "Atlantic Ocean",
        isDailyDouble: false,
      },
      {
        question: "Country with the most time zones in the world",
        answer: "France",
        isDailyDouble: true,
      },
    ],
  },
  {
    name: "Literature",
    clues: [
      {
        question: "Author of '1984' and 'Animal Farm'",
        answer: "George Orwell",
        isDailyDouble: false,
      },
      {
        question: "Shakespeare wrote this play about a Danish prince",
        answer: "Hamlet",
        isDailyDouble: false,
      },
      {
        question: "This 1851 novel features Captain Ahab and a white whale",
        answer: "Moby-Dick",
        isDailyDouble: false,
      },
      {
        question: "The author of the 'Harry Potter' series",
        answer: "J.K. Rowling",
        isDailyDouble: false,
      },
      {
        question: "This Fitzgerald novel is set in the Roaring Twenties",
        answer: "The Great Gatsby",
        isDailyDouble: true,
      },
    ],
  },
  {
    name: "Sports",
    clues: [
      {
        question: "This country has won the most FIFA World Cups",
        answer: "Brazil",
        isDailyDouble: false,
      },
      {
        question: "The number of players on a basketball team on the court",
        answer: "Five",
        isDailyDouble: false,
      },
      {
        question:
          "This sport takes place on a 'pitch' with 11 players per side",
        answer: "Soccer / Football",
        isDailyDouble: false,
      },
      {
        question: "Serena Williams retired from this sport in 2022",
        answer: "Tennis",
        isDailyDouble: false,
      },
      {
        question:
          "An athlete scores a 'hat trick' by doing this three times in a game",
        answer: "Score a goal",
        isDailyDouble: true,
      },
    ],
  },
];
