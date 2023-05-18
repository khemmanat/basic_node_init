const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  // ชื่อ ตัวแปร ที่ให้เหมือนกับชื่อ table
    return sequelize.define(
      //ชื่อ ตาราง
      "user",
      {
          // แต่ละ column พร้อมประเภทตัวแปร
          user_id: {
              type: DataTypes.INTEGER,
              field: "user_id",
              primaryKey: true,
              autoIncrement: true,
          },
          firstname: {
              type: DataTypes.STRING,
              field: "firstname",
          },
          lastname: {
              type: DataTypes.STRING,
              field: "lastname",
          },
          telno: {
              type: DataTypes.STRING,
              field: "telno",
          },
          profile_image: {
              type: DataTypes.STRING,
              field: "profile_image",
          },
          email: {
              type: DataTypes.STRING,
              field: "email",
          },
          address: {
              type: DataTypes.STRING,
              field: "address",
          },
          username: {
              type: DataTypes.STRING,
              field: "username",
          },
          password: {
              type: DataTypes.STRING,
              field: "password",
          }
      },
      {
          freezeTableName: true,
          underscored: true,
      }
  );
};
