//import lib
const express = require("express");
var fs = require("fs");
const multer = require("multer");
const path = require("path");
const Client = require("ssh2-sftp-client");
const client = new Client();
// var sftpStorage = require("multer-sftp");
const db = require("../util/database");
const service = require("../service/main_service");

const UserService = require("../service/user_service");
// const fileController = require("../controller/fileController");
const Folder = db.folder;
const File = db.file;
const FolderLevel = db.folder_level;

require("dotenv").config();

const {
    Router
} = require("express");

const route = express.Router();

// const server = require("../server");

// Set the variable of date_now of the default folder
const get_localdate = new Date();
let get_date_local = ("0" + get_localdate.getDate()).slice(-2);
let get_month_local = ("0" + (get_localdate.getMonth() + 1)).slice(-2);
let get_year_local = get_localdate.getFullYear();

var date_now_local = String(get_year_local + "-" + get_month_local + "-" + get_date_local);

// var uploaded = server.upload;

// var remoteStorage = sftpStorage({
//         sftp: {
//             host: '122.155.202.70',
//             port: 2322,
//             username: 'devops',
//             password: 'Tanos5.',
//             debug: (info) => { console.log(info) }
//         },
//         destination: function (req, file, cb) {
//             let path = '/var/www/html/vulcan.houseofdev.tech/assets-file-management' + req.body.project;

//             client.connect(config)
//                 .then(() => {
//                     return client.exists(path);
//                 })
//                 .then(data => {
//                     console.log(data);
//                     if (!data) { // will be false or d, -, l (dir, file or link)
//                         console.log('info: directory not found, creating');
//                         return client.mkdir(path, true);
//                     }
//                 })
//                 .then(() => {
//                     console.log('directory created, or existed. continue...')
//                     client.end();
//                     cb(null, path);
//                 })
//                 .catch(err => {
//                     console.error(err.message);
//                 });

//         },
//         filename: function (req, file, cb) {
//             var filename = file.originalname;
//             var fileExtension = filename.split(".")[1];
//             cb(null, req.body.type + "-" + filename.split(".")[0] + '-' + date_now_local + "." + fileExtension);
//         }
//     });

// define the storage to keep the files
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var path = __dirname + "/../assets-file-management/";
        fs.exists(path, (exists) => {
            if (!exists) {
                fs.mkdirSync(path, {
                    recursive: true
                });
                console.log("Directory created");
                cb(null, path);
            } else {
                cb(null, path);
            }
        });
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        console.log("filename", filename);
        var fileExtension = filename.split(".").pop();
        console.log("extension",fileExtension);
        var get_filename_init = filename.split(fileExtension);
        var name_of_filename = get_filename_init[0]
        var get_last_split = name_of_filename.split(".")
        console.log("get_last_split", get_last_split);
        var actual_filename = get_last_split[0]
        console.log("actual_filename",actual_filename);
        // var test_case = "Iamthe boy";
        // var splitted = test_case.split(' ');
        // console.log("splitted", splitted);
        console.log("whitespace",(name_of_filename.indexOf(' ') >= 0));

        
            // console.log("hey");
            var split_name_filename = name_of_filename.split(/[\s,.]+/);
            // var set_filename = splitted_filename
            // console.log("splitted_filename", splitted_filename);
            var last_filename = split_name_filename.join('');
            cb(null, last_filename + "_"+ date_now_local+ "." + fileExtension);
    },
});

// make the upload to use the storage setting above
var upload = multer({
    storage: storage
});
// var upload = multer({ storage: remoteStorage});

// Main Route
route.get("/", (req, res) => {
    res.send("File-Management-System");
});


