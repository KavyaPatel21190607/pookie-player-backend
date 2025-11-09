import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import Song from '../models/Song.js';

// Mapping of lyrics files to their audio URLs
const songsConfig = [
  {
    lyricsFile: 'lyrics.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Jana%20Mere%20Sawalo%20Ka%20Manzar%20Tu%20Ringtone%20Download%20-%20MobCup.Com.Co.mp3'
  },
  {
    lyricsFile: 'lyrics2.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Paaro.mp3'
  },
  {
    lyricsFile: 'lyrics3.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Sahiba.mp3'
  },
  {
    lyricsFile: 'lyrics4.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Chaya(1961).mp3'
  },
  {
    lyricsFile: 'lyrics5.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Deewaniyat(Title-Track).mp3'
  },
  {
    lyricsFile: 'lyrics6.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/vhalam_aavo_ne.mp3'
  },
  {
    lyricsFile: 'lyrics7.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Dhun.mp3'
  },
  {
    lyricsFile: 'lyrics8.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Haseen.mp3'
  },
  {
    lyricsFile: 'lyrics9.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Pehla-Pyar.mp3'
  },
  {
    lyricsFile: 'lyrics10.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/wishes.mp3'
  },
  {
    lyricsFile: 'lyrics11.json',
    audioUrl: 'https://wsxaujmwzzaecslirvwa.supabase.co/storage/v1/object/public/public-bucket/Musics/Apna-Bana-Le(1min).mp3'
  }
];

async function addAllSongsToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const config of songsConfig) {
      const lyricsPath = join(__dirname, config.lyricsFile);
      
      // Check if lyrics file exists
      if (!fs.existsSync(lyricsPath)) {
        console.log(`⚠️  Skipping ${config.lyricsFile} - file not found`);
        skippedCount++;
        continue;
      }
      
      try {
        // Read lyrics data
        const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));
        
        // Check if song already exists (by title or audioUrl)
        let song = await Song.findOne({ 
          $or: [
            { title: lyricsData.title },
            { audioUrl: config.audioUrl }
          ]
        });
        
        if (song) {
          // Update existing song
          song.title = lyricsData.title;
          song.artist = lyricsData.artist;
          song.coverColor = lyricsData.coverColor;
          song.duration = lyricsData.duration;
          song.audioUrl = config.audioUrl;
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
          
          await song.save();
          console.log(`✅ Updated: ${lyricsData.title} - ${lyricsData.artist}`);
          updatedCount++;
        } else {
          // Create new song
          song = await Song.create({
            title: lyricsData.title,
            artist: lyricsData.artist,
            audioUrl: config.audioUrl,
            duration: lyricsData.duration,
            coverColor: lyricsData.coverColor,
            lyrics: lyricsData.lyrics.map(line => ({
              timestamp: line.timestamp,
              originalLine: line.originalLine,
              parsedTokens: line.parsedTokens.map(token => ({
                type: token.type,
                symbol: token.symbol || undefined,
                name: token.name || undefined,
                number: token.number || undefined,
                value: token.value || undefined
              }))
            })),
            isActive: true
          });
          
          console.log(`✅ Added: ${lyricsData.title} - ${lyricsData.artist}`);
          addedCount++;
        }
        
        console.log(`   Duration: ${lyricsData.duration}s | Lyrics: ${lyricsData.lyrics.length} lines\n`);
        
      } catch (error) {
        console.error(`❌ Error processing ${config.lyricsFile}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log('\n🎉 ==================== SUMMARY ====================');
    console.log(`✅ Added: ${addedCount} songs`);
    console.log(`🔄 Updated: ${updatedCount} songs`);
    console.log(`⚠️  Skipped: ${skippedCount} files`);
    console.log(`📊 Total Processed: ${addedCount + updatedCount} songs`);
    console.log('===================================================\n');
    
    // Display all songs in database
    const allSongs = await Song.find({ isActive: true }).select('title artist duration');
    console.log(`📚 All Songs in Database (${allSongs.length}):\n`);
    allSongs.forEach((song, idx) => {
      console.log(`${idx + 1}. ${song.title} - ${song.artist} (${song.duration}s)`);
    });
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

addAllSongsToDatabase();
