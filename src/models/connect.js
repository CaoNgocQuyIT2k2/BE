import Sequelize from 'sequelize';
import config from "../config/config.js";

const sequelize = new Sequelize(config.database, config.user, config.pass, {
    host: config.host,
    port: config.port,
    dialect: config.dialect, // CSDL đang sử dụng
});

try {
    await sequelize.authenticate();
    console.log("Connect success");
} catch (error) {
    console.log("Connect failed");
}

export default sequelize;
