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
 * Creates and initializes an HTTP or HTTPS server and binds it to an Express
 * app.
 */

import http, { Server } from "http";
import type { ServerOptions } from "https";
import https from "https";

import App from "./app.ts";

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT ?? "8080");

/**
 * Creates, initializes, and starts an HTTP or HTTPS server and binds it to an
 * Express app.
 *
 * @returns
 *    A Promise<Server> that, when resolved, is the HTTP or HTTPS server that
 *    was created, initialized, and started.
 */
export async function startServer(): Promise<Server> {
  let server: Server;
  const app = new App().expressApplication;

  // If the port is not specified in the environment (e.g.: started locally) or
  // if the port is not 443, start an HTTP server.
  if (!process.env.PORT || PORT !== 443) {
    server = http.createServer(app);
  } else {
    const serverOptions: ServerOptions = {
      ca: undefined,
      cert: undefined,
      key: undefined,
      requestCert: true,
      rejectUnauthorized: true,
    };
    server = https.createServer(serverOptions, app);
  }
  server.listen(PORT, HOST, () => {
    console.log(`[server.js]: Node.js server is running on ${HOST}:${PORT}`);
  });
  return server;
}

export const server = startServer();
