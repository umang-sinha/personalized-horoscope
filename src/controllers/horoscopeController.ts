import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { getOrCreateHoroscope } from "../services/horoscopeService";
import { failure, success } from "../utils/response";
import { HoroscopeCode, GenericCode } from "../utils/responseCodes";
import { logger } from "../utils/logger";
import { subDays } from "date-fns";

export async function getTodayHoroscope(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const user = req.user!;
    const today = new Date().toISOString().split("T")[0];

    const horoscope = await getOrCreateHoroscope(
      user.id,
      user.zodiacSign,
      today
    );

    return res.status(200).json(
      success(
        HoroscopeCode.HOROSCOPE_TODAY_FETCHED,
        "Today's horoscope fetched",
        {
          date: today,
          text: horoscope.text,
          zodiacSign: user.zodiacSign,
        }
      )
    );
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json(
        failure(
          GenericCode.INTERNAL_SERVER_ERROR,
          "Could not fetch today's horoscope"
        )
      );
  }
}

export async function getHoroscopeHistory(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const user = req.user!;
    const today = new Date();

    const raw = req.query.days as string;
    const days = Math.max(1, Math.min(parseInt(raw) || 7, 100));

    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      dates.push(subDays(today, i).toISOString().split("T")[0]);
    }

    const horoscopes = await Promise.all(
      dates.map((date) => getOrCreateHoroscope(user.id, user.zodiacSign, date))
    );

    return res.status(200).json(
      success(
        HoroscopeCode.HOROSCOPE_HISTORY_FETCHED,
        `Last ${days} days of horoscopes fetched`,
        {
          history: horoscopes.map((h) => ({
            date: h.date,
            text: h.text,
          })),
          zodiacSign: user.zodiacSign,
        }
      )
    );
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json(
        failure(
          GenericCode.INTERNAL_SERVER_ERROR,
          "Could not fetch horoscope history"
        )
      );
  }
}
