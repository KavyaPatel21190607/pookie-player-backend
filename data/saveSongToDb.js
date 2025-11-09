import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Song Schema (same as your Song model)
const parsedTokenSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['element', 'text', 'space'],
    required: true
  },
  symbol: String,
  name: String,
  number: Number,
  value: String
}, { _id: false });

const lyricLineSchema = new mongoose.Schema({
  timestamp: {
    type: Number,
    required: true
  },
  originalLine: {
    type: String,
    required: true
  },
  parsedTokens: [parsedTokenSchema]
}, { _id: false });

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide song title'],
      trim: true
    },
    artist: {
      type: String,
      required: [true, 'Please provide artist name'],
      trim: true
    },
    coverColor: {
      type: String,
      default: 'from-pink-300 to-purple-300'
    },
    duration: {
      type: Number,
      required: [true, 'Please provide song duration'],
      min: 0
    },
    audioUrl: {
      type: String,
      required: [true, 'Please provide audio URL']
    },
    coverUrl: {
      type: String
    },
    lyrics: [lyricLineSchema],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Song = mongoose.model('Song', songSchema);

// Periodic elements map
const periodicElements = {
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
  'Zn': { symbol: 'Zn', name: 'Zinc', number: 30 },
  'Te': { symbol: 'Te', name: 'Tellurium', number: 52 },
  'U': { symbol: 'U', name: 'Uranium', number: 92 },
  'At': { symbol: 'At', name: 'Astatine', number: 85 },
  'Ta': { symbol: 'Ta', name: 'Tantalum', number: 73 },
  'Hi': { symbol: 'I', name: 'Iodine', number: 53 },
  'I': { symbol: 'I', name: 'Iodine', number: 53 },
  'Se': { symbol: 'Se', name: 'Selenium', number: 34 },
  'J': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'K': { symbol: 'K', name: 'Potassium', number: 19 },
  'Y': { symbol: 'Y', name: 'Yttrium', number: 39 },
  'Ag': { symbol: 'Ag', name: 'Silver', number: 47 },
  'Ba': { symbol: 'Ba', name: 'Barium', number: 56 },
  'Th': { symbol: 'Th', name: 'Thorium', number: 90 },
  'W': { symbol: 'W', name: 'Tungsten', number: 74 },
  'Ho': { symbol: 'Ho', name: 'Holmium', number: 67 },
  'Ka': { symbol: 'K', name: 'Potassium', number: 19 },
  'Mi': { symbol: 'Md', name: 'Mendelevium', number: 101 },
  'Mn': { symbol: 'Mn', name: 'Manganese', number: 25 },
  'Zr': { symbol: 'Zr', name: 'Zirconium', number: 40 },
  'Ga': { symbol: 'Ga', name: 'Gallium', number: 31 },
  'Bi': { symbol: 'Bi', name: 'Bismuth', number: 83 },
  'Lu': { symbol: 'Lu', name: 'Lutetium', number: 71 },
  'Kh': { symbol: 'Kr', name: 'Krypton', number: 36 },
  'Kr': { symbol: 'Kr', name: 'Krypton', number: 36 },
  'Re': { symbol: 'Re', name: 'Rhenium', number: 75 },
  'Nd': { symbol: 'Nd', name: 'Neodymium', number: 60 },
  'Ar': { symbol: 'Ar', name: 'Argon', number: 18 },
  'Ti': { symbol: 'Ti', name: 'Titanium', number: 22 },
  'Ni': { symbol: 'Ni', name: 'Nickel', number: 28 },
  'Ra': { symbol: 'Ra', name: 'Radium', number: 88 },
  'So': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Ro': { symbol: 'Rn', name: 'Radon', number: 86 },
  'Di': { symbol: 'Dy', name: 'Dysprosium', number: 66 },
  'Dy': { symbol: 'Dy', name: 'Dysprosium', number: 66 },
  'To': { symbol: 'Th', name: 'Thorium', number: 90 },
  'Bh': { symbol: 'Bh', name: 'Bohrium', number: 107 },
  'Sa': { symbol: 'S', name: 'Sulfur', number: 16 },
  'Je': { symbol: 'Ge', name: 'Germanium', number: 32 },
  'Ge': { symbol: 'Ge', name: 'Germanium', number: 32 },
  'E': { symbol: 'Es', name: 'Einsteinium', number: 99 },
  'Es': { symbol: 'Es', name: 'Einsteinium', number: 99 },
  'De': { symbol: 'Ds', name: 'Darmstadtium', number: 110 },
  'Mu': { symbol: 'Mo', name: 'Molybdenum', number: 42 },
  'Mo': { symbol: 'Mo', name: 'Molybdenum', number: 42 }
};

// Parse element string like "(ZnNa)" into tokens
function parseElementString(elementStr, wordValue) {
  const tokens = [];
  // Remove parentheses and split by uppercase letters
  const cleaned = elementStr.replace(/[()]/g, '');
  const matches = cleaned.match(/[A-Z][a-z]?/g) || [];
  
  matches.forEach(symbol => {
    const element = periodicElements[symbol];
    if (element) {
      tokens.push({
        type: 'element',
        symbol: element.symbol,
        name: element.name,
        number: element.number,
        value: symbol.toLowerCase()
      });
    } else {
      tokens.push({
        type: 'text',
        value: symbol.toLowerCase()
      });
    }
  });
  
  return tokens;
}

// Convert lyrics.json to song format
function convertLyricsToSong() {
  const lyricsPath = join(__dirname, 'lyrics.json');
  const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));
  
  const lyrics = [];
  
  Object.keys(lyricsData).forEach(timeRange => {
    const [start, end] = timeRange.split('-').map(Number);
    const { lyrics: originalLine, elements } = lyricsData[timeRange];
    
    // Parse elements string like "(ZnNa) (TeU) (AtTa) (NaHi)"
    const words = elements.split(' ');
    const parsedTokens = [];
    
    words.forEach((word, index) => {
      const tokens = parseElementString(word, originalLine);
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
  
  return lyrics;
}

// Main function
async function saveSongToDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Convert lyrics
    const lyrics = convertLyricsToSong();
    
    // Create song object
    const songData = {
      title: 'Finding Her',
      artist: 'The Elements',
      coverColor: 'from-pink-300 to-purple-300',
      duration: 52,
      audioUrl: 'https://placeholder-audio-url.com/finding-her.mp3', // Update with actual Supabase URL
      lyrics: lyrics,
      isActive: true
    };
    
    // Save to database
    const song = await Song.create(songData);
    
    console.log('✅ Song saved to database successfully!');
    console.log(`📝 Song ID: ${song._id}`);
    console.log(`🎵 Title: ${song.title}`);
    console.log(`🎤 Artist: ${song.artist}`);
    console.log(`⏱️  Duration: ${song.duration} seconds`);
    console.log(`📊 Total lyrics lines: ${song.lyrics.length}`);
    
    mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
saveSongToDatabase();
