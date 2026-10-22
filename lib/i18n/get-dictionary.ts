<<<<<<< HEAD
import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

/** Name of the cookie that stores the active UI locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * The shape of every dictionary is locked to `en.json` — the source of
 * truth. Client components import this type with `import type` (erased at
 * compile time), so the `server-only` guard never reaches the browser.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/**
 * Resolves the active locale:
 *
 *  1. The `NEXT_LOCALE` cookie wins when present.
 *  2. Otherwise resolves to the default locale ("en").
 *
 * Wrapped in React's `cache()` so every server component in a request
 * shares one resolution (cookie read) instead of repeating work.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  if (raw === "ar" || raw === "en") return raw;
  return defaultLocale;
});

/** Server-side dictionary loader for the active locale. */
export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}
=======
import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

/** Name of the cookie that stores the active UI locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * The shape of every dictionary is locked to `en.json` — the source of
 * truth. Client components import this type with `import type` (erased at
 * compile time), so the `server-only` guard never reaches the browser.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/**
 * Resolves the active locale:
 *
 *  1. The `NEXT_LOCALE` cookie wins when present.
 *  2. Otherwise resolves to the default locale ("en").
 *
 * Wrapped in React's `cache()` so every server component in a request
 * shares one resolution (cookie read) instead of repeating work.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  if (raw === "ar" || raw === "en") return raw;
  return defaultLocale;
});

/** Server-side dictionary loader for the active locale. */
export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}
>>>>>>> f0c90fc (Latest Front End)
