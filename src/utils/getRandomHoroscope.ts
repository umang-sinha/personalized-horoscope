import horoscopeData from "../data/horoscopes.json";

export function getRandomHoroscope(zodiac: string): string {
  zodiac = zodiac.toLowerCase();
  const pool = horoscopeData[zodiac as keyof typeof horoscopeData];
  return pool[Math.floor(Math.random() * pool.length)];
}
