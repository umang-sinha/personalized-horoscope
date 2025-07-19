import {
  getTodayHoroscope,
  getHoroscopeHistory,
} from "../controllers/horoscopeController";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /horoscope/today:
 *   get:
 *     summary: Get today's horoscope for the authenticated user
 *     tags:
 *       - Horoscope
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched today's horoscope
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "TODAY_FETCHED"
 *                 message:
 *                   type: string
 *                   example: "Today's horoscope fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-20"
 *                     text:
 *                       type: string
 *                       example: "You will find clarity in unexpected places today."
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/today", getTodayHoroscope);

/**
 * @openapi
 * /horoscope/history:
 *   get:
 *     summary: Get the user's horoscope history for the last X days
 *     tags:
 *       - Horoscope
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Number of past days to retrieve horoscopes for
 *     responses:
 *       200:
 *         description: Successfully fetched horoscope history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "HISTORY_FETCHED"
 *                 message:
 *                   type: string
 *                   example: "Last 7 days of horoscopes fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2025-07-15"
 *                           text:
 *                             type: string
 *                             example: "Your energy is aligned with progress today."
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/history", getHoroscopeHistory);

export default router;
