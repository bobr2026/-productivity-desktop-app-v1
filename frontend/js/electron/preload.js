const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  read_json_data: (file_path) => ipcRenderer.invoke('read_json_data', file_path, ),
  write_json_data: (file_path, data) => ipcRenderer.invoke('write_json_data', file_path, data),
 get_data_file_path: () => ipcRenderer.invoke('get_data_file_path', ),
 startScript: (interpretator,path_script ) => ipcRenderer.invoke('startScript',interpretator,path_script ),
 startApp: (path_app) => ipcRenderer.invoke('startApp',path_app ),
 start_taimer: (hurus, minuts, stop_btn, display_hurus, minut_display, secend_display,) => ipcRenderer.invoke('start_taimer',hurus, minuts, stop_btn, display_hurus, minut_display, secend_display,),

 get_app_hotkey:( )=>ipcRenderer.invoke('get_app_hotkey',),
 get_folder_hotkey:( )=>ipcRenderer.invoke('get_folder_hotkey',),
 get_script_hotkey:( )=>ipcRenderer.invoke('get_script_hotkey',),
});
contextBridge.exposeInMainWorld("DataBaseAPI", {
  getAllNotes:( )=>ipcRenderer.invoke('getAllNotes',),
  add_notes:(title, content, category_id)=>ipcRenderer.invoke('add_notes',title, content, category_id ),
  update_Note:(title, content, category_id, note_id)=>ipcRenderer.invoke('update_Note',title, content, category_id, note_id),
  deleteNote:( note_id)=>ipcRenderer.invoke('deleteNote',note_id),


  add_category:(category_name )=>ipcRenderer.invoke('add_category',category_name  ),
  getAllCategories:( )=>ipcRenderer.invoke('getAllCategories',),
    getCategoryById:(category_id )=>ipcRenderer.invoke('getCategoryById',category_id  ),
       deleteCategoryByID:(category_id )=>ipcRenderer.invoke('deleteCategoryByID',category_id  ),
  //getCategoryById



  addApps_grub:(app_grub_name )=>ipcRenderer.invoke('addApps_grub',app_grub_name ),
  getAllAppsGrub:( )=>ipcRenderer.invoke('getAllAppsGrub',),

addFolder_grub:(folder_grub_name )=>ipcRenderer.invoke('addFolder_grub',folder_grub_name  ),
  getAllFoldersGrub:( )=>ipcRenderer.invoke('getAllFoldersGrub',),
  getFolderGrybById:(folder_grub_id )=>ipcRenderer.invoke('getFolderGrybById',folder_grub_id  ),

 addScrits_grub:(scripts_grub_name )=>ipcRenderer.invoke('addScrits_grub',scripts_grub_name ),
  getAllScritsGrub:( )=>ipcRenderer.invoke('getAllScritsGrub',),

  getAllApps:( )=>ipcRenderer.invoke('getAllApps',),
  add_app:(title,path ,hotkey,  app_grub_id)=>ipcRenderer.invoke('add_app', title,path ,hotkey,  app_grub_id ),
  update_app:(title, path, hotkey, app_grub_id, app_id)=>ipcRenderer.invoke('update_app',title, path, hotkey, app_grub_id, app_id),
  deleteApp:( app_id)=>ipcRenderer.invoke('deleteApp',app_id),


  getAllFolders:( )=>ipcRenderer.invoke('getAllFolders',),
  add_folder:(icon, path, hotkey, folder_grub_id)=>ipcRenderer.invoke('add_folder',icon, path, hotkey, folder_grub_id),
  updateFolder:(icon,path, hotkey , folder_grub_id,folder_id)=>ipcRenderer.invoke('updateFolder',icon,path, hotkey , folder_grub_id,folder_id),
  deleteFolder:(folder_id )=>ipcRenderer.invoke('deleteFolder',folder_id),

  getAllScripts:( )=>ipcRenderer.invoke('getAllScripts',),
  add_script: (title, script_path, hotkey, interpritator, start, scripts_grub_id) =>
    ipcRenderer.invoke('add_script', title, script_path, hotkey, interpritator, start, scripts_grub_id),
  updateScript:(title, script_path, hotkey,interpritator ,start, scripts_grub_id, script_id)=>ipcRenderer.invoke('updateScript', title, script_path, hotkey,interpritator ,start, scripts_grub_id, script_id),
  deleteScript:( script_id)=>ipcRenderer.invoke('deleteScript',script_id),


    clearAllDataToDataBase:( )=>ipcRenderer.invoke('clearAllDataToDataBase',),
      openUpdateNoteWindow: (noteData) => ipcRenderer.send('open-update-note-window', noteData),
    receiveNoteData: (callback) => ipcRenderer.on('note-data', (event, data) => callback(data)) ,// Listen for note data
    penUpdateFolderWindow: (folderData) => ipcRenderer.send('open-update-folder-window', folderData),
    openUpdateAppWindow: (AppData) => ipcRenderer.send('open-update-app-window', AppData),
    receiveFolderData: (callback) => ipcRenderer.on('folder-data', (event, data) => callback(data)) ,// Listen for note data
    receiveAppData: (callback) => ipcRenderer.on('app-data', (event, data) => callback(data)) // Listen for note data
})

contextBridge.exposeInMainWorld("WindowsAppAPI", {
  open_add_new_app_window: () => ipcRenderer.invoke('open-add-new-app-window'),
 open_add_new_script_window: () => ipcRenderer.invoke('open-add-new-script-window'),
  open_add_new_notes_window: () => ipcRenderer.invoke('open-add-new-notes-window'),
    reloadApp: () => ipcRenderer.invoke('reloadApp'),

})

contextBridge.exposeInMainWorld("SetingsAPI", {
  setTelegramBotToken: (token) => ipcRenderer.invoke('setTelegramBotToken', token),
 

})
