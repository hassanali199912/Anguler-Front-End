import { APP_BASE_HREF } from '@angular/common';
import { createRequestHandler } from '@angular/ssr';
import express from 'express';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();

// Create a request handler for Angular SSR
const handler = createRequestHandler(async (req: Request): Promise<Response | null> => {
  try {
    // Handle the request using Angular's SSR
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined
    });
    
    if (!response.ok) {
      return new Response('Not found', { status: 404 });
    }
    return response;
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

// Handle all other requests with Angular SSR
app.use(async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  try {
    const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    const webRequest = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });
    
    const response = await handler(webRequest);
    if (!response) {
      res.status(404).send('Not found');
      return;
    }

    const body = await response.text();
    const headers = Object.fromEntries(response.headers.entries());
    res.status(response.status).set(headers).send(body);
  } catch (error) {
    next(error);
  }
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (import.meta.url === import.meta.url) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
