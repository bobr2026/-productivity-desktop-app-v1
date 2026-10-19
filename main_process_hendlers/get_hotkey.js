const {ipcMain} = require('electron')
const register_shortcut = require("../servis/register_shortcut")

 function get_app_hotkey_Function_handler(){
    ipcMain.handle('get_app_hotkey', async (event, ) => {
      try {
        const result = await  register_shortcut.get_app_hotkey();
        return result;
      } catch (error) {
        console.error(" register_shortcut.get_app_hotkey()", error);
        return { success: false, message: error.message };
      }
    });

}
 function get_folder_hotkey_Function_handler(){
    ipcMain.handle('get_folder_hotkey', async (event, ) => {
        try {
          const result = await  register_shortcut.get_folder_hotkey();
          return result;
        } catch (error) {
          console.error(" register_shortcut.get_folder_hotkey()", error);
          return { success: false, message: error.message };
        }
      });

} function get_script_hotkey_Function_handler(){
    ipcMain.handle('get_script_hotkey', async (event, ) => {
        try {
          const result = await  register_shortcut.get_script_hotkey();
          return result;
        } catch (error) {
          console.error(" register_shortcut.get_script_hotkey", error);
          return { success: false, message: error.message };
        }
      });

}
function start_hendelers_getHotkey_function(){

    const hendlers = [ get_app_hotkey_Function_handler, get_folder_hotkey_Function_handler, get_script_hotkey_Function_handler ]

    hendlers.forEach(hendlerFn=>{hendlerFn()})
}  
module.exports={
start_hendelers_getHotkey_function
}

