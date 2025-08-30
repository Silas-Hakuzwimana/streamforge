const User = require('../models/User');
const { uploadImage } = require('../services/cloudinary.service');

// GET CURRENT USER
exports.getProfile = async (req, res) => {
  let user = req.user;
  if (!user && req.user?.id) {
    user = await User.findById(req.user.id);
  }
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    bio: user.bio,
    twoFactorEnabled: user.twoFactorEnabled,
  });
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const user = req.user;
  const { name, bio } = req.body;

  if (name) user.name = name;
  if (bio) user.bio = bio;

  if (req.file) {
    try {
      const imageUrl = await uploadImage(
        req.file.path,
        'streamforge_profile_pics',
      );
      user.profilePic = imageUrl;
    } catch (error) {
      return res
        .status(500)
        .json({
          message: 'Profile picture upload failed',
          error: error.message,
        });
    }
  }

  await user.save();

  res.status(200).json({
    message: 'Profile updated successfully',
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
    },
  });
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const user = req.user;
  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  const user = req.user;

  await User.findByIdAndDelete(user._id);

  res.clearCookie('token');
  res.status(200).json({ message: 'Account deleted successfully' });
};
