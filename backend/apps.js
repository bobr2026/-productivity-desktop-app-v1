const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")

 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

function add_app(title, path, hotkey, app_grub_id){
    const insertApps = db.prepare('INSERT INTO apps (title, path,hotkey, app_grub_id) VALUES (?, ?, ?, ?)');
     const addApp = db.transaction((title, path,hotkey, app_grub_id) => {
       insertApps.run(title, path, hotkey, app_grub_id);
       console.log("ok test ")
    })
    addApp(title, path, hotkey, app_grub_id)
}
function getAllApps(){
    const getAllApps = db.prepare('SELECT id, title,path, hotkey , app_grub_id FROM apps');
    const apps = getAllApps.all();
  
  return apps
}

function updateApp(title, path, hotkey, app_grub_id, app_id){
    const updateApp = db.prepare('UPDATE apps SET title = ?, path = ?, hotkey = ?,app_grub_id=?  WHERE id = ?');
    const changes = updateApp.run(title, path, hotkey, app_grub_id, app_id).changes;
    
 return changes
}
function deleteApp(app_id){
    const deleteApp = db.prepare('DELETE FROM apps WHERE id = ?');
     const deleted = deleteApp.run(app_id).changes;
     return deleted

}
function getAppByTitle(title_app){
    
    const getAppByTitle = db.prepare('SELECT title,path, hotkey , app_grub_id FROM apps WHERE title = ?');
    const App = getAppByTitle.get(title_app);
    return App
}
module.exports={
    add_app, deleteApp, getAllApps, getAppByTitle,updateApp
}