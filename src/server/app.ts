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
 * The App component creates and initializes an Express app.
 */

import type { CorsOptions } from "cors";
import cors from "cors";
import express, { type Application } from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const OPTIONS: CorsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "OPTIONS"],
  preflightContinue: false,
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class App {
  public readonly expressApplication: Application;

  constructor() {
    this.expressApplication = express();
    this.installMiddleware();
    this.addRoutes();
  }

  /**
   * Adds routes to the Express app.
   */
  private addRoutes(): void {
    const publicPath = path.resolve(__dirname, "../web");

    this.expressApplication.use(express.static(publicPath));

    this.expressApplication.get("/*splat", (req, res) => {
      res.sendFile(path.join(publicPath, "index.html"), (err) => {
        if (err) {
          // Prevent headers already sent error if static middleware already handled it
          if (!res.headersSent) {
            res.status(404).send("SPA Entry Point (index.html) missing.");
          }
        }
      });
    });
  }

  private installMiddleware(): void {
    this.expressApplication.use(cors(OPTIONS));
    this.expressApplication.use(express.json());
    // 'dev' or 'tiny' is great for macOS console debugging
    this.expressApplication.use(morgan("dev"));
  }
}
