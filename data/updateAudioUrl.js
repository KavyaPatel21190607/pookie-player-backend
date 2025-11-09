import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import Song model
import Song from '../models/Song.js';

async function updateAudioUrl() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Update the song with the correct audio URL
    const audioUrl = 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Jana%20Mere%20Sawalo%20Ka%20Manzar%20Tu%20Ringtone%20Download%20-%20MobCup.Com.Co.mp3';
    
    const result = await Song.findOneAndUpdate(
      { title: 'Finding Her' },
      { audioUrl: audioUrl },
      { new: true }
    );
    
    if (!result) {
      console.log('❌ Song not found');
      return;
    }
    
    console.log('✅ Audio URL updated successfully!');
    console.log(`🎵 Song: ${result.title}`);
    console.log(`🔊 Audio URL: ${result.audioUrl}`);
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAudioUrl();
