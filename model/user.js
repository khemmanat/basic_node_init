module.exports = (sequelize, Sequelize) => {
  // ชื่อ ตัวแปร ที่ให้เหมือนกับชื่อ table
  const user = sequelize.define(
      //ชื่อ ตาราง
      "user",
      {
          // แต่ละ column พร้อมประเภทตัวแปร
          user_id: {
              type: Sequelize.INTEGER,
              field: "user_id",
              primaryKey: true,
              autoIncrement: true,
            },
          firstname: {
              type: Sequelize.STRING,
              field: "firstname",
            },
            lastname: {
              type: Sequelize.STRING,
              field: "lastname",
            },
            telno: {
              type: Sequelize.STRING,
              field: "telno",
            },
            profile_image: {
              type: Sequelize.STRING,
              field: "profile_image",
            },
            email:{
              type: Sequelize.STRING,
              field: "email",
            },
            address:{
              type: Sequelize.STRING,
              field: "address",
            },
            username:{
              type: Sequelize.STRING,
              field: "username",
            },
            password:{
              type: Sequelize.STRING,
              field: "password",
            }
      },
      {
          freezeTableName: true,
          underscored: true,
      }
  );
  return user;
};