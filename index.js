const { filePath, data_file_path, read_json_data, write_json_data} = require("./servis/readORwrite_data")

const path = require('path');
const fs = require('fs');
const spawn = require("child_process");
const {   BrowserWindow, app, ipcMain, TouchBar, Menu, Tray, globalShortcut } = require("electron")
const notifier = require('node-notifier');

const openFolder = require("./servis/openFolder")
const vork_data = require("./servis/readORwrite_data")
const { get_scripts } = require("./frontend/js/scripts")
const register_shortcut = require("./servis/register_shortcut")


const {start_hendelers_getHotkey_function}=require('./main_process_hendlers/get_hotkey')
const {start_hendelers_folder_function}=require('./main_process_hendlers/folders_hendler')
const {start_hendelers_app_function}=require('./main_process_hendlers/apps_hendler')
const {start_hendelers_script_function}=require('./main_process_hendlers/scripts_hendler')
const {start_hendelers_notes_function}=require('./main_process_hendlers/notes_hendler')


const bot = require("./servis/bot");
const { webContents } = require('electron/main');
const { parentPort, workerData, Worker } = require("worker_threads")
// const {Taimer}= require("./servis/taimer")
async function cretedDir(){
  if(!fs.existsSync(filePath)){
  
      fs.mkdir(filePath, (err)=>{
          if(err){
              console.log(err)
          }
      })
    
      
  
  }

}
const name_db = 'Admin_app.db'
const path_database = path.join(filePath, name_db)
console.log(path_database)
const Database = require('better-sqlite3');
const iconPath = path.join(__dirname, 'trayTemplate-2x.png');
const db = new Database(path_database);
async function initializeDatabase() {
  const file = await read_json_data(data_file_path); // Дожидаемся результат
  if (file.initDatabase == false) {
    console.log('Initializing database...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
        )
        `);
        
        db.exec(`
          CREATE TABLE IF NOT EXISTS folders_grub (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
            )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS apps_grub (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS scrips_grub (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        category_id INTEGER,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon_id INTEGER,
        path TEXT NOT NULL,
        hotkey TEXT,
        folder_grub_id INTEGER,
        FOREIGN KEY (folder_grub_id) REFERENCES folders_grub(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS apps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        path TEXT NOT NULL,
        hotkey TEXT,
        app_grub_id INTEGER,
        FOREIGN KEY (app_grub_id) REFERENCES apps_grub(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        path TEXT NOT NULL,
        interpritator TEXT NOT NULL,
        hotkey TEXT,
        scripts_grub_id INTEGER,
        start TEXT,
        FOREIGN KEY (scripts_grub_id) REFERENCES scrips_grub(id)
    )
`);

db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
    AFTER UPDATE ON notes
    BEGIN
        UPDATE notes SET updated_at = DATETIME('now') WHERE id = NEW.id;
    END;
`);
    file.initDatabase = true
    await write_json_data(data_file_path, file); // Дожидаемся записи в файл
    console.log('Database initialized.');
  } else {
    console.log('Database already initialized.');
  }
}

initializeDatabase()
vork_data.create_folder_data()




const createMwnu = () => {
  //     const menu = new Menu.buildFromTemplate([
    //         {
      //             label:"Admin_app", 
      //             submenu:[
        
      //          {role:"quit"},
      //          {type:"separator"},
      //          {role:"forceReload"},
      //          {role:"help", click(){
        //           create_help_window()
        //          }}
        //         ]
        //     },
        
        //       {
          //         label:"Дабавить",
          //         submenu:[
            //           {role:"Приложение/папку", click(){
              //            create_add_new_app_window()
              //           }},
              //           {role:"Скрипт", click(){
                //            create_add_new_script_window()
                //           }},
  //            {role:"Заметку", click(){
    //            create_add_new_notes_window()
    //           }},
    //         ]
    //     }
    //     ] 
    // )
    
    // Menu.setApplicationMenu(menu)
    const menu = Menu.buildFromTemplate([
      {
        label: "Admin_app",
        submenu: [
          { role: "quit" },
          { type: "separator" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          {
            role: "help",
          click() {
            create_help_window();
          },
        },
        {label:"setings",
         click(){
    create_setings_window()
        },}
      ],
    },
    
    {
      label: "Добавить",
      submenu: [
        {
          label: "Приложение",
          click() {
            create_add_new_app_window();
          },
        },
        {
          label: "Папка",
          click() {
            add_new_folders_window()
          },
        },
        {
          label: "Скрипт",
          click() {
            create_add_new_script_window();
          },
        },
        {
          label: "Заметку",
          click() {
            create_add_new_notes_window();
          },
        },
      ],
    },
    
    
  ]);
  
  Menu.setApplicationMenu(menu);
  
}
let main_window= null
let add_new_notes_window = null
let script_window = null
let folders_window = null
let help_window = null
let new_app_window =null
let setings_window= null
let caregorys_amd_grub_window = null

const create_caregorys_amd_grub_window = () => {
  caregorys_amd_grub_window = new BrowserWindow({
    width: 800,
    //  alwaysOnTop: true, // Это свойство делает окно всегда поверх других
    height: 600,
    webPreferences: {
      nodeIntegration: false, // **Остается отключенным!**
      contextIsolation: true,   // **Убедитесь, что это true**
      roundedCorners: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")
      
    }
  })
  
  caregorys_amd_grub_window.loadFile("frontend/html/grubs_and_category.html")
  Menu.setApplicationMenu(null);
  
  
}

const create_help_window = () => {
  help_window= new BrowserWindow({
    width: 800,
    height: 600
  })
help_window.loadFile("frontend/html/help_page.html")
}
const create_main_window = () => {

  main_window = new BrowserWindow({
    width: 800,
     
    //  alwaysOnTop: true, // Это свойство делает окно всегда поверх других
    height: 600,
    webPreferences: {
      nodeIntegration: false, // **Остается отключенным!**
      contextIsolation: true,   // **Убедитесь, что это true**
      roundedCorners: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")
      
    }
  })
  
  main_window.loadFile("frontend/html/index.html")
  Menu.setApplicationMenu(null);
  
  
}



const create_setings_window = () => {
  setings_window= new BrowserWindow({
    width: 400,
    height: 300,
     webPreferences: {
      nodeIntegration: false, // **Остается отключенным!**
      contextIsolation: true,   // **Убедитесь, что это true**
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
setings_window.loadFile("frontend/html/setings_page.html")
}
const create_panel_folders = () => {
  const win = new BrowserWindow({
    width: 800,

    height: 100,
    frame: false,
    alwaysOnTop: true, // Окно всегда поверх других
    resizable: false, // Сделать панель нерезаемой
    // movable: false, // Запретить перемещение окна
    fullscreenable: false, // Запретить переход в полноэкранный режим
    roundedCorners: true,

    webPreferences: {
      nodeIntegration: false, // **Остается отключенным!**
      contextIsolation: true,   // **Убедитесь, что это true**
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
  
  win.loadFile("frontend/html/folder_panel.html")
  win.setPosition(0, 0)

}
const create_add_new_app_window = () => {
  new_app_window  =new BrowserWindow({
    width: 330,
    height: 300,
    webPreferences: {
    nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
  new_app_window.loadFile("frontend/html/add_new_app.html")
  //  Menu.setApplicationMenu(null);
}

const create_taimer_window = () => {
  const win = new BrowserWindow({
    width: 330,
    height: 300,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
  win.loadFile("frontend/html/taimer.html")

}
const create_add_new_script_window = () => {
script_window  = new BrowserWindow({
    width: 330,
    height: 300,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
  script_window.loadFile("frontend/html/add_new_script.html")
  
}
const add_new_folders_window= () => {
folders_window = new BrowserWindow({
  width: 330,
  height: 300,
  webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })
  folders_window.loadFile("frontend/html/add_new_folders.html")
  
}

const create_add_new_notes_window = () => {
  add_new_notes_window = new BrowserWindow({
    width: 700,
    height: 500,
     alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/js/electron/preload.js")

    }
  })

  add_new_notes_window.loadFile("frontend/html/add_new_notes.html")
  
  add_new_notes_window.on('closed', () => {
    add_new_notes_window = null; // Сбрасываем ссылку, когда окно закрыто
    
  });
}

ipcMain.handle('open-add-new-app-window', () => { create_add_new_app_window() });
ipcMain.handle('open-add-new-script-window', () => { create_add_new_script_window() });
ipcMain.handle('open-taimer-window', () => { create_taimer_window() });
ipcMain.handle('open-add-new-notes-window', () => { create_add_new_notes_window() });
// Вызываем асинхронную функцию

ipcMain.on('open-update-note-window', (event, noteData) => {
  if (!add_new_notes_window) {
    create_add_new_notes_window()
  } else {
    add_new_notes_window.focus(); // Если окно уже открыто, просто показываем его
  }

  // Send the note data to the add note window
  add_new_notes_window.webContents.send('note-data', noteData);
});
ipcMain.on('open-update-folder-window', (event, folderData) => {
  if (folders_window===null) {
    add_new_folders_window()
    folders_window.webContents.send('folder-data', folderData);
    folders_window.focus()
  } 
  else {
  folders_window= null

  }



});
ipcMain.on('open-update-app-window', (event, AppData) => {
  if (new_app_window===null) {
     create_add_new_app_window()
    new_app_window.webContents.send('app-data', AppData);
    new_app_window.focus()
  } 
  else {
  new_app_window= null

  }



});


ipcMain.handle('reloadApp', async (event) => {  main_window.reload()});
ipcMain.handle('setTelegramBotToken', async(event, token)=>{
    const file = await read_json_data(data_file_path); 
    file.token = String(token)
   await write_json_data(data_file_path, file)
   console.log("ses")

})

// хендлеры папок

start_hendelers_folder_function()

// хендлеры app

start_hendelers_app_function()

 // хендлеры получение клавиш
start_hendelers_getHotkey_function()

// хендлеры скриптов
start_hendelers_script_function()


// хендлер заметок 
start_hendelers_notes_function()




ipcMain.handle('clearAllDataToDataBase', async (event) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {

        type: "clearAllDataToDataBase"
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




ipcMain.handle('getAllCategories', async (event,) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getAllCategories"

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
ipcMain.handle('getCategoryById', async (event,category_id) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getCategoryById",
        category_id:category_id

      }
    });

    openFolderWorker.on("message", (result) => {
      console.log(`getCategoryById ${result}`);
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
ipcMain.handle('deleteCategoryByID', async (event,category_id) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "deleteCategoryByID",
        category_id:category_id

      }
    });

    openFolderWorker.on("message", (result) => {
      console.log(`getCategoryById ${result}`);
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
ipcMain.handle('add_category', async (event, category_name) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {

        category_name: category_name,
        type: "add_category"

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




  


ipcMain.handle('getAllAppsGrub', async (event,) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getAllAppsGrub"

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
ipcMain.handle('addApps_grub', async (event, app_grub_name) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {

        app_grub_name: app_grub_name,
        type: "addApps_grub"

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

ipcMain.handle('getFolderGrybById', async (event,folder_grub_id) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getFolderGrybById",
        folder_grub_id:folder_grub_id

      }
    });

    openFolderWorker.on("message", (result) => {
      console.log(`getCategoryById ${result}`);
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

ipcMain.handle('getAllFoldersGrub', async (event,) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getAllFoldersGrub"

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
ipcMain.handle('addFolder_grub', async (event, folder_grub_name) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {

        folder_grub_name: folder_grub_name,
        type: "addFolder_grub"

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


ipcMain.handle('getAllScritsGrub', async (event,) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {
        type: "getAllScritsGrub"

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
ipcMain.handle('addScrits_grub', async (event, scripts_grub_name) => {
  return new Promise((resolve, reject) => {
    const Worker_path = path.join(__dirname, "backend/main.js",)
    const openFolderWorker = new Worker(Worker_path, {
      workerData: {

        scripts_grub_name: scripts_grub_name,
        type: "addScrits_grub"

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
// let interval_getTaime
// let taimerInstens 
// ipcMain.handle('start_taimer', async (event,hurus, minuts,audio ) => {
//   const result = taimerInstens=new Taimer(hurus, minuts,audio)
//   return result; // Возвращаем результат в render-процесс
// });
// ipcMain.handle('taimer_getTaime', async (event,) => {

//   interval_getTaime= setInterval(() => {
//     let value_taime = taimerInstens.getTaime()


//     return value_taime; // Возвращаем результат в render-процесс
//   }, 1000);

// });


// ipcMain.handle('stop_taimer', async (event,  ) => {
//   const value= taimerInstens.stopTaimer()
//    console.log(value)
//    taimerInstens.stopAudio()
//    clearInterval(taimerInstens)
//    clearInterval(interval_getTaime)
//    interval_getTaime = null
//     taimerInstens = null
//   // return result; // Возвращаем результат в render-процесс
// });


ipcMain.handle('read_json_data', async (event, file_path) => {
  const result = await vork_data.read_json_data(file_path)
  return result; // Возвращаем результат в render-процесс
});
ipcMain.handle('write_json_data', async (event, file_path, data) => {
  const result = await vork_data.write_json_data(file_path, data)
  return result; // Возвращаем результат в render-процесс
});
ipcMain.handle('get_data_file_path', () => {
  const result = vork_data.data_file_path
  return result; // Возвращаем результат в render-процесс
});

// ipcMain.handle('start_taimer', async (event,hurus, minuts, stop_btn, display_hurus, minut_display, secend_display ) => {
//   try {
//       const result = await  taimer(hurus, minuts, stop_btn, display_hurus, minut_display, secend_display)
//       console.log("start_taimer")
//       return result;
//   } catch (error) {
  //       console.error("Ошибка при вызове start_taimer", error);
  //       return { success: false, message: error.message };
  //   }
  // });

function runNotification( title, message, tamaut){
  
  setTimeout(() => {  // Задержка для демонстрации
    notifier.notify(
      {
        title: title,
        message: message,
        icon: path.join(__dirname, 'Admin_app-icon.ico'), // Путь к иконке (необязательно)
        sound: true, // Воспроизвести звук (необязательно)
        wait: false // Дождитесь, пока пользователь кликнет на уведомление
      },
      function (err, response, metadata) {
        // response: "activate", "dismissed", "timeout"
        // metadata:  Дополнительная информация, если она необходима.
        console.log(err, response, metadata);
      }
    );

    notifier.on('click', function (notifierObject, options, event) {
      // Срабатывает, когда пользователь кликает на уведомление
      console.log("Вы кликнули на уведомление!");
      // Здесь можно выполнить какие-либо действия, например, открыть окно приложения
      main_window.focus(); // Фокусировка на окно приложения
    });

    notifier.on('timeout', function (notifierObject, options) {
      // Срабатывает, когда уведомление исчезает по таймеру
      console.log("Уведомление истекло!");
    });
  }, tamaut); // Отправка уведомления через 5 секунд
}
function setAlwaysOnTopWindow(window,){
  if(window!=null){
  if(window.isFocused()||window.isAlwaysOnTop()){
  
   
     if (window.isAlwaysOnTop()) { // Use isAlwaysOnTop() for accurate check
        window.setAlwaysOnTop(false);
           runNotification("Admin_app", ' Окно окрелдено ', 100)
        console.log("Always on top: false"); // Add logging for debugging
      } else {
        window.setAlwaysOnTop(true);
        runNotification("Admin_app", ' Окно закреплено певерх всех окон', 100)
        console.log("Always on top: true"); // Add logging for debugging
      }

   }
  }
}



app.on("ready", async() => {
await cretedDir()
  register_shortcut.get_app_hotkey()
  register_shortcut.get_folder_hotkey()
  register_shortcut.get_script_hotkey()
  // create_caregorys_amd_grub_window() 


  globalShortcut.register('alt+q', () => {
    main_window.isVisible() ? main_window.hide() : main_window.show()
  })
   globalShortcut.register('alt+e', () => {
    console.log('test alt +e ')
    // console.log(add_new_notes_window.isDestroyed() )
    setAlwaysOnTopWindow(main_window )
       setAlwaysOnTopWindow(add_new_notes_window )  
        setAlwaysOnTopWindow(script_window  )
           setAlwaysOnTopWindow(folders_window  )

              setAlwaysOnTopWindow(help_window  )   
              setAlwaysOnTopWindow(new_app_window   )
              setAlwaysOnTopWindow(setings_window  )

    }
   )
   //alwaysOnTop: true,
  bot.start_bot()
  get_scripts()
  create_main_window()
  createMwnu()

  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Паказать окно', type: 'normal', click: () => { main_window.isVisible() ? main_window.hide() : main_window.show() } },
    { role: "quit" }
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (main_window.isVisible()) {
      main_window.hide()
    } else {
      main_window.show()
    }
  })
  // create_panel_folders()

})
app.on("window-all-closed", () => {
  app.quit()
})
