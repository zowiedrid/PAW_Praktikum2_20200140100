// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = 3001; // Atau port lain yang kamu suka

// // 1. Middleware Global
// app.use(cors());
// app.use(express.json()); // Agar bisa baca JSON dari body request [cite: 191]

// // 2. Logger Middleware (Sesuai Tugas: Timestamp, Method, URL)
// app.use((req, res, next) => {
//     const time = new Date().toISOString();
//     console.log(`[${time}] ${req.method} ${req.url}`); // [cite: 193]
//     next(); // Jangan lupa ini, atau aplikasi akan 'hang'!
// });

// // 3. Import dan Gunakan Rute Buku [cite: 234, 235]
// const bookRoutes = require('./routes/books');
// app.use('/api/books', bookRoutes);

// // 4. Middleware 404 (Untuk rute yang tidak dikenal) [cite: 253]
// app.use((req, res, next) => {
//     res.status(404).json({
//         message: "Maaf, rute yang Anda tuju tidak ditemukan di peta kami."
//     });
// });

// // 5. Global Error Handler (Penangkap error terakhir) [cite: 254]
// app.use((err, req, res, next) => {
//     console.error(err.stack); // Log error di server
//     res.status(500).json({
//         message: "Terjadi kesalahan internal pada server.",
//         error: err.message
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server berjalan dengan elegan di http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const path = require('path');
 
// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

const authRoutes = require("./routes/auth");
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
 console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
 next();
});

// Konfigurasi folder statis untuk uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
 res.send("Home Page for API");
});
const ruteBuku = require("./routes/books");
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
 console.log(`Express server running at http://localhost:${PORT}/`);
});