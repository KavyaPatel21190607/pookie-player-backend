import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=P'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
      }
    ],
    playlists: [
      {
        name: String,
        songs: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
          }
        ],
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get user without sensitive data
userSchema.methods.toPublicJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Virtual for favorite count
userSchema.virtual('favoriteCount').get(function () {
  return this.favorites ? this.favorites.length : 0;
});

// Virtual for playlist count
userSchema.virtual('playlistCount').get(function () {
  return this.playlists ? this.playlists.length : 0;
});

const User = mongoose.model('User', userSchema);

export default User;
