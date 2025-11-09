import Song from '../models/Song.js';
import { supabase, getPublicUrl, listFiles } from '../config/supabase.js';

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: { songs }
    });
  } catch (error) {
    console.error('Get All Songs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching songs',
      error: error.message
    });
  }
};

// @desc    Get single song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song || !song.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { song }
    });
  } catch (error) {
    console.error('Get Song Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message
    });
  }
};

// @desc    Sync songs from Supabase storage
// @route   POST /api/songs/sync
// @access  Private (Admin only)
export const syncSongsFromStorage = async (req, res) => {
  try {
    const bucketName = 'public-bucket';
    const folderName = 'Musics';

    // List all files in the Musics folder
    const files = await listFiles(bucketName, folderName);

    if (!files || files.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No files found in storage',
        data: { synced: 0 }
      });
    }

    // Filter audio files
    const audioFiles = files.filter(file => 
      file.name.endsWith('.mp3') || 
      file.name.endsWith('.wav') || 
      file.name.endsWith('.ogg') ||
      file.name.endsWith('.m4a')
    );

    let syncedCount = 0;

    for (const file of audioFiles) {
      const audioUrl = getPublicUrl(bucketName, `${folderName}/${file.name}`);
      
      // Extract song info from filename (format: Artist - Title.mp3)
      const fileName = file.name.replace(/\.(mp3|wav|ogg|m4a)$/i, '');
      const [artist, title] = fileName.includes(' - ') 
        ? fileName.split(' - ').map(s => s.trim())
        : ['Unknown Artist', fileName];

      // Check if song already exists
      const existingSong = await Song.findOne({ audioUrl });

      if (!existingSong) {
        await Song.create({
          title: title || 'Untitled',
          artist: artist || 'Unknown Artist',
          audioUrl,
          duration: 180, // Default duration, can be updated later
          coverColor: getRandomCoverColor(),
          lyrics: []
        });
        syncedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${syncedCount} new songs from storage`,
      data: { synced: syncedCount, total: audioFiles.length }
    });
  } catch (error) {
    console.error('Sync Songs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing songs from storage',
      error: error.message
    });
  }
};

// @desc    Create new song
// @route   POST /api/songs
// @access  Private (Admin only)
export const createSong = async (req, res) => {
  try {
    const { title, artist, audioUrl, duration, coverColor, coverUrl, lyrics } = req.body;

    // Validation
    if (!title || !artist || !audioUrl || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, artist, audioUrl, duration)'
      });
    }

    const song = await Song.create({
      title,
      artist,
      audioUrl,
      duration,
      coverColor: coverColor || getRandomCoverColor(),
      coverUrl,
      lyrics: lyrics || [],
      uploadedBy: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: { song }
    });
  } catch (error) {
    console.error('Create Song Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating song',
      error: error.message
    });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private (Admin only)
export const updateSong = async (req, res) => {
  try {
    const { title, artist, duration, coverColor, coverUrl, lyrics } = req.body;

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Update fields
    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (duration) song.duration = duration;
    if (coverColor) song.coverColor = coverColor;
    if (coverUrl) song.coverUrl = coverUrl;
    if (lyrics) song.lyrics = lyrics;

    await song.save();

    res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: { song }
    });
  } catch (error) {
    console.error('Update Song Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating song',
      error: error.message
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private (Admin only)
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Soft delete
    song.isActive = false;
    await song.save();

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    console.error('Delete Song Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting song',
      error: error.message
    });
  }
};

// Helper function to get random cover color
function getRandomCoverColor() {
  const colors = [
    'from-pink-300 to-purple-300',
    'from-blue-300 to-pink-300',
    'from-purple-300 to-blue-300',
    'from-red-300 to-pink-300',
    'from-yellow-300 to-green-300',
    'from-green-300 to-blue-300',
    'from-pink-400 to-purple-400',
    'from-purple-400 to-blue-400'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