// API01 Create Folder
route.post("/folder/create", upload.single("folder_name"), async (req, res) => {

    let {
        parent_folder_id,
        folder_name,
        folder_level
    } = req.body;
    console.log(req.body);

    const input_parent_folder_id = parent_folder_id;
    const input_folder_name = folder_name;
    const input_folder_level = folder_level;
    // const input_sub_folder_name = sub_folder_name;

    // Tell the date of today and now (auto)
    const get_fulldate = new Date();
    //res_date is the value from res_fulldate with slices only the date of Date()
    let get_date = ("0" + get_fulldate.getDate()).slice(-2);
    //res_month is the value from res_fulldate with slices only the month of Date()
    let get_month = ("0" + (get_fulldate.getMonth() + 1)).slice(-2);
    //res_year is the value from res_fulldate with slices only the year of Date()
    let get_year = get_fulldate.getFullYear();
    //res_hour is the value from res_fulldate with only the hour of Date()
    let get_hour = get_fulldate.getHours();
    //res_min is the value from res_fulldate with only the minute of Date()
    let get_min = get_fulldate.getMinutes();
    //res_sec is the value from res_fulldate with only the second of Date()
    let get_sec = get_fulldate.getSeconds();

    var date_now = (`${get_date}.${get_month}.${get_year}_${get_hour}:${get_min}:${get_sec}`);

    console.log("folder_name",input_folder_name);
    if (input_folder_name) {
        if ((input_folder_level) && (input_folder_level !== 1)) {
            var getFolderLevel = await service.getFolderLevelByEach(input_folder_level);

            var findParentFolderID = await service.getParentFolderName(input_parent_folder_id);
            var getParentFolderName = findParentFolderID.folder_name;

            if (getFolderLevel !== null) {

                var FolderPath = "/";
                var get_folder_level_id = getFolderLevel.folder_level_id;

                var parent_level = input_folder_level - 1;
                console.log("parent_folder_name", parent_folder_id);
                console.log("parent_level", parent_level);
                var getFolderofParentFolder = await service.getFolderofParentFolder(input_parent_folder_id)

                var getParentID  = getFolderofParentFolder.parent_folder_id;
                var getParentFolderToCompare = await service.getFolderToCompareForParent({
                    folder_name: getParentFolderName,
                    level: parent_level,
                    parent_folder_id: getParentID
                });

                console.log("getParentFolderToCompare",getParentFolderToCompare);

                FolderPath = FolderPath + getParentFolderName;

                var getParentFolderIDFromParent = getParentFolderToCompare.folder_id;
                var getFolderToCompare = await service.getFolderToCompare({
                    folder_name: input_folder_name,
                    level: input_folder_level
                })

                var findExistFolder = await service.findFolderExistAtLevel({
                    folder_name: input_folder_name,
                    parent_folder_id: getParentFolderIDFromParent,
                    level: input_folder_level
                });

                


                if (findExistFolder !== null) {

                    var message = " Cannot create folder, folder_name exist!!"

                    var status = "error!!!"

                }

                else {

                    var get_parent_level_id = Number(input_folder_level) - 1;

                    var createFolder = await service.createFolder({
                        folder_name: input_folder_name,
                        parent_folder_id: getParentFolderIDFromParent,
                        folder_level_id: get_folder_level_id
                    });

                    FolderPath = FolderPath + "/" + input_folder_name;


                    var response = {
                        FolderPath,
                        createFolder

                    };

                    var message = "Folder created with folder_name and folder_level > 1 with new createFolderLevel";

                    var status = "success";


                }


            } else {

                var FolderPath = "/";

                var parent_level = input_folder_level - 1;
                var getParentFolderToCompare = await service.getFolderToCompare({
                    folder_name: getParentFolderName,
                    level: parent_level
                });

                var getParentFolderIDFromParent = getParentFolderToCompare.folder_id;
                var getFolderToCompare = await service.getFolderToCompare({
                    folder_name: input_folder_name,
                    level: input_folder_level
                })

                var findExistFolder = await service.findFolderExistAtLevel({
                    folder_name: input_folder_name,
                    parent_folder_id: getParentFolderIDFromParent,
                    level: input_folder_level
                });

                FolderPath = FolderPath + getParentFolderName;

                if (findExistFolder !== null) {

                    var message = "Cannot create folder , folder_name exist!!!";

                    var status = "error";
                } else {
                    var createFirstFolderLevel = await service.createFolderLevel({
                        level: input_folder_level
                    });

                    var get_folder_level_id = createFirstFolderLevel.folder_level_id;

                    var createFolder = await service.createFolder({
                        folder_name: input_folder_name,
                        parent_folder_id: getParentFolderIDFromParent,
                        folder_level_id: get_folder_level_id
                    });

                    FolderPath = FolderPath + "/" + input_folder_name;

                    var response = {
                        FolderPath,
                        createFirstFolderLevel,
                        createFolder

                    };

                    var message = "Folder created with folder_name and folder_level > 1";

                    var status = "success";
                }

            }
        } else {

            var getFolderLevel = await service.getFolderLevelByEach(1);
            console.log("folder_name", input_folder_name);
            console.log("getFolderLevel", getFolderLevel);

            if (getFolderLevel !== null) {

                var FolderPath = "/";
                var getFolderToCompare = await service.getFolderToCompare({
                    folder_name: input_folder_name,
                    level: 1
                });
                var get_folder_level_id = getFolderLevel.folder_level_id;
                console.log("level_id", get_folder_level_id);
                console.log("getFolderToCompare", getFolderToCompare);

                if (getFolderToCompare !== null) {
                    var message = "Cannot create folder, folder_name exist!!";

                    var status = "error";
                } else {
                    var createFolder = await service.createFolder({
                        folder_name: input_folder_name,
                        folder_level_id: get_folder_level_id
                    });

                    FolderPath = FolderPath + input_folder_name;

                    var response = {
                        FolderPath,
                        createFolder

                    };

                    var message = "Folder created with folder_name and folder_level = 1";

                    var status = "success";
                }


            } else {

                var FolderPath = "/";

                var getFolderToCompare = await service.getFolderToCompare({
                    folder_name: input_folder_name,
                    level: 1
                });

                if (getFolderToCompare !== null) {

                    var message = "Cannot create folder, folder_name exist!!";

                    var status = "error";
                } else {
                    var createFirstFolderLevel = await service.createFolderLevel({
                        level: 1
                    });

                    var get_folder_level_id = createFirstFolderLevel.folder_level_id;

                    var createFolder = await service.createFolder({
                        folder_name: input_folder_name,
                        folder_level_id: get_folder_level_id
                    });

                    FolderPath = FolderPath + input_folder_name;

                    var response = {
                        FolderPath,
                        createFirstFolderLevel,
                        createFolder

                    };

                    var message = "Folder created with folder_name and folder_level 1 new creating"

                    var status = "success";
                }

            }



        }
    } else {
        var message = "You should fill in inputs to create folder";

        var status = "error!";
    }

    res.status(200).send({
        data: response,
        message: message,
        status: status
    });
})

