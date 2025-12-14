/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bookRouter from './routes/book-appointment/index.js';
import adminRouter from './routes/admin/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { PORT = "3000" } = process.env;

const app = express();

app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  }),
);

app.use("/book-appointment", bookRouter);

app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});