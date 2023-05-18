const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    // ชื่อ ตัวแปร ที่ให้เหมือนกับชื่อ table
    return sequelize.define(
        //ชื่อ ตาราง
        "history",
        {
            // แต่ละ column พร้อมประเภทตัวแปร
            history_id: {
                type: DataTypes.INTEGER,
                field: "history_id",
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                field: "isDeleted",
                defaultValue: 0
            },
            user_id: {
                type: DataTypes.INTEGER,
                field: "user_id",
            }
        },
        {
            freezeTableName: true,
            underscored: true,
        }
    );
  };
