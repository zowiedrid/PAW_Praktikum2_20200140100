const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';
 
exports.register = async (req, res) => {
 try {
  console.log('Register handler hit, raw body:', req.body);
   const { nama, email, password, role } = req.body;
   // Defensive sanitization
   const payloadNama = typeof nama === 'string' ? nama.trim() : nama;
   const payloadEmail = typeof email === 'string' ? email.trim() : email;
   const payloadPassword = typeof password === 'string' ? password : password;
 
   if (!payloadNama || !payloadEmail || !payloadPassword) {
     return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
   }
 
   if (role && !['mahasiswa', 'admin'].includes(role)) {
     return res.status(400).json({ message: "Role tidak valid. Harus 'mahasiswa' atau 'admin'." });
   }
 
   const hashedPassword = await bcrypt.hash(payloadPassword, 10);
   // Log for debugging field inclusion
   console.log('Register payload:', { nama: payloadNama, email: payloadEmail, role: role || 'mahasiswa' });
  console.log('User attributes keys:', Object.keys(User.rawAttributes));
   const newUser = await User.create(
     {
       nama: payloadNama,
       email: payloadEmail,
       password: hashedPassword,
       role: role || 'mahasiswa'
     },
     { fields: ['nama', 'email', 'password', 'role'] }
   );
 
   res.status(201).json({
     message: "Registrasi berhasil",
     data: { id: newUser.id, email: newUser.email, role: newUser.role }
   });
 
 } catch (error) {
   if (error.name === 'SequelizeUniqueConstraintError') {
     return res.status(400).json({ message: "Email sudah terdaftar." });
   }
   res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
 }
};
 
 
exports.login = async (req, res) => {
 try {
   const { email, password } = req.body;
 
   const user = await User.findOne({ where: { email } });
   if (!user) {
     return res.status(404).json({ message: "Email tidak ditemukan." });
   }
 
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return res.status(401).json({ message: "Password salah." });
   }
 
   const payload = {
     id: user.id,
     nama: user.nama,
     role: user.role
   };
 
   const token = jwt.sign(payload, JWT_SECRET, {
     expiresIn: '1h'
   });
 
   res.json({
     message: "Login berhasil",
     token: token
   });
 
 } catch (error) {
   res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
 }
};