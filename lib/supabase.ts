import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars are not set.");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Keep a named export for convenience
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type Response = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  // Task 1
  task1_completed: string;
  task1_ease: number;
  task1_feedback: string;
  // Task 2
  task2_completed: string;
  task2_ease: number;
  task2_feedback: string;
  // Task 3
  task3_completed: string;
  task3_ease: number;
  task3_feedback: string;
  // Task 4
  task4_completed: string;
  task4_ease: number;
  task4_feedback: string;
  // Overall
  overall_navigation: number;
  overall_most_useful: string;
  overall_missing: string;
  overall_exchange_likelihood: number;
  overall_encouragement: string;
  overall_change: string;
};
