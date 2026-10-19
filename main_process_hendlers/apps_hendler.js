const { parentPort, workerData, Worker } = require("worker_threads")
const {ipcMain} = require('electron')
const path = require('path')

const openFolder = require("../servis/openFolder")

function start_app_Function_handler(){
    ipcMain.handle('startApp', async (event, appPath) => {
      try {
        const result = await openFolder.startApp(appPath);
        return result;
      } catch (error) {
        console.error("Ошибка при вызове openFolder.startApp:", error);
        return { success: false, message: error.message };
      }
    });
}
function add_app_Function_handler(){
    ipcMain.handle('add_app', async (event, title,path_app ,hotkey,  app_grub_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            title: title,
            path:path_app,
            hotkey: hotkey,
            app_grub_id:app_grub_id, 
            type: "add_app"
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
function delete_app_Function_handler(){
    ipcMain.handle('deleteApp', async (event, app_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
    
            app_id:app_id,
            type: "deleteApp"
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
function getAllapps_Function_handler(){
    ipcMain.handle('getAllApps', async (event,) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            type: "getAllApps"
    
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
function updateApp_Function_handler(){
    ipcMain.handle('update_app', async (event, title, path_app, hotkey, app_grub_id, app_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            
            title: title,
           path:path_app,
           hotkey:hotkey, 
           app_grub_id:app_grub_id,
           app_id:app_id, 
           type: "update_app"
    
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
function start_hendelers_app_function(){

    const hendlers = [add_app_Function_handler, delete_app_Function_handler,
        getAllapps_Function_handler,updateApp_Function_handler, start_app_Function_handler]

    hendlers.forEach(hendlerFn=>{hendlerFn()})
}  
module.exports={
start_hendelers_app_function
}



