import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthdate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Birthdate must be in YYYY-MM-DD format",
    })
    .pipe(
      z.preprocess(
        (val) => new Date(val as string),
        z
          .date("Invalid birthdate")
          .refine((date) => !isNaN(date.getTime()), {
            message: "Invalid birthdate",
          })
          .refine((date) => date <= today, {
            message: "Birthdate cannot be in the future",
          })
          .refine(
            (date) => {
              const birthYear = date.getFullYear();
              const birthMonth = date.getMonth();
              const birthDay = date.getDate();

              const currentYear = today.getFullYear();
              const currentMonth = today.getMonth();
              const currentDay = today.getDate();

              let age = currentYear - birthYear;

              if (
                currentMonth < birthMonth ||
                (currentMonth === birthMonth && currentDay < birthDay)
              ) {
                age--;
              }
              return age >= 13;
            },
            {
              message: "You must be at least 13 years old",
            }
          )
      )
    ),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
