const express = require('express');
const path = require('path');

const { Router } = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

// !API 1XX - User
//!API 101 - Create User
router.post("/user/create", UserController.CreateUser);
//!API 102 - Get User All
router.get("/user/get", UserController.GetUserAll);
//!API 103 - Get User By ID
router.get("/user/getbyid", UserController.GetUserByID);
// //!API 104 - Get User By email
router.get("/user/getbyemail", UserController.GetUserByEmail);
// //!API 105 - Edit User By ID
router.post("/user/editbyid", UserController.EditUserByID);
// //!API 106 - Edit User By Email
router.post("/user/editbyemail", UserController.EditUserByEmail);
// //!API 107 - Delete User By ID
router.delete("/user/deletebyid", UserController.DeleteUserByID);
// //!API 108 - Delete User By Email
router.delete("/user/deletebyemail", UserController.DeleteUserByEmail);

module.exports = router;