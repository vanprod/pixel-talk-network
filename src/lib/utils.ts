import { createClient } from '@supabase/supabase-js'

// إعداد رابط Supabase الخاص بك
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// دالة لجلب البيانات من Supabase
export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }
  return data
}

// دالة لإضافة رسالة إلى Supabase
export async function addMessage(content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content }])

  if (error) {
    console.error('Error adding message:', error)
    return null
  }
  return data
}
