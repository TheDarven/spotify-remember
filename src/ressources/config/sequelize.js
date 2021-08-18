const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    define: {
      timestamps: false
    },
    logging: false
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    define: {
      timestamps: false
    },
    loggin: false
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    define: {
      timestamps: false
    },
    logging: false
  }
};