import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let isConnected = false;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Supabase credentials missing in environment variables');
  console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env file');
} else {
  isConnected = true;
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Function to verify Supabase connection
export const verifySupabaseConnection = async () => {
  if (!isConnected) {
    return { connected: false, message: 'Supabase credentials not configured' };
  }

  try {
    // Try to list buckets to verify connection
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Supabase Connection Failed:', error.message);
      return { connected: false, message: error.message };
    }
    
    console.log('✅ Supabase Connected');
    console.log(`📦 Storage Buckets: ${data.length} found`);
    return { connected: true, buckets: data.length };
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
    return { connected: false, message: error.message };
  }
};

// Helper function to get public URL from storage
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to list files in storage
export const listFiles = async (bucket, folder = '') => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder);
    
    if (error) {
      console.error('Error listing files:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in listFiles:', error);
    return [];
  }
};
