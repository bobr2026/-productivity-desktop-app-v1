const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")
 const{parentPort, workerData, Worker}= require("worker_threads")
 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

function addApps_grub(name){
    const insertCategory = db.prepare('INSERT INTO apps_grub (name) VALUES (?)');
    const addCategory = db.transaction((name) => {
      insertCategory.run(name);
    });
    addCategory(name)
    
}
function deletApps_grubByID(app_grub_id){
    const deleteCategory = db.prepare('DELETE FROM apps_grub WHERE id = ?');
    const deleted = deleteCategory.run(app_grub_id).changes;
    return deleted

}
function getAllAppsGrub(){
    const getAllCategories = db.prepare('SELECT id, name FROM apps_grub');
    const categories = getAllCategories.all();
    return categories
    console.log(categories)

}



function addScrits_grub(name){
    const insertCategory = db.prepare('INSERT INTO scrips_grub (name) VALUES (?)');
    const addCategory = db.transaction((name) => {
      insertCategory.run(name);
    });
    addCategory(name)
    
}
function deletScrit_grubByID(scrit_grub_id){
    const deleteCategory = db.prepare('DELETE FROM scrips_grub WHERE id = ?');
    const deleted = deleteCategory.run(scrit_grub_id).changes;
    return deleted

}
function getAllScritsGrub(){
    const getAllCategories = db.prepare('SELECT id, name FROM scrips_grub');
    const categories = getAllCategories.all();
    return categories
    console.log(categories)

}




function addFolder_grub(name){
    const insertCategory = db.prepare('INSERT INTO folders_grub (name) VALUES (?)');
    const addCategory = db.transaction((name) => {
      insertCategory.run(name);
    });
    addCategory(name)
    
}
function deletFeolder_grubByID(Folder_grub_id){
    const deleteCategory = db.prepare('DELETE FROM folders_grub WHERE id = ?');
    const deleted = deleteCategory.run(Folder_grub_id).changes;
    return deleted

}
function getFolderGrybById(folder_grub_id) {
    const getCategoryById= db.prepare('SELECT name FROM  folders_grub WHERE id =?')
    const category = getCategoryById.all(folder_grub_id)
    return category
}
function getAllFoldersGrub(){
    const getAllCategories = db.prepare('SELECT id, name FROM folders_grub');
    const categories = getAllCategories.all();
    return categories
    console.log(categories)

}
module.exports ={getAllFoldersGrub, deletFeolder_grubByID, addFolder_grub,getFolderGrybById,
addApps_grub, getAllAppsGrub, deletApps_grubByID,
addScrits_grub, getAllScritsGrub, deletScrit_grubByID

}