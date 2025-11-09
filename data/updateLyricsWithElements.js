import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import Song from '../models/Song.js';

// Complete periodic table mapping - expanded
const elementMap = {
  'H': { symbol: 'H', name: 'Hydrogen', number: 1 },
  'He': { symbol: 'He', name: 'Helium', number: 2 },
  'Li': { symbol: 'Li', name: 'Lithium', number: 3 },
  'Be': { symbol: 'Be', name: 'Beryllium', number: 4 },
  'B': { symbol: 'B', name: 'Boron', number: 5 },
  'C': { symbol: 'C', name: 'Carbon', number: 6 },
  'N': { symbol: 'N', name: 'Nitrogen', number: 7 },
  'O': { symbol: 'O', name: 'Oxygen', number: 8 },
  'F': { symbol: 'F', name: 'Fluorine', number: 9 },
  'Ne': { symbol: 'Ne', name: 'Neon', number: 10 },
  'Na': { symbol: 'Na', name: 'Sodium', number: 11 },
  'Mg': { symbol: 'Mg', name: 'Magnesium', number: 12 },
  'Al': { symbol: 'Al', name: 'Aluminum', number: 13 },
  'Si': { symbol: 'Si', name: 'Silicon', number: 14 },
  'P': { symbol: 'P', name: 'Phosphorus', number: 15 },
  'S': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Cl': { symbol: 'Cl', name: 'Chlorine', number: 17 },
  'Ar': { symbol: 'Ar', name: 'Argon', number: 18 },
  'K': { symbol: 'K', name: 'Potassium', number: 19 },
  'Ca': { symbol: 'Ca', name: 'Calcium', number: 20 },
  'Ti': { symbol: 'Ti', name: 'Titanium', number: 22 },
  'V': { symbol: 'V', name: 'Vanadium', number: 23 },
  'Cr': { symbol: 'Cr', name: 'Chromium', number: 24 },
  'Mn': { symbol: 'Mn', name: 'Manganese', number: 25 },
  'Fe': { symbol: 'Fe', name: 'Iron', number: 26 },
  'Co': { symbol: 'Co', name: 'Cobalt', number: 27 },
  'Ni': { symbol: 'Ni', name: 'Nickel', number: 28 },
  'Cu': { symbol: 'Cu', name: 'Copper', number: 29 },
  'Zn': { symbol: 'Zn', name: 'Zinc', number: 30 },
  'Ga': { symbol: 'Ga', name: 'Gallium', number: 31 },
  'Ge': { symbol: 'Ge', name: 'Germanium', number: 32 },
  'As': { symbol: 'As', name: 'Arsenic', number: 33 },
  'Se': { symbol: 'Se', name: 'Selenium', number: 34 },
  'Br': { symbol: 'Br', name: 'Bromine', number: 35 },
  'Kr': { symbol: 'Kr', name: 'Krypton', number: 36 },
  'Y': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Zr': { symbol: 'Zr', name: 'Zirconium', number: 40 },
  'Mo': { symbol: 'Mo', name: 'Molybdenum', number: 42 },
  'Ag': { symbol: 'Ag', name: 'Silver', number: 47 },
  'In': { symbol: 'In', name: 'Indium', number: 49 },
  'Sn': { symbol: 'Sn', name: 'Tin', number: 50 },
  'I': { symbol: 'I', name: 'Iodine', number: 53 },
  'Ba': { symbol: 'Ba', name: 'Barium', number: 56 },
  'La': { symbol: 'La', name: 'Lanthanum', number: 57 },
  'Nd': { symbol: 'Nd', name: 'Neodymium', number: 60 },
  'Eu': { symbol: 'Eu', name: 'Europium', number: 63 },
  'Dy': { symbol: 'Dy', name: 'Dysprosium', number: 66 },
  'Ho': { symbol: 'Ho', name: 'Holmium', number: 67 },
  'Er': { symbol: 'Er', name: 'Erbium', number: 68 },
  'Lu': { symbol: 'Lu', name: 'Lutetium', number: 71 },
  'W': { symbol: 'W', name: 'Tungsten', number: 74 },
  'Re': { symbol: 'Re', name: 'Rhenium', number: 75 },
  'Os': { symbol: 'Os', name: 'Osmium', number: 76 },
  'Pt': { symbol: 'Pt', name: 'Platinum', number: 78 },
  'Au': { symbol: 'Au', name: 'Gold', number: 79 },
  'Pb': { symbol: 'Pb', name: 'Lead', number: 82 },
  'Bi': { symbol: 'Bi', name: 'Bismuth', number: 83 },
  'At': { symbol: 'At', name: 'Astatine', number: 85 },
  'Rn': { symbol: 'Rn', name: 'Radon', number: 86 },
  'Ra': { symbol: 'Ra', name: 'Radium', number: 88 },
  'Th': { symbol: 'Th', name: 'Thorium', number: 90 },
  'Pa': { symbol: 'Pa', name: 'Protactinium', number: 91 },
  'U': { symbol: 'U', name: 'Uranium', number: 92 },
  'Bh': { symbol: 'Bh', name: 'Bohrium', number: 107 },
  'Ds': { symbol: 'Ds', name: 'Darmstadtium', number: 110 },
  'Es': { symbol: 'Es', name: 'Einsteinium', number: 99 },
  'Md': { symbol: 'Md', name: 'Mendelevium', number: 101 },
  'No': { symbol: 'No', name: 'Nobelium', number: 102 },
  'Te': { symbol: 'Te', name: 'Tellurium', number: 52 },
  'Ta': { symbol: 'Ta', name: 'Tantalum', number: 73 },
  'Kh': { symbol: 'Kr', name: 'Krypton', number: 36 },
  'Ph': { symbol: 'P', name: 'Phosphorus', number: 15 },
  'De': { symbol: 'Ds', name: 'Darmstadtium', number: 110 },
  'So': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Ro': { symbol: 'Rn', name: 'Radon', number: 86 },
  'Jo': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Di': { symbol: 'Dy', name: 'Dysprosium', number: 66 },
  'To': { symbol: 'Th', name: 'Thorium', number: 90 },
  'Je': { symbol: 'Ge', name: 'Germanium', number: 32 },
  'Sa': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Ma': { symbol: 'Mg', name: 'Magnesium', number: 12 },
  'Ka': { symbol: 'K', name: 'Potassium', number: 19 },
  'Wa': { symbol: 'W', name: 'Tungsten', number: 74 },
  'Ha': { symbol: 'H', name: 'Hydrogen', number: 1 },
  'Su': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Gu': { symbol: 'Ga', name: 'Gallium', number: 31 },
  'Mu': { symbol: 'Mo', name: 'Molybdenum', number: 42 },
  'Tu': { symbol: 'Te', name: 'Tellurium', number: 52 },
  'Ri': { symbol: 'Re', name: 'Rheium', number: 75 },
  'Mi': { symbol: 'Md', name: 'Mendelevium', number: 101 },
  'Ki': { symbol: 'K', name: 'Potassium', number: 19 },
  'Ti': { symbol: 'Ti', name: 'Titanium', number: 22 },
  'Ni': { symbol: 'Ni', name: 'Nickel', number: 28 },
  'Ra': { symbol: 'Ra', name: 'Radium', number: 88 },
  'Ya': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Ul': { symbol: 'U', name: 'Uranium', number: 92 },
  'Si': { symbol: 'Si', name: 'Silicon', number: 14 },
  'Hi': { symbol: 'I', name: 'Iodine', number: 53 },
  'Yo': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Yu': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Ku': { symbol: 'K', name: 'Potassium', number: 19 },
  'Me': { symbol: 'Md', name: 'Mendelevium', number: 101 },
  'Wo': { symbol: 'W', name: 'Tungsten', number: 74 },
  'Wh': { symbol: 'W', name: 'Tungsten', number: 74 },
  'Am': { symbol: 'Am', name: 'Americium', number: 95 },
  'Ir': { symbol: 'Ir', name: 'Iridium', number: 77 },
  'Kh': { symbol: 'Kr', name: 'Krypton', number: 36 }
};

