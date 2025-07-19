export function getZodiacSign(date: Date): ZodiacSigns {
  const d = new Date(date);
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1;

  const signs = [
    { sign: ZodiacSigns.CAPRICORN, from: [12, 22], to: [1, 19] },
    { sign: ZodiacSigns.AQUARIUS, from: [1, 20], to: [2, 18] },
    { sign: ZodiacSigns.PISCES, from: [2, 19], to: [3, 20] },
    { sign: ZodiacSigns.ARIES, from: [3, 21], to: [4, 19] },
    { sign: ZodiacSigns.TAURUS, from: [4, 20], to: [5, 20] },
    { sign: ZodiacSigns.GEMINI, from: [5, 21], to: [6, 20] },
    { sign: ZodiacSigns.CANCER, from: [6, 21], to: [7, 22] },
    { sign: ZodiacSigns.LEO, from: [7, 23], to: [8, 22] },
    { sign: ZodiacSigns.VIRGO, from: [8, 23], to: [9, 22] },
    { sign: ZodiacSigns.LIBRA, from: [9, 23], to: [10, 22] },
    { sign: ZodiacSigns.SCORPIO, from: [10, 23], to: [11, 21] },
    { sign: ZodiacSigns.SAGITTARIUS, from: [11, 22], to: [12, 21] },
  ];

  for (const { sign, from, to } of signs) {
    const [fromMonth, fromDay] = from;
    const [toMonth, toDay] = to;

    if (
      (month === fromMonth && day >= fromDay) ||
      (month === toMonth && day <= toDay)
    ) {
      return sign;
    }
  }

  return ZodiacSigns.CAPRICORN; //fallback, will never reach here in most cases
}

export enum ZodiacSigns {
  CAPRICORN = "CAPRICORN",
  AQUARIUS = "AQUARIUS",
  PISCES = "PISCES",
  ARIES = "ARIES",
  TAURUS = "TAURUS",
  GEMINI = "GEMINI",
  CANCER = "CANCER",
  LEO = "LEO",
  VIRGO = "VIRGO",
  LIBRA = "LIBRA",
  SCORPIO = "SCORPIO",
  SAGITTARIUS = "SAGITTARIUS",
}
