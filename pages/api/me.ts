import type { NextApiRequest, NextApiResponse } from 'next'
import { initSupabase } from '../../lib/supabase';
const supabase = initSupabase(true);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'DELETE') return res.status(405).end();
  const id = req.body.uid as string;
  const {error: errorDeleteAddress} = await supabase.from('addresses').delete().eq('id', id);
  const {error: errorDeleteUser} = await supabase.from('users').delete().eq('id', id);
  const { error } = await supabase.auth.api.deleteUser(id, process.env.SUPABASE_SERVICE_KEY as string)
  if(errorDeleteAddress || errorDeleteUser || error) return res.status(500).json(errorDeleteAddress || errorDeleteUser || error);

  res.json({message: "User deleted"});
}