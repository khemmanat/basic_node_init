//import lib
const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../util/database");
const User = database.user;

exports.create = async (data) => {
  try{
      return await User.create(data);
  } catch(err){
      throw err;
  }
};

exports.editByID = async (user_id, data) => {
  try{    
      return await User.update(data,{
          where: { 
              user_id: user_id,
          },
      });
  }catch(err){
      throw err;
  }
};  

exports.editByEmail = async (email, data) => {
    try{    
        return await User.update(data,{
            where: { 
                email: email,
            },
        });
    }catch(err){
        throw err;
    }
  };  

exports.getAll = async () =>{
  try{
      return await User.findAll();
  }catch (err){
      throw err;
  }
};

exports.getByID = async (user_id) =>{
  try{
      return await User.findOne({ 
          where:{
              user_id: user_id,
      },
  });
  }catch (err){
      throw err;
  };
};

exports.getByEmail = async (email) =>{
  try{
      return await User.findOne({ 
          where:{
              email: email,
      },
  });
  }catch (err){
      throw err;
  };
};

exports.DeleteByID = async (user_id) => {
  try{
      return await User.destroy({
          where:{
              user_id: user_id,
          }
      })
  }catch (err){
      throw err;
  };
};

exports.DeleteByEmail = async (email) => {
  try{
      return await User.destroy({
          where:{
              email: email,
          }
      })
  }catch (err){
      throw err;
  };
};