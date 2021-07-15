module.exports = (sequelize, Sequelize) => {
    // ชื่อ ตัวแปร ที่ให้เหมือนกับชื่อ table
    const file = sequelize.define(
        //ชื่อ ตาราง
        "file",
        {
            // แต่ละ column พร้อมประเภทตัวแปร
            file_id: {
                type: Sequelize.INTEGER,
                field: "file_id",
                primaryKey: true,
                autoIncrement: true,
              },
              folder_id: {
                type: Sequelize.INTEGER,
                field: "folder_id",
              },
              url: {
                type: Sequelize.STRING,
                field: "url",
              },
              name:{
                type: Sequelize.STRING,
                field: "name",
              },
              type: {
                type: Sequelize.STRING,
                field: "type"
              },
              size:{
                type: Sequelize.STRING,
                field: "size",
              },
              isDeleted:{
                type: Sequelize.BOOLEAN,
                field: "isDeleted",
                defaultValue: 0
              }
        },
        {
            freezeTableName: true,
            underscored: true,
        }
    );
    return file;
  };