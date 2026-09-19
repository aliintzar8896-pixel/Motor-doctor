import db from '../config/db.js';

export class User {
  static findById(id) {
    return db.users.find(u => u.id === id) || null;
  }

  static findByEmailOrPhone(emailOrPhone) {
    return (
      db.users.find(
        u => u.email === emailOrPhone || u.phone === emailOrPhone
      ) || null
    );
  }

  static create(userData) {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email || '',
      role: userData.role || 'driver',
      vehicleModel: userData.vehicleModel || '',
      vehicleNumber: userData.vehicleNumber || '',
    };
    db.users.push(newUser);
    return newUser;
  }

  static update(id, updates) {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    return db.users[userIndex];
  }
}

export default User;
