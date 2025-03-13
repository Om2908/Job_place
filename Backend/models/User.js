const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  provider: { type: String, enum: ['local', 'google', 'linkedin','github'] },
  googleId: String,
  linkedinId: String,
  role: {
    type: String,
    enum: ['job_seeker', 'employer', 'admin'],
    default: 'job_seeker'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profile: {
    experience: [{
      title: String,
      company: String,
      years: Number,
      description: String
    }],
    skills: [String],
    resume: String,
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    certifications: [String],
  },
  savedJobs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  }],
  company: {
    name: String,
    website: String,
    location: String,
    description: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (Number.isInteger(v) && v.toString().length === 6);
      },
      message: 'OTP must be a 6-digit number'
    }
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//  compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const user = await this.constructor.findById(this._id).select('+password');
    if (!user) return false;
    
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

userSchema.pre('save', function(next) {
  if (!this.profile) {
    this.profile = {
      experience: [],
      skills: [],
      education: [],
      certifications: []
    };
  }
  next();
});

if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Create new model
const User = mongoose.model('User', userSchema);

module.exports = User;
