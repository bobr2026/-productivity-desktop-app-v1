const { Telegraf } = require("telegraf")
const screenshot = require('screenshot-desktop')
const openFolder = require("./openFolder")
const vork_data = require("./readORwrite_data")

const { add_note, deleteNote, getAllNotes, updateNote, getNoteByTitle } = require("../backend/notes")
const {getAllFolders}= require('../backend/folders')
const{getAllApps}= require("../backend/apps")
const{getAllScripts}= require("../backend/scripts")

async function getDataFilePath() {
  try {
    const data_file_path = await vork_data.data_file_path;
    console.log("Путь к файлу данных в процессе отрисовки:", data_file_path);
    return data_file_path
  } catch (error) {
    console.error("Ошибка при получении пути к файлу данных:", error);
    return null
  }
}
async function get_json_data() {
  try {
    const data_file_path = await getDataFilePath(); // Дождитесь получения пути
    if (!data_file_path) {
      console.warn("Не удалось получить путь к файлу данных.");
      return null; // Или другое значение по умолчанию
    }
    const file = await vork_data.read_json_data(data_file_path);
    return file

  }
  catch (error) {
    console.log(error)
    return null; // Или другое значение по умолчанию
  }
}

async function get_bot_token() {
  const data = await get_json_data()
  const token = data.token
  console.log(token)
  return token
}

async function start_bot() {
  const token = await get_bot_token()
  
  console.log(token)
  const bot = new Telegraf(token)

  bot.command("scrin", (ctx, next) => {
    screenshot().then((img) => {
      // img is a Buffer representing the screenshot.
      // e.g., save to a file using fs:
      const fs = require('fs')
      fs.writeFile(vork_data.data_file_path + 'screenshot.png', img, (err) => {
        if (err) return console.error(err)
        console.log('Screenshot saved to screenshot.png')
        const ppto_path = vork_data.data_file_path + 'screenshot.png'
        console.log(ppto_path)
        ctx.sendPhoto({ source: ppto_path })
      })
    }).catch((err) => {
      console.error(err)
    })
  })
  bot.start((ctx, next) => {
    ctx.reply("Добро пожаловать ")
  })


  // Обработчик команды /list для просмотра всех заметок
  bot.command('help', (ctx) => {
    let message = `/list_folders -Все папки\n
  /list_apps - Все приложения\n
  /list_notes - Все заметки\n
  /scrin - скрин робочего стала\n
  /list_scripts - все скрипты \n


  start_[appID] - запуск приложения вместо [appID] укажите id приложения \n
  например start_app1\n

  open_[folderID] -открытие папки  вместо [folderID] укажите id папки \n
  например open_folder1 \n

  start_[scriptsID] - запуск скрипта вместо [scriptsID] укажите id скрипта \n
  например start_script1\n
  `
    ctx.reply(message)
  })
  bot.command('list_folders', async(ctx) => {
     const folders = await getAllFolders()
     if(folders.length ==0){
       ctx.reply('Нет не одной папки ');
     }
    let message = 'Ваши Папки:\n';
    folders.forEach(folder=>{
   message += `ID: ${folder.id}\n`;
      message += `Путь: ${folder.path}\n`
    })
    

    ctx.reply(message);
  });
  bot.command('list_apps',async (ctx) => {
    const apps =  await getAllApps()
      if(apps.length ==0){
       ctx.reply('Нет не одного приложения');
     }
    let message = 'Ваши Приложения:\n';
      apps.forEach(app=>{
   message += `ID: ${app.id}\n`;
      message += `Название: ${app.title}\n`;
      message += `Путь: ${app.path}\n`
    })
    
 

    ctx.reply(message);
  });




  bot.command('list_scripts', async(ctx) => {
        const scripts = await getAllScripts()

    if (scripts.length === 0) {
      return ctx.reply('Нет ни одного скрита.');
    }

       let message = 'Ваши Скрипты:\n';
    scripts.forEach(script => {
      message += `ID: ${script.id}\n`;
      message += `Название: ${script.title}\n`;
      message += `Путь: ${script.path}\n`;
        message += `интерпритатор: ${script.interpritator}\n`
    
      message += '---\n';
    });

    ctx.reply(message);
 

  });



  bot.command('list_notes', (ctx) => {
    const notes = getAllNotes();

    if (notes.length === 0) {
      return ctx.reply('Нет ни одной заметки.');
    }

    let message = 'Ваши заметки:\n';
    notes.forEach(note => {
      message += `ID: ${note.id}\n`;
      message += `Название: ${note.title}\n`;
      message += `Содержание: ${note.content}\n`;
      message += `Категория: ${note.category_id}\n`;
      message += `Создана: ${note.created_at}\n`;
      message += `Изменена: ${note.updated_at}\n`;
      message += '---\n';
    });

    ctx.reply(message);
  });



  bot.on("message", async(ctx) => {
     const apps =  await getAllApps()
        const folders = await getAllFolders()
        const scripts = await getAllScripts()
        
        
        scripts.forEach(script => {
          if (ctx.text.includes(`start_script${script.id}`)) {
            if (scripts.length === 0) {
         return ctx.reply('Нет ни одного скрита.');
       }
            openFolder.startScript(script.interpritator, script.path)
            ctx.reply("Стартуем")
          }
        })
        
        folders.forEach(folder=>{
          if (ctx.text.includes(`open_folder${folder.id}`)) {
         if(folders.length ==0){
           ctx.reply('Нет не одной папки ');
         }
        ctx.reply("Стартуем")
   openFolder.openFolder(folder.path)
       }
 
    })
    
    if (apps) {

     apps.forEach(app=>{
       if (ctx.text.includes(`start_app${app.id}`)) {
        ctx.reply("Стартуем")
   openFolder.startApp(app.path)
       }

     })
       
      }
      else{
        ctx.reply('Нет не одного приложения');
      }
    })
  
    // for (const folderID in folders) {
    //   const folder = folders[folderID];
    //   if (ctx.text.includes(`open_${folderID}`)) {
    //     openFolder.openFolder(folder["path_folder"])
    //   }
    // }
    // for (const scriptsID in scripts) {
    //   const script = scripts[scriptsID];
    //   if (ctx.text.includes(`start_${scriptsID}`)) {

    //     openFolder.startScript(script["interpretator_script"], script["path_script"])
    //   }
    // }
    //   if( ctx.text.includes("add_notes")){
    //     ctx.reply('Укажите название замкти')
    //      let title
    //      let    content
    //   if(ctx.text.includes("1)")){
    //      bot.on('message', (ctx)=>{
    //        title=  ctx.text

    //      })
    //   }
    //    if(ctx.text.includes("2)")){
    //     ctx.reply('Укажите содержание  замкти')
    //      bot.on('message', (ctx)=>{
    //        content=  ctx.text

    //      })
    //    content=  ctx.text
    //   }
    //  add_note(title, content, null)
    //   }



  
  bot.launch().then((res) => {
    console.log("start")

  }).catch((err) => {
    console.log(err)
  })
}
module.exports = {
  get_bot_token, start_bot
}

// const bot =