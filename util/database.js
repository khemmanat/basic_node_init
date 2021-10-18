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

    db.user = require("../model/user")(sequelize, Sequelize);

    db.daily_mood = require("../model/daily_mood")(sequelize, Sequelize);

    db.history = require("../model/history")(sequelize, Sequelize);

    db.results = require("../model/results")(sequelize, Sequelize);

    db.motivation = require("../model/motivation")(sequelize, Sequelize);

    db.sound_therapy = require("../model/sound_therapy")(sequelize, Sequelize);

    db.image_therapy = require("../model/image_therapy")(sequelize, Sequelize);

    db.movie_therapy = require("../model/movie_therapy")(sequelize, Sequelize);


    /////////////////////////////// Relation //////////////////////////////////////

    // User relations
    db.user.hasMany(db.daily_mood,{
        foreignKey: "user_id",
        // onDelete: "cascade",
        // constraints : true,
    });

    db.daily_mood.belongsTo(db.user,{
        foreignKey: "user_id",
    });

    db.user.hasMany(db.results,{
        foreignKey: "user_id",
        // onDelete: "cascade",
        // constraints : true,
    });

    db.results.belongsTo(db.user,{
        foreignKey: "user_id",
    });

    db.user.hasMany(db.history,{
        foreignKey: "user_id",
        // onDelete: "cascade",
        // constraints : true,
    });

    db.history.belongsTo(db.user,{
        foreignKey: "user_id",
    });


    module.exports = db;