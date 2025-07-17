import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgvatqjigogokkydmvir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndmF0cWppZ29nb2treWRtdmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNTg1NzAsImV4cCI6MjAzNjczNDU3MH0.QPgHRwKh53hrKj1X13hpt0WcfFnhqJsl_NyYOt7lsrE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    const { data: available, error } = await supabase
      .from('promocode')
      .select('*')
      .eq('used', false);

    if (error) throw error;
    if (!available || available.length === 0) {
      return res.status(200).json({ success: false, message: 'Промокоды закончились' });
    }

    const random = available[Math.floor(Math.random() * available.length)];

    const { error: updateError } = await supabase
      .from('promocode')
      .update({ used: true })
      .eq('id', random.id);

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      promo: {
        code: random.code,
        discount: random.discount
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}
