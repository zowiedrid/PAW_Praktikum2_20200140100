const db = require('../models');
(async () => {
  try {
    const [rows] = await db.sequelize.query('DESCRIBE `Users`');
    console.log(rows);
  } catch (err) {
    console.error('Failed to DESCRIBE Users:', err.message);
  } finally {
    await db.sequelize.close();
  }
})();