import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import to from 'await-to-js';
import asyncMiddleware from '../../lib/asyncMiddleware';
import { initSupabase } from '../../lib/supabase';

type FederationResponse = {
  stellar_address: string
  account_id: string
  memo_type?: string
  memo?: string
}

type Error = {
  error: string
}

function validAddress(name: string): boolean {
  if(!process.env.NEXT_PUBLIC_FEDERATION_DOMAIN) throw new ErrorEvent("NEXT_PUBLIC_FEDERATION_DOMAIN must be defined")
  const parts: string[] = name.split("*");
  return parts[1] == process.env.NEXT_PUBLIC_FEDERATION_DOMAIN
}

const cors = asyncMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: "*",
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

const supabase = initSupabase(true);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FederationResponse | Error>
) {
  const { q, type } = req.query;

  if (!req.method || !['GET'].includes(req.method)) return res.status(405).end();

  if (!q || !type || (type == 'name' && !validAddress(q as string))) return res.status(400).end();

  const username = (q as string).split("*")[0];
  
  const [corsError] = await to(cors(req, res));
  if (corsError) res.status(500).json({ error: "Internal server error" });

  const { data, error } = await supabase.from("addresses").select("*").eq("username", username);

  if(error) return res.status(500).json({error: "Unable to search for user"});

  if(!data || data.length == 0) return res.status(404).end();

  res.json({
    stellar_address: `${data[0]['username']}*${process.env.NEXT_PUBLIC_FEDERATION_DOMAIN}`,
    account_id: data[0]['address']
  })
}
