/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 David Padgett/Summit Street Technologies.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @file
 * Contains functions that condition the Vite .env file for NPM dev and build
 * scripts.
 */

import { encode } from "@summitstreet/web-app-sdk-ts";
import crypto from "crypto";
import { parse } from "dotenv";
import fs from "fs";
import path from "path";

const generateFragment = (length: number = 21): string => {
  return crypto.randomBytes(length).toString("base64url");
};

export const updateEnvFile = () => {
  const envPath = path.resolve(process.cwd(), ".env");
  let viteConfig: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const fileContent = fs.readFileSync(envPath, "utf8");
    viteConfig = parse(fileContent);
  }

  const get = (k: string): string => viteConfig[k] ?? process.env[k] ?? "";

  viteConfig.INFO_VCARD = `"${get("INFO_VCARD")}"`;
  const keys = {
    VITE_KEY_1: generateFragment(),
    VITE_KEY_2: generateFragment(),
    VITE_KEY_3: generateFragment(),
  };

  const key = keys.VITE_KEY_1 + keys.VITE_KEY_2 + keys.VITE_KEY_3;
  const contactConfig = {
    VITE_PRINCIPAL_EMAIL_ADDRESS: encode(get("PRINCIPAL_EMAIL_ADDRESS"), key),
    VITE_INFO_EMAIL_ADDRESS: encode(get("INFO_EMAIL_ADDRESS"), key),
    VITE_INFO_VCARD: encode(viteConfig.INFO_VCARD, key),
  };

  viteConfig = { ...viteConfig, ...contactConfig, ...keys };

  const envContent = Object.entries(viteConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envPath, envContent, "utf8");
};