// API02/1 Get Folder
route.get("/folder/get/id_level", async (req, res) => {

    const get_folder_id = req.query.folder_id;
    const get_folder_level = req.query.folder_level;

    if ((get_folder_id) && (get_folder_level)) {

        var getFolderByEachID = await service.getFolderByFolderIDForGet(get_folder_id);

        var getFileByFolderIDFirst = await service.getFileByFolderID(getFolderByEachID.folder_id)

        // var Folder = [];
        // var files = [];
        var SubFolder = [];

        var Folder = {folder:getFolderByEachID, files: getFileByFolderIDFirst};
        
        // files.push(getFileByFolderIDFirst)
        
        
        // var GetAllFolderByIDAtLevel = [];
        var getlevelByID = getFolderByEachID.folder_level_id;
        console.log("getlevelByID", getlevelByID);
        getlevelByID = getlevelByID + 1;
        var getParentFolderID = Number(get_folder_id);
        console.log("getParentFolderID", getParentFolderID);

        var folder_level = Number(get_folder_level);
        console.log("folder_level", folder_level);

        for(var getlevelByID ; getlevelByID <= folder_level ; getlevelByID++){
            
            // console.log();
            var getFolderNextLevel = await service.findAllFolderForNextLevel({
                parent_folder_id: getParentFolderID,
                folder_level_id: getlevelByID
            });
            console.log("getFolderNextLevel", getFolderNextLevel);
          
            SubFolder.push(getFolderNextLevel);
            // File.push(getFileByFolderID)
            // console.log("Folder", Folder);

            
            
        }
        var message = "Get Folder By Name, success!!!";

        var status = "success";

        var response = {
            // getAllFolderAtLevelByID,
            // GetAllFolderByIDAtLevel,
            Folder,
            SubFolder
        }
    }
    else if ((get_folder_id) && !(get_folder_level)) {

        var Folder = await service.getFolderForGetFolderByID(get_folder_id);


        if(Folder == null){
            var message = "Cannot Get Folder By ID, Folder is Deleted";

            var status = "error";

            var response = "Nothing"
        }else{

            var message = "Get Folder By ID, Success!!!";

            var status = "success";

            var response = {
            
                Folder
            };
        }
        

        

    } else if ((get_folder_level) && !(get_folder_id)) {

        var Folder = [];

        var getFolderByLevel = await service.getFolderByLevel(get_folder_level);
        Folder.push(getFolderByLevel);


        var message = "Get All Folder By level, success!!!"

        var status = "success";

        var response = {
            Folder
        }
    

    } else {
        var message = "Folder name is not found!!";

        var status = "error";
    }
    

    res.status(200).send({
        data: response,
        message: message,
        status: status
    })

});

