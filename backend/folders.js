const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")

 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

function add_folder(icon_id, path, hotkey, folder_grub_id){
    const insertFolders = db.prepare('INSERT INTO folders (icon_id, path,hotkey, folder_grub_id) VALUES (?, ?, ?, ?)');
     const addFolder = db.transaction((icon, path,hotkey, folder_grub_id) => {
       insertFolders.run(icon, path, hotkey, folder_grub_id);
       console.log("ok test ")
    })
    addFolder(icon_id, path, hotkey, folder_grub_id)
}
function getAllFolders(){
    const getAllFolders = db.prepare('SELECT id, icon_id,path, hotkey , folder_grub_id FROM folders');
    const folders = getAllFolders.all();
  
  return folders
}
function updateFolder(icon_id,path, hotkey , folder_grub_id,folder_id){
    const updateApp = db.prepare('UPDATE folders SET icon_id = ?, path = ?, hotkey = ?,folder_grub_id=?  WHERE id = ?');
    const changes = updateApp.run(icon_id,path, hotkey , folder_grub_id, folder_id).changes;
    
    return changes
}

function deletefolder(folder_id){
    const deletefolder = db.prepare('DELETE FROM folders WHERE id = ?');
     const deleted = deletefolder.run(folder_id).changes;
     return deleted

}
function getFolderByGrub_id(folder_grub_id){
    
    const getFolderByID = db.prepare('SELECT icon_id, path, hotkey , folder_grub_id FROM folders WHERE folder_grub_id = ?');
    const folder= getFolderByID.get(folder_grub_id);
    return folder
}
module.exports={
   deletefolder, getFolderByGrub_id, getAllFolders, add_folder, updateFolder
}