const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")
const fs = require("fs") 
async function cretedDir(){

  if(!fs.existsSync(filePath)){
  
      fs.mkdir(filePath, (err)=>{
          if(err){
              console.log(err)
          }
      })
    
      
  
  }

}
 cretedDir()
 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

// function add_script(title, path, hotkey,interpritator ,start, scripts_grub_id){
//     const insertFolders = db.prepare('INSERT INTO scripts (title, path,hotkey,interpritator,start, scripts_grub_id) VALUES (?, ?, ?, ?, ?, ?)');
//      const addFolder = db.transaction((title, path,hotkey,interpritator,start, scripts_grub_id) => {
//        insertFolders.run(title, path, hotkey, interpritator ,start, scripts_grub_id);
//        console.log("ok test ")
//       })
//       addFolder(title, path, hotkey,interpritator,start,  scripts_grub_id)
// }
// function add_script(title, path, hotkey, interpritator, start, scripts_grub_id) {
//     const insertFolders = db.prepare('INSERT INTO scripts (title, path, hotkey, interpritator, start, scripts_grub_id) VALUES (?, ?, ?, ?, ?, ?)');  // 6 знаков вопроса!
//     const addFolder = db.transaction((title, path, hotkey, interpritator, start, scripts_grub_id) => {
//         insertFolders.run(title, path, hotkey, interpritator, start, scripts_grub_id);
//         console.log("ok test ");
//         return; // Важно: возвращаем undefined, чтобы транзакция знала, что все прошло успешно.  Можно вернуть любое значение, главное не кидать ошибку.
//     });
//     addFolder(title, path, hotkey, interpritator, start, scripts_grub_id);
//}

function add_script(title, path, hotkey, interpritator, start, scripts_grub_id) {

  const insertFolders = db.prepare('INSERT INTO scripts (title, path, hotkey, interpritator, start, scripts_grub_id) VALUES (?, ?, ?, ?, ?, ?)');
  const addFolder = db.transaction((title, path, hotkey, interpritator, start, scripts_grub_id) => {
    insertFolders.run(title, path, hotkey, interpritator, start, scripts_grub_id);
    console.log("ok test ");
    return; 
  });
  addFolder(title, path, hotkey, interpritator, start, scripts_grub_id);
}
function getAllScripts(){
    const getAllScripts = db.prepare('SELECT id, title, path,hotkey,interpritator,start,  scripts_grub_id FROM scripts');
    const Scripts = getAllScripts.all();
  
  return Scripts
}

function updateScript(title, path, hotkey,interpritator,start,  scripts_grub_id , script_id){
    const updateScript = db.prepare('UPDATE scripts SET title = ?, path = ?, hotkey = ?, interpritator=?,start=?,  scripts_grub_id=?  WHERE id = ?');
    const changes = updateScript.run(title, path, hotkey,interpritator,start,  scripts_grub_id, script_id).changes;
    return changes
}
function deleteScript(script_id){
    const deleteScript = db.prepare('DELETE FROM scripts WHERE id = ?');
     const deleted = deleteScript.run(script_id).changes;
     return deleted

}
function getScriptByTitle(title_script){
    
    const getScriptByID = db.prepare('SELECT title, interpritator, path, hotkey ,start,  scripts_grub_id FROM folders WHERE scripts = ?');
    const Script= getScriptByID.get(title_script);
    return Script 
}
module.exports={
   add_script, deleteScript, getAllScripts, getScriptByTitle, updateScript
}