// API02/2 Get Folder By FolderName
route.get("/folder/get/name", async (req, res) => {

    const get_folder_name = req.query.folder_name;
    const get_folder_level = req.query.folder_level;

    if ((get_folder_name) && (get_folder_level)) {

        // var Folder = [];
        var files = [];


       var Folder_object = await service.findFolderByNameandLevel({
           folder_name: get_folder_name,
           folder_level_id: get_folder_level
       });

       

       
       if(Folder_object == null){
            var message = "Folder name is not found!!";

            var status = "error";

            var response = "Nothing";
       }else{

            var getFileByFolderID = await service.getFileByFolderID(Folder_object.folder_id)

            // files.push(getFileByFolderID);
            var Folder = {folder:Folder_object, files: getFileByFolderID}

            var message = "Get Folder By Name, success!!!";

            var status = "success";

            var response = {
                
                Folder,
                // SubFolder
            }
       }
        

        
    
    }  else {
        var message = "Folder name is not found!!";

        var status = "error";

        var response = "Nothing"
    }
    

    res.status(200).send({
        data: response,
        message: message,
        status: status
    })

});

// API02/3 Get Folder By only folder_id but get folder at next level
route.get("/folder/get/id", async (req, res) =>{

    const get_folder_id = req.query.folder_id;

    if(get_folder_id){

        var getFolderByEachID = await service.getFolderByFolderIDForGet(get_folder_id);
        console.log("getFolderByEachID", getFolderByEachID);

        // var getFolderIDByFolder = getFolderByEachID.folder_id
        var getFileByFolderID = await service.getFileByFolderID(get_folder_id)

        if(getFolderByEachID){
            // var Folder = [];
            // var files = [];
            var SubFolder = [];

            var Folder = {folder:getFolderByEachID,
                files: getFileByFolderID
            };
            // files.push(getFileByFolderID)
            var getParentFolderID = Number(get_folder_id);


            var getLevelByID = getFolderByEachID.folder_level_id;

            var NextFolderLevel = getLevelByID + 1;
            var getFolderNextLevel = await service.findAllFolderForNextLevelByOnlyID({
                parent_folder_id: getParentFolderID,
                folder_level_id: NextFolderLevel
            });
            console.log("getFolderNextLevel", getFolderNextLevel);
            // var folder_object = [];
            // var file_object = [];
            for(var x of getFolderNextLevel){
                // for(var y of x){

                    var getFileByFolderID = await service.getFileByFolderID(x.folder_id)
                    // folder_object.push(x)
                    // file_object.push(getFileByFolderID)
                    // var folder_object_json = {
                    //     "data":[
                    //         folder_object,
                    //         file_object
                    //     ]
                    // }
                    console.log("x",x);
                    
                    
                    SubFolder.push({
                                folder:x,
                                files: getFileByFolderID
                        }
                    )
                        // }
                    // }else{
                    //     Folder.push(x)
                    // }
                    
                    
                
                
                // var getFileForPush = await service.getFilByFolderID(x.folder_id)
                
            }

            // Folder.push(getFolderNextLevel)

            // var get_parent_folder_level = getFolderByEachID.folder_level_id;


            var message = "Get All Folder By level, success!!!"

            var status = "success";

            var response = {
                Folder,
                SubFolder
            }
        }else{

            var response = "Nothing"

            var message = "Folder name is not found!!";

            var status = "error";
        }
        
    }else{
        var message = "Folder name is not found!!";

        var status = "error";
    }

    res.status(200).send({
        data: response,
        message: message,
        status: status
    })
});

