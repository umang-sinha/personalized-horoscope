import { Horoscope } from "../models/Horoscope";
import { getRandomHoroscope } from "../utils/getRandomHoroscope";
import { ZodiacSigns } from "../utils/zodiac";

export async function getOrCreateHoroscope(
  userId: string,
  zodiac: string,
  date: string
) {
  const existing = await Horoscope.findOne({
    where: { userId, date },
  });

  if (existing) return existing;

  const text = getRandomHoroscope(zodiac);

  const created = await Horoscope.create({
    userId,
    zodiacSign: zodiac as ZodiacSigns,
    date,
    text,
  });

  return created;
}
