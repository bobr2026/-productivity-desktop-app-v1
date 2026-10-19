const { parentPort, workerData, Worker } = require("worker_threads")
const {ipcMain} = require('electron')
const path = require('path')

function add_npte_Function_handler(){
    ipcMain.handle('add_notes', async (event, title, content, category_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            title: title,
            content: content,
            category_id: category_id,
            type: "add_notes"
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
function delete_npte_Function_handler(){
    ipcMain.handle('deleteNote', async (event, note_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
    
            note_id: note_id,
            type: "deleteNote"
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

function getAllNotes_Function_handler(){
    ipcMain.handle('getAllNotes', async (event,) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "../backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            type: "getAllNotes"
    
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
function updateNote_Function_handler(){
    ipcMain.handle('update_Note', async (event, title, content, category_id, note_id) => {
      return new Promise((resolve, reject) => {
        const Worker_path = path.join(__dirname, "...backend/main.js",)
        const openFolderWorker = new Worker(Worker_path, {
          workerData: {
            
            title: title,
            content: content,
            category_id: category_id,
            note_id: note_id,
            type: "update_Note"
    
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
function start_hendelers_notes_function(){
    
    const hendlers = [ updateNote_Function_handler, getAllNotes_Function_handler,
        delete_npte_Function_handler, add_npte_Function_handler, ]

    hendlers.forEach(hendlerFn=>{hendlerFn()})
}  
module.exports={
start_hendelers_notes_function
}



