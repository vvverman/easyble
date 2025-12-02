import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { magicLink, emailOTP } from "better-auth/plugins";
import { sendMail } from "./lib/mailer";

const client = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  appName: "easyble",
  plugins: [
    nextCookies(),
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "forget-password"
            ? "Easyble: восстановление доступа"
            : "Easyble: код входа";
        const text = `Ваш код: ${otp}. Действителен 5 минут.`;
        const html = `<p>Ваш код:</p><div style="font-size:24px;font-weight:700;letter-spacing:4px;">${otp}</div><p>Код действует 5 минут.</p>`;

        try {
          await sendMail({ to: email, subject, text, html });
        } catch (err) {
          console.error("Failed to send OTP email", err);
          throw err;
        }
      },
    }),
    magicLink({
      async sendMagicLink({ email, url }) {
        const appUrl =
          process.env.BETTER_AUTH_URL ??
          process.env.NEXT_PUBLIC_APP_URL ??
          "http://localhost:3100";
        const magicLink = url.startsWith("http")
          ? url
          : `${appUrl.replace(/\/$/, "")}${url}`;

        try {
          console.log("[auth] Sending magic link to", email, "->", magicLink);
          await sendMail({
            to: email,
            subject: "Easyble: вход по ссылке",
            text: `Перейдите по ссылке, чтобы войти: ${magicLink}`,
            html: `<p>Перейдите по ссылке, чтобы войти:</p><p><a href="${magicLink}">${magicLink}</a></p>`,
          });
          console.log("[auth] Magic link sent to", email);
        } catch (err) {
          console.error("Failed to send magic link", err);
          throw err;
        }
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
