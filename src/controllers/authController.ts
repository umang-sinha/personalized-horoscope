import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { LoginInput, SignupInput } from "../validations/auth.schema";
import { User } from "../models/User";
import { failure, success } from "../utils/response";
import { AuthCode, GenericCode } from "../utils/responseCodes";
import { hashPassword } from "../utils/hash";
import { getZodiacSign } from "../utils/zodiac";
import { generateToken } from "../utils/token";
import { logger } from "../utils/logger";

export async function signup(req: Request<{}, {}, SignupInput>, res: Response) {
  const { name, email, password, birthdate } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json(
        failure(AuthCode.EMAIL_ALREADY_EXISTS, "Email already in use", {
          email: "Taken",
        })
      );
    }

    const hashed = await hashPassword(password);
    const zodiacSign = getZodiacSign(new Date(birthdate));

    const user = await User.create({
      name,
      email,
      password: hashed,
      birthdate,
      zodiacSign,
    });

    const token = generateToken(user.id);

    return res.status(201).json(
      success(AuthCode.USER_REGISTERED, "User registered successfully", {
        user: {
          id: user.id,
          email: user.email,
          zodiacSign: user.zodiacSign,
        },
        token,
      })
    );
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json(
        failure(
          GenericCode.INTERNAL_SERVER_ERROR,
          "Something went wrong on the server"
        )
      );
  }
}

export async function login(req: Request<{}, {}, LoginInput>, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json(
          failure(AuthCode.USER_NOT_FOUND, "Invalid email or password", {})
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(
          failure(AuthCode.INVALID_CREDENTIALS, "Invalid email or password", {})
        );
    }

    const token = generateToken(user.id);

    return res.status(200).json(
      success(AuthCode.USER_LOGGED_IN, "User logged in successfully", {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          zodiacSign: user.zodiacSign,
          birthdate: user.birthdate,
        },
        token,
      })
    );
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json(
        failure(
          GenericCode.INTERNAL_SERVER_ERROR,
          "Something went wrong on the server"
        )
      );
  }
}
