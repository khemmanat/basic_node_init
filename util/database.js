const Sequelize = require("sequelize");
const configJson = require("./config");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const config = configJson[env];

console.log("this is the environment : ", env);
console.log(config);

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port_db,
        dialect: config.dialect,
        logging: false,
    }
);

sequelize
    .authenticate()
    .then(async ()=>{
        await sequelize.sync({ alter: true});
        console.log("Connection has been established successfully.");
    })
    .catch((err)=>{
        console.error("Unable to connect to the database: ", err);
    });

    const db = {};

    db.sequelize = sequelize;


    //! Models

    db.file = require("../model/file")(sequelize, Sequelize);

    db.folder = require("../model/folder")(sequelize, Sequelize);

    db.folder_level = require("../model/folder_level")(sequelize, Sequelize);


    /////////////////////////////// Relation //////////////////////////////////////

    // Folder relations
    db.folder.hasMany(db.file,{
        foreignKey: "folder_id",
        onDelete: "cascade",
        // constraints : true,
    });

    db.folder.hasMany(db.folder,{
        foreignKey: "parent_folder_id",
        // onDelete: "cascade"
    })

    db.folder.belongsTo(db.folder_level,{
        foreignKey: "folder_id",
    });

    // folder level relations 
    db.folder_level.hasMany(db.folder,{
        foreignKey: "folder_level_id",
        // onDelete: "cascade",
        // constraints: true
    });

    // file relations
    db.file.belongsTo(db.folder,{
        foreignKey: "folder_id"
    });


    module.exports = db;