// API03 Upload File
route.post("/file/create", upload.single("file"), async (req, res, next) => {

    let {
        folder_name,
        folder_id,
        folder_level
    } = req.body;
    // const file = req.file
    // console.log(res_file)
    // console.log(folder_name)

    const get_file = req.file;
    // console.log("file",req.file.filename);
    const folder_id_for_file = folder_id;
    const folder_name_for_file = folder_name;
    const folder_level_for_file = folder_level;
    // console.log("file",res_file);
    // //make the size from bytes to Megabytes
    var get_file_size = (req.file.size * 0.000001).toFixed(2);

    if (!get_file) {
        console.log("No file received!");
        message = "Error! in image upload."
        res.status(200).send({
            message: message,
            status: 'danger'
        });
    } else {
        console.log('file received!');
        // console.log(req);

        const get_fulldate = new Date();
        let get_date = ("0" + get_fulldate.getDate()).slice(-2);
        let get_month = ("0" + (get_fulldate.getMonth() + 1)).slice(-2);
        let get_year = get_fulldate.getFullYear();
        let get_hour = get_fulldate.getHours();
        let get_min = get_fulldate.getMinutes();
        let get_sec = get_fulldate.getSeconds();

        var date_now = (`${get_date}.${get_month}.${get_year}_${get_hour}:${get_min}:${get_sec}`);

        if (folder_name_for_file) {
            if (folder_level_for_file) {
                var getFolderNameForUsingFile = await service.getFolderNameForFile({
                    folder_name_for_file,
                    folder_level_for_file
                });

                if (getFolderNameForUsingFile !== null) {
                    var foundFolderNameForFile = getFolderNameForUsingFile.folder_name;

                    var foundFolderIDForFile = getFolderNameForUsingFile.folder_id;

                    
                    // var splitted_filename = get_filename.split
                    let res_url = "https://vulcan.houseofdev.tech/proj-file-management-system/assets-file-management/" + req.file.filename;

                    if (folder_level_for_file !== 1) {
                        var getFolderPath = await service.getFolderPathForFile({
                            folder_name_for_file,
                            folder_level_for_file
                        });

                        if (getFolderPath !== null) {
                            var getAllPath = "/";
                            var level = Number(folder_level_for_file);
                            var folder_name_path = folder_name_for_file;
                            while (level !== 1) {
                                level -= 1;
                                var getPrevFolderPath = await service.getPrevFolderPathForFile({
                                    folder_name_path,
                                    level
                                });
                                var ParentPath = getPrevFolderPath.folder_name;
                                // var compare_sub_folder = await service.findExistSubFolder(SubPath);
                                // var compare_sub = compare_sub_folder.sub_folder_name;
                                // if(SubPath == compare_sub_folder){
                                //     var getUpperFolder = await service.getAllFolderBySub(SubPath);

                                var folder_name_path = ParentPath;
                                getAllPath = ("/" + SubPath) + getAllPath;

                            }
                        }

                        getAllPath = getAllPath + folder_name_for_file;
                        var lastPath = getAllPath + "/" + req.file.filename;

                        if (folder_name_for_file == foundFolderNameForFile) {

                            var createFile = await service.createFileList({
                                folder_id: foundFolderIDForFile,
                                url: res_url,
                                name: res.file.originalname,
                                type: req.file.mimetype,
                                size: res_size

                            });

                            var response = {
                                lastPath,
                                createFile
                            };

                            var message = ">> File Uploaded <<";

                            var status = "success";

                        } else {

                            var message = ">> Fail Folder Not Found!!! <<";

                            var status = "error";
                        }
                    } else {

                        var message = ">> Fail Folder Not Found!!! <<";

                        var status = "error";

                    }

                } else {
                    var message = ">> Fail , Error!!! <<";

                    var status = "error";
                }


            }
        } else if (folder_id_for_file) {


            let main_url = "https://vulcan.houseofdev.tech/proj-file-management-system/assets-file-management/" + req.file.filename;

            var uploadFileAtLevel = await service.uploadFileAtLevel({
                url: main_url,
                name: req.file.originalname,
                type: req.file.mimetype,
                size: get_file_size,
                folder_id: folder_id_for_file
            })

            var response = {

                uploadFileAtLevel
            };

            var message = "Upload File with folder_id";
        } else {

            var getFolderLevel = await service.getFolderLevelByEach(folder_level_for_file);

            if (getFolderLevel !== null) {
                var createFolderLevel = await service.createFolderLevel({
                    level: 1,
                });

                let getFolderLevelID = await service.getFolderLevelByLevelID(createFolderLevel.folder_level_id);
                console.log("get Folder Level ID", getFolderLevelID);
                let get_folder_level_id = getFolderLevelID.folder_level_id;

                // first, create the folder to carry the file that uploaded
                var CreateFolder = await service.createFolder({
                    folder_name: date_now,
                    parent_folder_id: null,
                    folder_level_id: get_folder_level_id

                });
                // message = "Folder name is creating...";


                let getFolderForUpload = await service.getFolderForFile();
                // console.log("getFolderForUpload", getFolderForUpload);

                let get_folder_id = getFolderForUpload.folder_id;

                let main_url = "https://vulcan.houseofdev.tech/proj-file-management-system/assets-file-management/" + req.file.filename;
                // console.log("res_folder_id_first", res_folder_id_first);
                // to create the file which relate to the folder id

                var lastPath = "/" + date_now + "/" + req.file.filename;
                let UploadFile = await service.createFile({
                    url: main_url,
                    name: req.file.filename,
                    type: req.file.mimetype,
                    size: get_file_size,
                    folder_id: get_folder_id
                });
            } else {
                var createFolderLevel = await service.createFolderLevel({
                    level: 1,
                });

                let getFolderLevelID = await service.getFolderLevelByLevelID(createFolderLevel.folder_level_id);
                console.log("get Folder Level ID", getFolderLevelID);
                let get_folder_level_id = getFolderLevelID.folder_level_id;

                // first, create the folder to carry the file that uploaded
                var CreateFolder = await service.createFolder({
                    folder_name: date_now,
                    parent_folder_id: null,
                    folder_level_id: get_folder_level_id

                });


                let getFolderForUpload = await service.getFolderForFile();
                // console.log("getFolderForUpload", getFolderForUpload);

                let get_folder_id = getFolderForUpload.folder_id;

                let main_url = "https://vulcan.houseofdev.tech/proj-file-management-system/assets-file-management/" + req.file.filename;
                // console.log("res_folder_id_first", res_folder_id_first);
                // to create the file which relate to the folder id

                var lastPath = "/" + date_now + "/" + req.file.filename;
                let UploadFile = await service.createFile({
                    url: main_url,
                    name: req.file.filename,
                    type: req.file.mimetype,
                    size: get_file_size,
                    folder_id: get_folder_id
                });

                var response = {
                    lastPath,
                    CreateFolder,
                    UploadFile
                };

                var message = "Upload File with no folder_name!!";

            }
        

        }
        res.status(200).send({
            data: response,
            message: message,
            status: status
        });
    }
});

