import mongoose from 'mongoose';

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

// Index for faster queries
songSchema.index({ title: 1, artist: 1 });
songSchema.index({ isActive: 1 });

const Song = mongoose.model('Song', songSchema);

export default Song;
