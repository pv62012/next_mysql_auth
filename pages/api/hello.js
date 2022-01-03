// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { pool } from "../../utils/database";

export default function handler(req, res) {
  pool;
  res.status(200).json({ name: "John Doe" });
}