// Parse element symbols from the formatted string like "(ZnNa)"
function parseElementsFromString(elementStr) {
  const tokens = [];
  const cleaned = elementStr.replace(/[()]/g, '');
  
  // Match capital letter followed by optional lowercase letter
  const matches = cleaned.match(/[A-Z][a-z]?/g) || [];
  
  matches.forEach(symbol => {
    const element = elementMap[symbol];
    if (element) {
      tokens.push({
        type: 'element',
        symbol: element.symbol,
        name: element.name,
        number: element.number,
        value: symbol.toLowerCase()
      });
    } else {
      // If not found in element map, add as text
      tokens.push({
        type: 'text',
        value: symbol.toLowerCase()
      });
    }
  });
  
  return tokens;
}

async function updateSongLyrics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Read lyrics.json
    const lyricsPath = join(__dirname, 'lyrics.json');
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));
    
    const lyrics = [];
    
    // Process each lyric line
    Object.keys(lyricsData).forEach(timeRange => {
      const [start] = timeRange.split('-').map(Number);
      const { lyrics: originalLine, elements } = lyricsData[timeRange];
      
      const words = elements.split(' ');
      const parsedTokens = [];
      
      words.forEach((word, index) => {
        const tokens = parseElementsFromString(word);
        parsedTokens.push(...tokens);
        
        // Add space between words
        if (index < words.length - 1) {
          parsedTokens.push({ type: 'space', value: ' ' });
        }
      });
      
      lyrics.push({
        timestamp: start,
        originalLine: originalLine,
        parsedTokens: parsedTokens
      });
    });
    
    // Update the song in database
    const result = await Song.findOneAndUpdate(
      { title: 'Finding Her' },
      { lyrics: lyrics },
      { new: true }
    );
    
    if (!result) {
      console.log('❌ Song not found');
      return;
    }
    
    console.log('✅ Song lyrics updated successfully!');
    console.log(`🎵 Song: ${result.title}`);
    console.log(`📊 Total lyrics lines: ${result.lyrics.length}\n`);
    
    // Display sample
    console.log('📝 Sample lyric lines:\n');
    result.lyrics.slice(0, 3).forEach((line, idx) => {
      console.log(`[${line.timestamp}s] ${line.originalLine}`);
      const elements = line.parsedTokens
        .filter(t => t.type === 'element')
        .map(t => `${t.symbol}(${t.value})`)
        .join(' ');
      console.log(`Elements: ${elements}`);
      console.log('---');
    });
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSongLyrics();
