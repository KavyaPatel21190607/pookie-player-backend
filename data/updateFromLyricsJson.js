import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import Song from '../models/Song.js';

async function updateSongFromJson() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Read the complete lyrics.json file
    const lyricsPath = join(__dirname, 'lyrics.json');
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));
    
    // Find the song - try to find by either title
    let song = await Song.findOne({ title: 'Finding Her' });
    
    if (!song) {
      song = await Song.findOne({ title: 'Jana Tu Aata Nahi' });
    }
    
    if (!song) {
      // If still not found, get the first song
      song = await Song.findOne({});
    }
    
    if (!song) {
      console.log('❌ No songs found in database');
      return;
    }
    
    console.log(`📝 Updating song: ${song.title}\n`);
    
    // Update song metadata from JSON
    song.title = lyricsData.title || song.title;
    song.artist = lyricsData.artist || song.artist;
    song.coverColor = lyricsData.coverColor || song.coverColor;
    song.duration = lyricsData.duration || song.duration;
    
    // Update lyrics - directly use the parsed structure from JSON
    song.lyrics = lyricsData.lyrics.map(line => ({
      timestamp: line.timestamp,
      originalLine: line.originalLine,
      parsedTokens: line.parsedTokens.map(token => ({
        type: token.type,
        symbol: token.symbol || undefined,
        name: token.name || undefined,
        number: token.number || undefined,
        value: token.value || undefined
      }))
    }));
    
    // Save to database
    await song.save();
    
    console.log(`✅ Updated ${song.lyrics.length} lyric lines\n`);
    
    // Display summary
    console.log('📊 Summary:\n');
    console.log(`Title: ${song.title}`);
    console.log(`Artist: ${song.artist}`);
    console.log(`Duration: ${song.duration}s`);
    console.log(`Color: ${song.coverColor}`);
    console.log(`Total Lines: ${song.lyrics.length}\n`);
    
    // Display all lyric lines with elements
    console.log('📝 All Lyric Lines:\n');
    song.lyrics.forEach((line, idx) => {
      const elements = line.parsedTokens
        .filter(t => t.type === 'element')
        .map(t => t.symbol)
        .join(' ');
      
      console.log(`${idx + 1}. [${line.timestamp}s] ${line.originalLine}`);
      console.log(`   Elements: ${elements}\n`);
    });
    
    mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updateSongFromJson();
