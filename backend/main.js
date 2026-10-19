
 const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")
 const {add_note, deleteNote, getAllNotes, updateNote, getNoteByTitle}= require("./notes")
 const {deleteCategoryByID, addCategory, getAllCategories, getCategoryById}= require("./cotegory")


  const {add_script, deleteScript, getAllScripts, getScriptByTitle, updateScript }= require("./scripts")
    const {add_folder,  updateFolder, deletefolder,  getAllFolders}= require("./folders")
 const {add_app, deleteApp, getAllApps, getAppByTitle , updateApp}= require("./apps")

 const {getAllFoldersGrub, deletFeolder_grubByID, addFolder_grub,getFolderGrybById,
addApps_grub, getAllAppsGrub, deletApps_grubByID,
addScrits_grub, getAllScritsGrub, deletScrit_grubByID}= require('./grubs')

 const{parentPort, workerData, Worker}= require("worker_threads")
 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
 const Database = require('better-sqlite3');
 const db = new Database(path_database);


 if(workerData.type=="add_notes"){ 
  
   add_note(workerData.title, workerData.content, workerData.category_id)
    }
    if(workerData.type=="update_Note"){ updateNote(workerData.title, workerData.content, workerData.category_id, workerData.note_id) }
    
    if(workerData.type=="deleteNote"){ deleteNote(workerData.note_id) }
    if(workerData.type=="getAllNotes"){ 
       const AllNotes=  getAllNotes()
  parentPort.postMessage({notes:AllNotes})
  return AllNotes 
 }
 if(workerData.type=="getNoteByTitle"){ getNoteByTitle(workerData.note_title)}
 if(workerData.type=="clearAllDataToDataBase"){ clearAllDataToDataBase() }
 
 async function clearAllDataToDataBase(){
    db.exec(`DROP TABLE IF EXISTS notes   ;
        DROP TABLE IF EXISTS categories  ;`)
        const file = await read_json_data(data_file_path); 
        file.initDatabase = false
    await write_json_data(data_file_path,file );
    console.log(`All data TABLE deleted from DataBase`)
    console.log('function clearAllDataToDataBase: Initializing database...  ' )
   }
   
async function clearAll_lNotesFromDataBase(){
   
}
if(workerData.type=="add_app"){ 
  
   add_app(workerData.title, workerData.path, workerData.hotkey, workerData.app_grub_id)
}
  
if(workerData.type=="update_app"){
    updateApp(workerData.title, workerData.path,
       workerData.hotkey, workerData.app_grub_id, workerData.app_id) }

if(workerData.type=="deleteApp"){ deleteApp(workerData.app_id) }
if(workerData.type=="getAllApps"){ 
  const AllApps=  getAllApps()
  
  parentPort.postMessage(AllApps)
  return AllApps
}


 if(workerData.type=="add_folder"){ 
    add_folder(workerData.icon_id, workerData.path, workerData.hotkey,
     workerData.folder_grub_id)
   }
  
   if(workerData.type=="updateFolder"){ updateFolder(workerData.icon_id, workerData.path, workerData.hotkey, workerData.folder_grub_id , workerData.folder_id) }
   
   if(workerData.type=="deleteFolder"){ deletefolder(workerData.folder_id) }
  if(workerData.type=="getAllFolders"){ 
     console.log("444")
     const getAllFolder=  getAllFolders()
     parentPort.postMessage( getAllFolder)
  return getAllFolder 
}


if(workerData.type=="add_script"){ 
   add_script(
      workerData.title,
      workerData.path,
      workerData.hotkey,
      workerData.interpritator,
      workerData.start,
      workerData.scripts_grub_id
    );
    }
    
    if(workerData.type=="updateScript"){ updateScript(workerData.title, workerData.path, workerData.hotkey,
      workerData.interpritator, workerData.start,workerData.scripts_grub_id, workerData.script_id) }
 
      if(workerData.type=="deleteScript"){ deleteScript(workerData.script_id) }
      if(workerData.type=="getAllScripts"){ 
     const AllScripts=  getAllScripts()
     parentPort.postMessage( AllScripts)
     return AllScripts 
   }
   



   if(workerData.type=="addApps_grub"){ addApps_grub(workerData.app_grub_name) }
   if(workerData.type=="getAllAppsGrub"){ 
      const AllAppsGrub=  getAllAppsGrub()
      parentPort.postMessage(AllAppsGrub)
      return AllAppsGrub
   }
   if(workerData.type=="addFolder_grub"){ addFolder_grub(workerData.folder_grub_name) }
   if(workerData.type=="getAllFoldersGrub"){ 
      const AllFoldersGrub=  getAllFoldersGrub()
   parentPort.postMessage(AllFoldersGrub)
   return AllFoldersGrub
}
   if(workerData.type=="addScrits_grub"){ addScrits_grub(workerData.scripts_grub_name) }
   if(workerData.type=="getAllScritsGrub"){ 
      const AllScritsGrub=  getAllScritsGrub()
      parentPort.postMessage(AllScritsGrub)
      return AllScritsGrub
   }
   if(workerData.type=="add_category"){ addCategory(workerData.category_name) }
   if(workerData.type=="getAllCategories"){ 
        const allCategories=  getAllCategories()
        parentPort.postMessage(allCategories)
   return allCategories
}
if(workerData.type=="deleteCategoryByID"){ deleteCategoryByID(workerData.category_id)}
     if(workerData.type=="getCategoryById"){ 
      const category =getCategoryById(workerData.category_id)
      parentPort.postMessage(category)

     }
        if(workerData.type=="getFolderGrybById"){ 
      const category =getFolderGrybById(workerData.folder_grub_id)
      parentPort.postMessage(category)

     }
// add_folder(workerData.title, workerData.path, workerData.hotkey,
//     workerData.interpritator, workerData.start,workerData.scripts_grub_id)
    