import { requireAuth } from "../middlewares/requireAuth";
import {
  getTodayHoroscope,
  getHoroscopeHistory,
} from "../controllers/horoscopeController";
import { Router } from "express";

const router = Router();

router.get("/today", getTodayHoroscope);
router.get("/history", getHoroscopeHistory);

export default router;
