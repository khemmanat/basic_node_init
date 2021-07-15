//import lib
const express = require("express");
var fs = require("fs");
const multer = require("multer");
const path = require("path");
const Client = require("ssh2-sftp-client");
const client = new Client();
// import database
const db = require("../util/database");
// const fileController = require("../controller/fileController");
const Folder = db.folder;
const File = db.file;
const FolderLevel = db.folder_level;

exports.createFolderLevel = async (payload) => {
  try {
    return await FolderLevel.create(payload);
  } catch (error) {
    throw error;
  }
};

exports.getFolderLevelByEach = async (payload) => {
  try {
    return await FolderLevel.findOne({
      where: {
        level: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.createFolder = async (payload) => {
  let { folder_name, parent_folder_id, folder_level_id } = payload;
  try {
    return await Folder.create({
      folder_name: folder_name,
      parent_folder_id: parent_folder_id,
      folder_level_id: folder_level_id,
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByID = async (payload) => {
  try {
    return await Folder.findOne({
      where: {
        folder_id: payload,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: FolderLevel,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: File,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

// exports.getFolderByName = async (payload) => {
//     try{
//         return await Folder.findOne({
//             where: {folder_id : payload}
//         })
//     } catch (error){
//         throw error;
//     }
// };

exports.findFolderName = async (payload) => {
  // console.log("payload",payload);
  try {
    return await Folder.findOne({
      where: {
        folder_name: payload,
      },
      include: [
        {
          model: FolderLevel,
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByLevel = async (payload) => {
  try {
    return await Folder.findAll({
      where: {
        folder_level_id: payload,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: FolderLevel,
        },
        {
          model: File,
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderAtLevelByID = async (payload) => {
  let { folder_id, level } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_id: folder_id,
        folder_level_id: level,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: FolderLevel,
        },
        {
          model: File,
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.uploadFileAtLevel = async (payload) => {
  let { url, name, type, size, folder_id } = payload;
  try {
    return await File.create({
      url: url,
      name: name,
      type: type,
      size: size,
      folder_id: folder_id,
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderToCompare = async (payload) => {
  let { folder_name, level } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_name: folder_name,
        folder_level_id: level,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.findFolderByID = async (payload) => {
  console.log("folder_id", payload);
  try {
    return await Folder.findOne({
      where: {
        folder_id: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByFolderID = async (payload) => {
  let { parent_folder_id, level } = payload;
  try {
    return await Folder.findOne({
      where: {
        parent_folder_id: parent_folder_id,
        folder_level_id: level,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByFolderIDFake = async (payload) => {
  let { parent_folder_id, level } = payload;
  try {
    return await Folder.findOne({
      where: {
        parent_folder_id: parent_folder_id,
        folder_level_id: level,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.findAllFolderForNextLevel = async (payload) => {
  let { parent_folder_id, folder_level_id } = payload;
  console.log("parent_id", parent_folder_id);
  console.log("folder_level_id", folder_level_id);
  try {
    return await Folder.findAll({
      where: {
        parent_folder_id: parent_folder_id,
        folder_level_id: folder_level_id,
        isDeleted: false,
      },
      include: [
        {
          model: File,
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.findEachFolder = async (payload) => {
  let { parent_folder_id, folder_level_id } = payload;
  try {
    return await Folder.findAll({
      where: {
        parent_folder_id: parent_folder_id,
        folder_level_id: folder_level_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByEachID = async (payload) => {
  try {
    return await Folder.findOne({
      where: { folder_id: payload },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderLevelByLevelID = async (payload) => {
  try {
    return await FolderLevel.findOne({
      where: {
        folder_level_id: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.createFile = async (payload) => {
  let { url, name, type, size, res_folder_id } = payload;
  try {
    return await File.create({
      folder_id: res_folder_id,
      url: url,
      name: name,
      type: type,
      size: size,
    });
  } catch (error) {
    throw error;
  }
};

exports.getParentFolderName = async (payload) => {
  try {
    return await Folder.findOne({
      where: {
        folder_id: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderForFile = async (payload) => {
  try {
    return await Folder.findOne({
      //   limit: 1,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByNameAndLevel = async (payload) => {
  let { get_folder_name, get_folder_level } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_name: get_folder_name,
        folder_level_id: get_folder_level,
      },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.findFolderExistAtLevel = async (payload) => {
  let { folder_name, parent_folder_id, level } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_name: folder_name,
        parent_folder_id: parent_folder_id,
        folder_level_id: level,
      },
      include: [
        {
          model: File,
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteFolderByID = async (payload) => {
  let { folder_id } = payload;
  try {
    return await Folder.update(
      {
        isDeleted: true,
      },
      {
        where: {
          folder_id: folder_id,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

exports.checkFolderisDeleted = async (payload) => {
  try {
    return await Folder.findOne({
      where: {
        folder_name: payload,
        isDeleted: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.renameFolderNameByID = async (payload) => {
  let { folder_id, folder_name } = payload;
  try {
    return await Folder.update(
      {
        folder_name: folder_name,
      },
      {
        where: {
          folder_id: folder_id,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

exports.findFolderExistAtLevelForRename = async (payload) => {
  let { folder_name, folder_level_id } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_name: folder_name,
        folder_level_id: folder_level_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.findFileByID = async (payload) => {
  try {
    return await File.findOne({
      where: {
        file_id: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.checkFileisDeleted = async (payload) => {
  let {name, createdAt} = payload;
    try {
    return await File.findOne({
      where: {
        name: name,
        createdAt: createdAt
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteFileByID = async (payload) => {
  let { file_id } = payload;
  try {
    return await File.update(
      {
        isDeleted: true,
      },
      {
        where: {
          file_id: file_id,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

exports.getFileByID = async (payload) => {
  try {
    return await File.findOne({
      where: {
        file_id: payload,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderForGetFolderByID = async (payload) => {
  try {
    return await Folder.findOne({
      where: {
        folder_id: payload,
        isDeleted: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: FolderLevel,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: File,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getFolderByFolderIDForGet = async (payload) => {
  try {
    return await Folder.findOne({
      where: {
        folder_id: payload,
        isDeleted: false,
      },
    //   include: [
    //     {
    //       model: File,
    //     },
    //   ],
    });
  } catch (error) {
    throw error;
  }
};

exports.findFolderByNameandLevel = async (payload) => {
  let { folder_name, folder_level_id } = payload;
  try {
    return await Folder.findOne({
      where: {
        folder_name: folder_name,
        folder_level_id: folder_level_id,
        isDeleted: false,
      },
    //   include: [
    //     {
    //       model: File,
    //       attributes: {
    //         exclude: ["createdAt", "updatedAt"],
    //       },
    //       where: {
    //         isDeleted: false,
    //       },
    //     },
    //   ],
    });
  } catch (error) {
    throw error;
  }
};

exports.findAllFolderForNextLevelByOnlyID = async (payload) => {
  let { parent_folder_id, folder_level_id } = payload;
  console.log("parent_id", parent_folder_id);
  console.log("folder_level_id", folder_level_id);
  try {
    return await Folder.findAll({
      where: {
        parent_folder_id: parent_folder_id,
        folder_level_id: folder_level_id,
        isDeleted: false,
      },
      // include:[
      //   {
      //     model: File,
      // //     where:{isDeleted: false}
      //   }
      // ]
      
    });
  } catch (error) {
    throw error;
  }
};

exports.getFileByFolderID = async (payload) => {
    try{
        return await File.findAll({
            where: {
                folder_id: payload,
                isDeleted: false,
            }
        })
    } catch (error) {
        throw error;
    }
};

exports.getFolderofParentFolder = async (payload) => {
    try{
        return await Folder.findOne({
            where: { 
                folder_id: payload,
            }
        })
    } catch (error) {
        throw error;
    }
};

exports.getFolderToCompareForParent = async (payload) => {
    let { folder_name, level , parent_folder_id} = payload;
    try {
      return await Folder.findOne({
        where: {
          folder_name: folder_name,
          folder_level_id: level,
          parent_folder_id: parent_folder_id,
        },
      });
    } catch (error) {
      throw error;
    }
  };