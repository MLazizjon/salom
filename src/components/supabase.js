import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://grrcuyirxtnohzuqmkpj.supabase.co";
const SUPABASE_KEY = "sb_publishable_A83uEqt8hKworIBH6u1GiA_4FZEdA3X";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);