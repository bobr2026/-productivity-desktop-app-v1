const {  globalShortcut}= require("electron")

const openFolder =require("./openFolder")

const vork_data = require("./readORwrite_data")
const {getAllFolders}= require('../backend/folders')
const{getAllApps}= require("../backend/apps")
const {getAllScripts}= require('../backend/scripts')

async function getDataFilePath() {
    try {
      const data_file_path = await vork_data.data_file_path;
      return data_file_path
    } catch (error) {
      console.error("Ошибка при получении пути к файлу данных:", error);
      return null
    }
  }
async function get_json_data(){
    try{
      const data_file_path = await getDataFilePath(); // Дождитесь получения пути
      if (!data_file_path) {
          console.warn("Не удалось получить путь к файлу данных.");
          return null; // Или другое значение по умолчанию
      }
      const file = await vork_data.read_json_data(data_file_path);
      return file
  
    }
    catch(error){
  console.log(error)
    return null; // Или другое значение по умолчанию
    }
  }
  
async function get_app_hotkey(){

    const apps = await getAllApps()
    if(apps){

      for (const appID in apps) {
        const app = apps[appID];
     
        globalShortcut.register(app.hotkey, () => {
         openFolder.startApp(app.path)
        })
      }
    }
  
 
}

async function get_folder_hotkey(){

   const folders= await getAllFolders()
   
   
    
    console.log('click hotkey')
    if (folders) {
      for (const folderID in folders) {
        const folder = folders[folderID];
     if(folder.hotkey==null){
     console.log('not  open folder hotkey')
     return
     }
     else{
       globalShortcut.register(folder.hotkey, () => {
        openFolder.openFolder(folder.path)
       })

     }
    }
  
 
}
}
async function get_script_hotkey(){

  const scripts = await getAllScripts()

  if (scripts) {
    for (const scriptsID in scripts) {
      const script = scripts[scriptsID];
     console.log(script)
    globalShortcut.register(script.hotkey, () => {
     openFolder.startScript(script.interpritator, script.path)
    })
  }


}
else{
  console.log('not scripts ')
}
}


module.exports ={
    get_app_hotkey, get_folder_hotkey, get_script_hotkey
}
