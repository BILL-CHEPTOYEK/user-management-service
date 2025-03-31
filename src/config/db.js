require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: "postgres",
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error("❌ PostgreSQL Connection Error:", err.message));

module.exports = sequelize;
