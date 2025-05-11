// utils/utils.ts
import { createClient } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// إعدادات Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// دمج الكلاسات باستخدام tailwind-merge و clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
