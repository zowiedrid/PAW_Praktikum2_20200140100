const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Atau port lain yang kamu suka

// 1. Middleware Global
app.use(cors());
app.use(express.json()); // Agar bisa baca JSON dari body request [cite: 191]

// 2. Logger Middleware (Sesuai Tugas: Timestamp, Method, URL)
app.use((req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`); // [cite: 193]
    next(); // Jangan lupa ini, atau aplikasi akan 'hang'!
});

// 3. Import dan Gunakan Rute Buku [cite: 234, 235]
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

// 4. Middleware 404 (Untuk rute yang tidak dikenal) [cite: 253]
app.use((req, res, next) => {
    res.status(404).json({
        message: "Maaf, rute yang Anda tuju tidak ditemukan di peta kami."
    });
});

// 5. Global Error Handler (Penangkap error terakhir) [cite: 254]
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error di server
    res.status(500).json({
        message: "Terjadi kesalahan internal pada server.",
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan dengan elegan di http://localhost:${PORT}`);
});