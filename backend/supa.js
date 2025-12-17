import { supabase } from './supabaseClient.js';

async function testConnection() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Supabase connection failed:', error);
  } else {
    console.log('Supabase connection successful:', data);
  }
}

testConnection();
