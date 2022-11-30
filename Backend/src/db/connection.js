const {Sequelize} = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME || 'SocialHub', process.env.DB_USERNAME || 'postgres', process.env.DB_PASSWORD || '12345678', {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    }
});

module.exports = {
    db
}

