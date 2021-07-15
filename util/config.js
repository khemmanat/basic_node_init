require("dotenv").config();

module.exports = {
    development:{
        database: "db-name",
        username: "root",
        password: "root",
        host: "localhost",
        dialect: "mysql",
        port_db: "3306",
        port://port ที่อยากจะใช้ แนะนำ 3000 หรือ 4000,
    },
    test:{
        environment: process.env.NODE_ENV,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: "mysql",
        port_db: process.env.DB_PORT,
        port: process.env.PORT,
    },
    // production:{
    //     // environment: process.env.NODE_ENV,
    //     database: "file-management-system",
    //     username: "root",
    //     password: ",usy;.0.0.0",
    //     host: "localhost",
    //     dialect: "mysql",
    //     port_db: 3306,
    //     port: 7115,
    // },
};