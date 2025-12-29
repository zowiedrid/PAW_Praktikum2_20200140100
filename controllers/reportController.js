const { Presensi, User } = require("../models");
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
   const { nama, tanggalMulai, tanggalSelesai, bulan, tahun } = req.query;
   const whereClause = {};
   const includeUser = {
     model: User,
     as: "user",
     attributes: ["id", "nama", "email", "role"],
   };
 
   // Filter berdasarkan nama user (join ke tabel Users)
   if (nama) {
     includeUser.where = {
       nama: { [Op.like]: `%${nama}%` },
     };
     includeUser.required = true;
   }
 
   // Filter berdasarkan rentang tanggal
   if (tanggalMulai && tanggalSelesai) {
     // Buat tanggal mulai dari awal hari (00:00:00)
     const startDate = new Date(tanggalMulai);
     startDate.setHours(0, 0, 0, 0);
     
     // Buat tanggal selesai sampai akhir hari (23:59:59)
     const endDate = new Date(tanggalSelesai);
     endDate.setHours(23, 59, 59, 999);
     
     whereClause.checkIn = {
       [Op.between]: [startDate, endDate],
     };
   } else if (tanggalMulai) {
     // Jika hanya tanggalMulai, ambil data dari tanggal tersebut hingga sekarang
     const startDate = new Date(tanggalMulai);
     startDate.setHours(0, 0, 0, 0);
     
     whereClause.checkIn = {
       [Op.gte]: startDate,
     };
   } else if (tanggalSelesai) {
     // Jika hanya tanggalSelesai, ambil data sampai tanggal tersebut
     const endDate = new Date(tanggalSelesai);
     endDate.setHours(23, 59, 59, 999);
     
     whereClause.checkIn = {
       [Op.lte]: endDate,
     };
   } else if (bulan) {
     const parsedMonth = parseInt(bulan, 10);
     const parsedYear = tahun ? parseInt(tahun, 10) : new Date().getFullYear();

     if (!Number.isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
       const startDate = new Date(parsedYear, parsedMonth - 1, 1);
       startDate.setHours(0, 0, 0, 0);
       const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);

       whereClause.checkIn = {
         [Op.between]: [startDate, endDate],
       };
     }
   }
 
   const records = await Presensi.findAll({
     where: whereClause,
     include: [includeUser],
     order: [["checkIn", "DESC"]],
   });
 
   res.json({
     reportDate: new Date().toLocaleDateString(),
     totalRecords: records.length,
     filters: {
       nama: nama || null,
       tanggalMulai: tanggalMulai || null,
       tanggalSelesai: tanggalSelesai || null,
       bulan: bulan || null,
       tahun: tahun || null,
     },
     data: records,
   });
 } catch (error) {
   res
     .status(500)
     .json({ message: "Gagal mengambil laporan", error: error.message });
 }
};