import { useEffect, useState } from "react";
import { initSupabase } from "../lib/supabase"

const supabase = initSupabase();

type ServerUser = {
  id: string
  full_name: string
  avatar_url: string
  email: string
}
export const useUser = (id?: string) => {
  const [user, setUser] = useState<ServerUser | null>(null);

  const fetchUser = async (id: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", id);

    if (error || !data || data.length == 0) return;

    return setUser(data[0]);
  }

  useEffect(() => {
    if (id) {
      fetchUser(id);
      const userListener = supabase
        .from("users")
        .on('*', (payload) => setUser(payload.new))
        .subscribe();

      return () => {
        userListener.unsubscribe();
      }
    }
  }, []);


  return {
    user
  }
}

type ServerAddress = {
  id: string
  address: string
  username: string
}

export const useAddress = (id: string) => {
  const [address, setAddress] = useState<ServerAddress | null>(null);

  const fetchAddress = async (id: string) => {
    const { data, error } = await supabase.from("addresses").select("*").eq("id", id);

    if (error || !data || data.length == 0) return;

    return setAddress(data[0]);
  }

  useEffect(() => {
    fetchAddress(id);
    const addressListener = supabase
      .from("addresses")
      .on('*', (payload) => {
        setAddress(payload.new)
      })
      .subscribe();

    return () => {
      addressListener.unsubscribe();
    }
  }, []);

  const saveAddress = async (id: string, address: string) => {
    return await supabase.from("addresses").update({address: address}).match({id: id});
  }

  const saveUsername = async (id: string, username: string) => {
    return await supabase.from("addresses").update({username: username}).match({id: id});
  }

  return {
    address,
    saveAddress,
    saveUsername
  }
}

