const { parentPort, workerData, Worker } = require("worker_threads")
const {ipcMain} = require('electron')
const path = require('path')

function openFolderFunction_handler(){
    ipcMain.handle('open-folder', async (event, folderPath) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../servis/open_folder_worker.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            folderPath: folderPath
          }
        });
        
        openFolderWorker.on("message", (result) => {
          console.log(`Open folder ${result}`);
          resolve(result); // Resolve the promise with the worker's result
        });
    
        openFolderWorker.on("error", (err) => {
          console.error(`Open folder error ${err}`);
          reject(err); // Reject the promise if there's an error
        });
    
        openFolderWorker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

}
function add_folder_Function_handler(){
    ipcMain.handle('add_folder', async (event, icon_id,path_folder ,hotkey,  folder_grub_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            icon_id: icon_id,
            path:path_folder,
            hotkey: hotkey,
            folder_grub_id:folder_grub_id,  
            type: "add_folder"
          }
        });
    
        openFolderWorker.on("message", (result) => {
          console.log(`add_app message: ${JSON.stringify(result)}`); // Debug log
          resolve(result); // Resolve the promise with the worker's result
        });
    
        openFolderWorker.on("error", (err) => {
          console.error(`add app error: ${err}`);
          reject(err); // Reject the promise if there's an error
        });
    
        openFolderWorker.on("exit", (code) => {
          console.log(`Worker exited with code ${code}`); // Debug log
          if (code !== 0) {
            const error = new Error(`Worker stopped with exit code ${code}`);
            console.error(`Worker error: ${error}`);
            reject(error);
          } else {
            console.log("Worker completed successfully"); // Debug log
          }
        });
      });
    });

}

function delete_folder_Function_handler(){
    ipcMain.handle('deleteFolder', async (event, folder_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
    
            folder_id:folder_id,
            type: "deleteFolder"
          }
        });
    
        openFolderWorker.on("message", (result) => {
          console.log(`add_notes message: ${JSON.stringify(result)}`); // Debug log
          resolve(result); // Resolve the promise with the worker's result
        });
    
        openFolderWorker.on("error", (err) => {
          console.error(`Open folder error: ${err}`);
          reject(err); // Reject the promise if there's an error
        });
    
        openFolderWorker.on("exit", (code) => {
          console.log(`Worker exited with code ${code}`); // Debug log
          if (code !== 0) {
            const error = new Error(`Worker stopped with exit code ${code}`);
            console.error(`Worker error: ${error}`);
            reject(error);
          } else {
            console.log("Worker completed successfully"); // Debug log
          }
        });
      });
    });

}
function getAllFolders_Function_handler(){
    ipcMain.handle('getAllFolders', async (event,) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            type: "getAllFolders"
    
          }
        });
        
        openFolderWorker.on("message", (result) => {
          console.log(`add_notes ${result}`);
          resolve(result); // Resolve the promise with the worker's result
        });
    
        openFolderWorker.on("error", (err) => {
          console.error(`Open folder error ${err}`);
          reject(err); // Reject the promise if there's an error
        });
    
        openFolderWorker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

}

function updateFolder_Function_handler(){
    ipcMain.handle('updateFolder', async (event, icon_id, path_folder, hotkey , folder_grub_id,folder_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            
          icon_id: icon_id,
            path:path_folder,
            hotkey: hotkey,
            folder_grub_id:folder_grub_id, 
           folder_id:folder_id, 
           type: "updateFolder"
    
          }
        });
    
        openFolderWorker.on("message", (result) => {
          console.log(`update_Note${result}`);
          resolve(result); // Resolve the promise with the worker's result
        });
    
        openFolderWorker.on("error", (err) => {
          console.error(`Open folder error ${err}`);
          reject(err); // Reject the promise if there's an error
        });
    
        openFolderWorker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

}


function start_hendelers_folder_function(){

    const hendlers = [ openFolderFunction_handler, add_folder_Function_handler 
        , delete_folder_Function_handler, getAllFolders_Function_handler, updateFolder_Function_handler ]

    hendlers.forEach(hendlerFn=>{hendlerFn()})
}  
module.exports={
start_hendelers_folder_function
}

