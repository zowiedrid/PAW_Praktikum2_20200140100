const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');

router.use(addUserData);

// Validation middleware untuk update presensi
const validateUpdatePresensi = [
  body('waktuCheckIn')
    .optional()
    .isISO8601()
    .withMessage('waktuCheckIn harus berupa format tanggal yang valid (ISO 8601)')
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('waktuCheckIn bukan tanggal yang valid');
      }
      return true;
    }),
  body('waktuCheckOut')
    .optional()
    .isISO8601()
    .withMessage('waktuCheckOut harus berupa format tanggal yang valid (ISO 8601)')
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('waktuCheckOut bukan tanggal yang valid');
      }
      return true;
    }),
  body('waktuCheckOut')
    .optional()
    .custom((value, { req }) => {
      if (value && req.body.waktuCheckIn) {
        const checkIn = new Date(req.body.waktuCheckIn);
        const checkOut = new Date(value);
        if (checkOut <= checkIn) {
          throw new Error('waktuCheckOut harus lebih besar dari waktuCheckIn');
        }
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    next();
  }
];

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

router.put('/:id', validateUpdatePresensi, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);
module.exports = router;