// API04 GetFile
route.get("/file/get", async (req, res)=>{

    // let { file_id = req.body;

    var file_id_for_get = req.query.file_id;

    var getFileByFileID = await service.getFileByID(file_id_for_get);

    if(getFileByFileID !== null){
        var response = {getFileByFileID};

        var message = "Get File Done";

        var status = "success"
    }else{
        var response = "Nothing";

        var message = "Cannot Get File ";

        var status = "error"
    }
    
    res.status(200).send({
        data: response,
        message: message,
        status: status
    })

})

// API05 Delete Folder
route.post("/folder/delete", async (req, res) => {

    let {
        folder_id
    } = req.body;

    const folder_id_for_delete = folder_id;

    var getFolderNameByID = await service.findFolderByID(folder_id_for_delete);

    var get_foldername_for_delete = getFolderNameByID.folder_name;

    var checkFolderisDeleted = await service.checkFolderisDeleted(get_foldername_for_delete);

    if(checkFolderisDeleted !== null){

        var response = "Nothing"
        var message = "Cannot Delete"

        var status = "error"
    }else{
        // var get_parent_folder_id_for_delete = getFolderNameByID.parent_folder_id;
        // var get_folder_level_id_for_delete = getFolderNameByID.folder_level_id;
        var deleteFolderByFolderID = await service.deleteFolderByID({
            folder_id: folder_id_for_delete
        });

        var response = `deleted folder has folder name ${folder_id_for_delete}`

        var message = "Folder is deleted"

        var status = "success"
    }
    

    res.status(200).send({
        data: response,
        message: message,
        status: status
    });
})

