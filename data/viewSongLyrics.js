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

async function viewSongLyrics() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find the song
    const song = await Song.findOne({ title: 'Finding Her' });
    
    if (!song) {
      console.log('❌ Song not found');
      return;
    }
    
    console.log(`🎵 Song: ${song.title}`);
    console.log(`🎤 Artist: ${song.artist}`);
    console.log(`⏱️  Duration: ${song.duration} seconds`);
    console.log(`� Audio URL: ${song.audioUrl}`);
    console.log(`�📊 Total lyrics lines: ${song.lyrics.length}\n`);
    
    console.log('📝 LYRICS:\n');
    song.lyrics.forEach((line, index) => {
      console.log(`[${line.timestamp}s] ${line.originalLine}`);
      console.log(`Elements: ${line.parsedTokens.filter(t => t.type === 'element').map(t => t.symbol).join(' ')}`);
      console.log('---');
    });
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewSongLyrics();
