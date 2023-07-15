import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../libs/redis";

// delete discord user from redis
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query as Record<string, string>;
  console.log('delete:', address);
  if (!address) return res.status(400).send("Missing address");
  const del = await redis.del(address);
  console.log(del);
  res.status(200).json({ success: true });
}