// API06 RenameFolder
route.post("/folder/rename", async (req, res)=>{

    let {
        folder_id,
        folder_name_for_rename
    } = req.body;

    const folder_id_for_rename = folder_id;
    const input_folder_name_for_rename = folder_name_for_rename;

    var getFolderNameByIDForRename = await service.findFolderByID(folder_id_for_rename);

    var get_foldername_for_rename = getFolderNameByIDForRename.folder_name;

    var get_level_for_rename = getFolderNameByIDForRename.folder_level_id;

    var findFolderExistAtLevel = await service.findFolderExistAtLevelForRename({
        folder_name: input_folder_name_for_rename,
        folder_level_id: get_level_for_rename
    })

    if(input_folder_name_for_rename == get_foldername_for_rename){

        var response = "Nothing changed";
        var message = "Cannot rename, this folder name is exist";

        var status = "error";
    }else if(findFolderExistAtLevel !== null){
        var response = "Nothing changed";
        var message = "Cannot rename, this folder name is exist";

        var status = "error";
    }else{

        var renameFolderByName = await service.renameFolderNameByID({
            folder_id: folder_id_for_rename,
            folder_name: input_folder_name_for_rename
        });
        
        var response = `Folder ID ${folder_id_for_rename} rename to ${input_folder_name_for_rename}`;
    
        var message = "Folder is renamed";
    
        var status = "success";
    }
    

    res.status(200).send({
        data: response,
        message: message,
        status: status
    });
})

// API07 Delete File
route.post("/file/delete", async (req, res)=>{

    let {file_id} = req.body;

    const file_id_for_delete = file_id;

    var getFileNameByID = await service.findFileByID(file_id_for_delete);

    var get_filename_for_delete = getFileNameByID.name;
    console.log("get_filename_for_delete", get_filename_for_delete);
    var get_time_create_folder = getFileNameByID.createdAt;
    var checkFileisDeleted = await service.checkFileisDeleted({
        name:get_filename_for_delete,
        createdAt: get_time_create_folder
    });

    console.log("checkFileisDeleted", checkFileisDeleted);

    if(checkFileisDeleted.isDeleted == true){
        var response = "Nothing"
        var message = "Cannot Delete"

        var status = "error"
    }else{
        // var get_parent_folder_id_for_delete = getFolderNameByID.parent_folder_id;
        // var get_folder_level_id_for_delete = getFolderNameByID.folder_level_id;
        var deleteFileByFileID = await service.deleteFileByID({
            file_id: file_id_for_delete
        });

        var response = `deleted file has file name ${file_id_for_delete}`

        var message = "File is deleted"

        var status = "success"
    }
    res.status(200).send({
        data: response,
        message: message,
        status: status
    });
})

module.exports = route;