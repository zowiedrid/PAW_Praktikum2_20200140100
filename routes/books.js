const express = require('express');
const router = express.Router();

// Simulasi Database (Array Sederhana) [cite: 248]
let books = [
    { id: 1, title: 'Filosofi Teras', author: 'Henry Manampiring' },
    { id: 2, title: 'Laut Bercerita', author: 'Leila S. Chudori' }
];

// --- 1. READ (Ambil Semua Buku) ---
router.get('/', (req, res) => {
    res.json(books); // [cite: 211]
});

// --- 2. READ (Ambil Satu Buku by ID) ---
router.get('/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan di rak kami.' }); // Error handling [cite: 215]
    res.json(book);
});

// --- 3. CREATE (Tambah Buku Baru) ---
router.post('/', (req, res) => {
    const { title, author } = req.body;

    // Validasi Input (Sesuai Tugas) [cite: 249]
    if (!title || !author) {
        return res.status(400).json({ message: 'Judul dan Penulis wajib diisi, kawan.' });
    }

    const newBook = {
        id: books.length + 1, // ID sederhana
        title,
        author
    };
    books.push(newBook);
    res.status(201).json(newBook); // [cite: 229]
});

// --- 4. UPDATE (Ubah Data Buku) ---
// Bagian ini tidak ada di contoh modul, tapi diminta di tugas [cite: 247]
router.put('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author } = req.body;

    // Cari index buku di array
    const bookIndex = books.findIndex(b => b.id === bookId);

    // Jika tidak ketemu
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku yang ingin diubah tidak ditemukan.' });
    }

    // Validasi Input
    if (!title || !author) {
        return res.status(400).json({ message: 'Data tidak lengkap untuk pembaruan.' });
    }

    // Lakukan update
    books[bookIndex] = { id: bookId, title, author };
    res.json({ message: 'Buku berhasil diperbarui', data: books[bookIndex] });
});

// --- 5. DELETE (Hapus Buku) ---
// Bagian ini juga tantangan tugas [cite: 247]
router.delete('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku tidak ditemukan, tidak ada yang dihapus.' });
    }

    // Hapus dari array
    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: 'Buku berhasil dihapus', data: deletedBook[0] });
});

module.exports = router;