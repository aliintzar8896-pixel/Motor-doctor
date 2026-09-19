import User from '../models/User.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { emailOrPhone, role } = req.body;
      if (!emailOrPhone) {
        return res.status(400).json({ success: false, message: 'Email or phone number is required' });
      }

      let user = User.findByEmailOrPhone(emailOrPhone);
      if (!user) {
        // Auto-register convenience for seamless demo
        user = User.create({
          name: emailOrPhone.split('@')[0],
          phone: emailOrPhone.includes('@') ? '+91 9368121012' : emailOrPhone,
          email: emailOrPhone.includes('@') ? emailOrPhone : 'user@motordoctor.in',
          role: role || 'driver',
        });
      }

      const token = user.id; // token representation
      return res.json({
        success: true,
        user,
        token,
        message: 'Login successful',
      });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { name, phone, email, role, vehicleModel, vehicleNumber } = req.body;
      if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Name and phone are required' });
      }

      let user = User.findByEmailOrPhone(phone) || (email ? User.findByEmailOrPhone(email) : null);
      if (user) {
        user = User.update(user.id, { name, role: role || user.role, vehicleModel, vehicleNumber });
      } else {
        user = User.create({ name, phone, email, role, vehicleModel, vehicleNumber });
      }

      const token = user.id;
      return res.status(201).json({
        success: true,
        user,
        token,
        message: 'Registration successful',
      });
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req, res, next) => {
    try {
      const user = req.user || User.findById('usr-101');
      return res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'usr-101';
      const updated = User.update(userId, req.body);
      return res.json({ success: true, user: updated, message: 'Profile updated' });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
