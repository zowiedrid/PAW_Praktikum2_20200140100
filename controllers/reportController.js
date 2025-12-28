const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");
// exports.getDailyReport = (req, res) => {
//  console.log("Controller: Mengambil data laporan harian dari array...");
//  res.json({
//    reportDate: new Date().toLocaleDateString(),
//    data: presensiRecords,
//  });
// };

exports.getDailyReport = async (req, res) => {
 try {
   const { nama, tanggalMulai, tanggalSelesai } = req.query;
   let options = { where: {} };
 
   // Filter berdasarkan nama
   if (nama) {
     options.where.nama = {
       [Op.like]: `%${nama}%`,
     };
   }
 
   // Filter berdasarkan rentang tanggal
   if (tanggalMulai && tanggalSelesai) {
     // Buat tanggal mulai dari awal hari (00:00:00)
     const startDate = new Date(tanggalMulai);
     startDate.setHours(0, 0, 0, 0);
     
     // Buat tanggal selesai sampai akhir hari (23:59:59)
     const endDate = new Date(tanggalSelesai);
     endDate.setHours(23, 59, 59, 999);
     
     options.where.checkIn = {
       [Op.between]: [startDate, endDate],
     };
   } else if (tanggalMulai) {
     // Jika hanya tanggalMulai, ambil data dari tanggal tersebut hingga sekarang
     const startDate = new Date(tanggalMulai);
     startDate.setHours(0, 0, 0, 0);
     
     options.where.checkIn = {
       [Op.gte]: startDate,
     };
   } else if (tanggalSelesai) {
     // Jika hanya tanggalSelesai, ambil data sampai tanggal tersebut
     const endDate = new Date(tanggalSelesai);
     endDate.setHours(23, 59, 59, 999);
     
     options.where.checkIn = {
       [Op.lte]: endDate,
     };
   }
 
   const records = await Presensi.findAll(options);
 
   res.json({
     reportDate: new Date().toLocaleDateString(),
     totalRecords: records.length,
     filters: {
       nama: nama || null,
       tanggalMulai: tanggalMulai || null,
       tanggalSelesai: tanggalSelesai || null,
     },
     data: records,
   });
 } catch (error) {
   res
     .status(500)
     .json({ message: "Gagal mengambil laporan", error: error.message });
 }
};