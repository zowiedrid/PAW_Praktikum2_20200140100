const { User, sequelize } = require('../models');
console.log(Object.keys(User.rawAttributes));
sequelize.close();
