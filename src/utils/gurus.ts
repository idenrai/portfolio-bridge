import type { GuruProfile } from "@/types";

/**
 * 투자 구루 프로필 데이터
 */
export const GURU_PROFILES: GuruProfile[] = [
  {
    id: "buffett",
    name: "Warren Buffett",
    firm: "Berkshire Hathaway",
    idealAllocation: [
      { category: "value", targetPercent: 35 },
      { category: "cash", targetPercent: 25 },
      { category: "dividend", targetPercent: 20 },
      { category: "index", targetPercent: 10 },
      { category: "growth", targetPercent: 10 },
    ],
  },
  {
    id: "munger",
    name: "Charlie Munger",
    firm: "Daily Journal Corporation",
    idealAllocation: [
      { category: "value", targetPercent: 50 },
      { category: "growth", targetPercent: 20 },
      { category: "dividend", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "lynch",
    name: "Peter Lynch",
    firm: "Fidelity (Magellan Fund, ret.)",
    idealAllocation: [
      { category: "growth", targetPercent: 45 },
      { category: "value", targetPercent: 20 },
      { category: "dividend", targetPercent: 15 },
      { category: "index", targetPercent: 10 },
      { category: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "graham",
    name: "Benjamin Graham",
    firm: "Graham-Newman Corp. (hist.)",
    idealAllocation: [
      { category: "bond", targetPercent: 35 },
      { category: "value", targetPercent: 30 },
      { category: "dividend", targetPercent: 20 },
      { category: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "dalio",
    name: "Ray Dalio",
    firm: "Bridgewater Associates",
    idealAllocation: [
      { category: "bond", targetPercent: 55 },
      { category: "index", targetPercent: 25 },
      { category: "commodity", targetPercent: 15 },
      { category: "cash", targetPercent: 5 },
    ],
  },
  {
    id: "lilu",
    name: "Li Lu",
    firm: "Himalaya Capital",
    idealAllocation: [
      { category: "value", targetPercent: 45 },
      { category: "growth", targetPercent: 25 },
      { category: "dividend", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "ackman",
    name: "Bill Ackman",
    firm: "Pershing Square Capital",
    idealAllocation: [
      { category: "value", targetPercent: 35 },
      { category: "growth", targetPercent: 30 },
      { category: "dividend", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
      { category: "bond", targetPercent: 5 },
    ],
  },
  {
    id: "burry",
    name: "Michael Burry",
    firm: "Scion Asset Management",
    idealAllocation: [
      { category: "value", targetPercent: 40 },
      { category: "commodity", targetPercent: 20 },
      { category: "cash", targetPercent: 20 },
      { category: "growth", targetPercent: 10 },
      { category: "bond", targetPercent: 10 },
    ],
  },
  {
    id: "fisher",
    name: "Ken Fisher",
    firm: "Fisher Asset Management",
    idealAllocation: [
      { category: "growth", targetPercent: 45 },
      { category: "index", targetPercent: 25 },
      { category: "dividend", targetPercent: 15 },
      { category: "value", targetPercent: 10 },
      { category: "cash", targetPercent: 5 },
    ],
  },
  {
    id: "cohen",
    name: "Steven Cohen",
    firm: "Point72 Asset Management",
    idealAllocation: [
      { category: "growth", targetPercent: 30 },
      { category: "value", targetPercent: 25 },
      { category: "index", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
      { category: "commodity", targetPercent: 10 },
      { category: "bond", targetPercent: 5 },
    ],
  },
  {
    id: "marks",
    name: "Howard Marks",
    firm: "Oaktree Capital Management",
    idealAllocation: [
      { category: "bond", targetPercent: 35 },
      { category: "value", targetPercent: 30 },
      { category: "cash", targetPercent: 15 },
      { category: "dividend", targetPercent: 10 },
      { category: "growth", targetPercent: 10 },
    ],
  },
  {
    id: "klarman",
    name: "Seth Klarman",
    firm: "The Baupost Group",
    idealAllocation: [
      { category: "value", targetPercent: 40 },
      { category: "cash", targetPercent: 25 },
      { category: "bond", targetPercent: 20 },
      { category: "dividend", targetPercent: 10 },
      { category: "growth", targetPercent: 5 },
    ],
  },
  {
    id: "templeton",
    name: "John Templeton",
    firm: "Templeton Growth Fund (hist.)",
    idealAllocation: [
      { category: "value", targetPercent: 40 },
      { category: "index", targetPercent: 20 },
      { category: "growth", targetPercent: 15 },
      { category: "bond", targetPercent: 15 },
      { category: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "soros",
    name: "George Soros",
    firm: "Soros Fund Management",
    idealAllocation: [
      { category: "bond", targetPercent: 30 },
      { category: "commodity", targetPercent: 25 },
      { category: "growth", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
      { category: "index", targetPercent: 15 },
    ],
  },
  {
    id: "wood",
    name: "Cathie Wood",
    firm: "ARK Invest",
    idealAllocation: [
      { category: "growth", targetPercent: 65 },
      { category: "crypto", targetPercent: 15 },
      { category: "index", targetPercent: 10 },
      { category: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "druckenmiller",
    name: "Stanley Druckenmiller",
    firm: "Duquesne Family Office",
    idealAllocation: [
      { category: "growth", targetPercent: 35 },
      { category: "index", targetPercent: 20 },
      { category: "commodity", targetPercent: 20 },
      { category: "cash", targetPercent: 15 },
      { category: "bond", targetPercent: 10 },
    ],
  },
  {
    id: "smith",
    name: "Terry Smith",
    firm: "Fundsmith LLP",
    idealAllocation: [
      { category: "growth", targetPercent: 45 },
      { category: "dividend", targetPercent: 25 },
      { category: "value", targetPercent: 20 },
      { category: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "greenblatt",
    name: "Joel Greenblatt",
    firm: "Gotham Asset Management",
    idealAllocation: [
      { category: "value", targetPercent: 40 },
      { category: "growth", targetPercent: 25 },
      { category: "index", targetPercent: 20 },
      { category: "cash", targetPercent: 10 },
      { category: "bond", targetPercent: 5 },
    ],
  },
  {
    id: "piotroski",
    name: "Joseph Piotroski",

    firm: "Stanford GSB (Academic)",
    idealAllocation: [
      { category: "value", targetPercent: 50 },
      { category: "dividend", targetPercent: 20 },
      { category: "bond", targetPercent: 15 },
      { category: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "oneil",
    name: "William O'Neil",
    firm: "Investor's Business Daily",
    idealAllocation: [
      { category: "growth", targetPercent: 60 },
      { category: "cash", targetPercent: 25 },
      { category: "index", targetPercent: 15 },
    ],
  },
];
/**
 * 구루 ID로 프로필 조회
 */
export function getGuruProfile(id: string): GuruProfile | undefined {
  return GURU_PROFILES.find((g) => g.id === id);
}
