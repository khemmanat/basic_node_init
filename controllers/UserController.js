const UserService = require('../service/user_service');

const get_nowdate = new Date();
let get_date = ("0" + get_nowdate.getDate()).slice(-2);
let get_month = ("0" + (get_nowdate.getMonth() + 1)).slice(-2);
let get_year = get_nowdate.getFullYear();

let get_hour = get_nowdate.getHours();
let get_minute = get_nowdate.getMinutes();
let get_second = get_nowdate.getSeconds();

var date_now = (`${get_date}/${get_month}/${get_year}`);
var time_now = (`${get_hour}:${get_minute}:${get_second}`);

exports.CreateUser = async (req,res) => {

    const {
        firstname,
        lastname,
        telno,
        profile_image,
        email,
        address,
        username,
        password,

    } = req.body;

    try{
        const getUserExist = await UserService.getByEmail(email);
        
        if(getUserExist){
            console.log("User already registered");

            return res.status(200).send({
                status: "error",
                data: "Not Data"
              });
        }else{
            const CreateNewUser = await UserService.create({
                firstname: firstname,
                lastname: lastname,
                telno: telno,
                profile_image: profile_image,
                email: email,
                address: address,
                username: username,
                password: password
            });

            return res.status(200).send({
                status: "success",
                data: CreateNewUser
              });

        }   
        

        
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
        });
    }

}

exports.GetUserByID = async (req,res) => {

    const user_id = req.query.user_id;

    try{
        const GetUserAccountByID = await UserService.getByID(user_id);

        return res.status(200).send({
            status: "success",
            data: GetUserAccountByID
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
}

exports.GetUserAll = async (req,res) => {

    // const user_id = req.query.user_id;

    try{
        const GetUserAccountAll = await UserService.getAll();

        return res.status(200).send({
            status: "success",
            data: GetUserAccountAll
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
}

exports.GetUserByEmail = async (req,res) => {

    const user_email = req.query.email;

    try{
        const GetUserAccountByEmail = await UserService.getByEmail(user_email);

        return res.status(200).send({
            status: "success",
            data: GetUserAccountByEmail
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
    
}

exports.EditUserByID = async (req,res) => {

    const {
        user_id,
        firstname,
        lastname,
        telno,
        email,
        username,
        password,

    } = req.body;

    try{
        const EditUserByID = await UserService.editByID(user_id,{
            firstname: firstname,
            lastname: lastname,
            telno: telno,
            email: email,
            username : username,
            password : password,
        });

        return res.status(200).send({
            status: "success",
            data: EditUserByID
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
    
}

exports.EditUserByEmail = async (req,res) => {

    const {
        user_id,
        firstname,
        lastname,
        telno,
        email,
        username,
        password,

    } = req.body;

    try{
        const EditUserByEmail = await UserService.editByEmail(email,{
            firstname: firstname,
            lastname: lastname,
            telno: telno,
            username : username,
            password : password,
        });

        return res.status(200).send({
            status: "success",
            data: EditUserByEmail
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
    
}

exports.DeleteUserByID = async (req,res) =>{

    const user_id = req.query.user_id;

    try{
        const DeleteUserByID = await UserService.DeleteByID(user_id);

        return res.status(200).send({
            status: "success",
            data: DeleteUserByID
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }

}

exports.DeleteUserByEmail = async (req,res) =>{

    const user_email = req.query.email;

    try{
        const DeleteUserByEmail = await UserService.DeleteByEmail(user_email);

        return res.status(200).send({
            status: "success",
            data: DeleteUserByEmail
          });
    }catch(err){
        console.log("==== ERROR =====", err);
        return res.status(500).send({
        status: "error",
        message: err.message,
    });
    }
    
}