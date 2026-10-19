const { parentPort, workerData, Worker } = require("worker_threads")
const {ipcMain} = require('electron')
const path = require('path')

const openFolder = require("../servis/openFolder")

function start_script_Function_handler(){
    ipcMain.handle('startScript', async (event, interpretator, path_script) => {
      try {
        const result = await openFolder.startScript(interpretator, path_script);
        return result;
      } catch (error) {
        console.error("Ошибка при вызове openFolder.startApp:", error);
        return { success: false, message: error.message };
      }
    });
}
function add_script_Function_handler(){
    ipcMain.handle('add_script', async (event, title, script_path, hotkey,interpritator ,start, scripts_grub_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            title: title,
            path:script_path,
            hotkey: hotkey,
            interpritator:interpritator,
            start:start, 
            scripts_grub_id:scripts_grub_id, 
            type: "add_script"
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
function delete_script_Function_handler(){
    ipcMain.handle('deleteScript', async (event,script_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
    
            script_id:script_id,
            type: "deleteScript"
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
function getAllScripts_Function_handler(){
    ipcMain.handle('getAllScripts', async (event,) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            type: "getAllScripts"
    
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
function updateScript_Function_handler(){
    ipcMain.handle('updateScript', async (event, title, script_path, hotkey,interpritator ,start, scripts_grub_id, script_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            
             title: title,
             path:script_path,
            hotkey: hotkey,
            interpritator:interpritator,
            start:start, 
            scripts_grub_id:scripts_grub_id, 
            script_id:script_id, 
            type: "updateScript"
    
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

function start_hendelers_script_function(){
    
const hendlers = [  add_script_Function_handler, delete_script_Function_handler, 
getAllScripts_Function_handler, updateScript_Function_handler, 
        start_script_Function_handler ]

    hendlers.forEach(hendlerFn=>{hendlerFn()})
}  
module.exports={
start_hendelers_script_function
}



