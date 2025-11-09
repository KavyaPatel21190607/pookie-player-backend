import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          favoriteCount: user.favoriteCount,
          playlistCount: user.playlistCount,
          favorites: user.favorites,
          playlists: user.playlists,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Add song to favorites
// @route   POST /api/users/favorites/:songId
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { songId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if song is already in favorites
    if (user.favorites.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song already in favorites'
      });
    }

    user.favorites.push(songId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Song added to favorites',
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Add to Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// @desc    Remove song from favorites
// @route   DELETE /api/users/favorites/:songId
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const { songId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== songId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Song removed from favorites',
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Remove from Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};

// @desc    Get user's favorite songs
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites', 'title artist audioUrl duration coverColor lyrics');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - just deactivate the account
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};
