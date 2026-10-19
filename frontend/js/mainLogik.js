
// await window.DataBaseAPI.deletefolder(4)
//      await window.DataBaseAPI.deletefolder(5)
//            await window.DataBaseAPI.deletefolder(6)
//                  await window.DataBaseAPI.deletefolder(7)

const grub_buutonStartApp = document.querySelector(".grub_appStartBtn")
const grub_fplder_btn =document.querySelector(".grub_fplder_btn")
const grub_ScriptStartBtn =document.querySelector(".grub_ScriptStartBtn")
const notes_block  =document.querySelector(".notes_block")

async function getDataFilePath() {
  try {
    const data_file_path = await window.electronAPI.get_data_file_path();
    console.log("Путь к файлу данных в процессе отрисовки:", data_file_path);
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
    const file = await window.electronAPI.read_json_data(data_file_path);
    return file
  
  }
  catch(error){
    console.log(error)
    return null; // Или другое значение по умолчанию
  }
  }
  
  
  async function displayApps(){
     const apps= await window.DataBaseAPI.getAllApps()
    console.log(apps)
  
      for (const appID in apps) {
        const app = apps[appID];
       console.log(app)
        const app_start_btn = document.createElement("button");
        app_start_btn.classList.add("app_start_btn");
        app_start_btn.textContent = app.title;
      
        app_start_btn.addEventListener("mousedown", async(event)=>{
          if(event.which==2){

            const appData = {
              id:app.id,
              title: app.title,
              path: app.path,
               hotkey: app.hotkey,
              app_grub_id: app.app_grub_id
          };
            await window.DataBaseAPI.openUpdateAppWindow(appData)
          }
          
        })

        app_start_btn.addEventListener("click", () => {
          try {
              window.electronAPI.startApp(app.path);
            } catch (startAppError) {
                console.error("Ошибка при запуске приложения:", startAppError);
              }
            });
            app_start_btn.addEventListener('contextmenu', async()=>{
           let val_cofirm =confirm(` удалить приложение: ${app.title}\n без возможности восстановления?`)
          if(val_cofirm){
            await window.WindowsAppAPI.reloadApp()
            await window.DataBaseAPI.deleteApp(app.id)
            
          }
          console.log(val_cofirm)
          
      })
            grub_buutonStartApp.appendChild(app_start_btn);
          }
          
          
        }
        
        
        displayApps()
  async function displayScripts(){
    
  
    
    const scripts = await window.DataBaseAPI.getAllScripts()
    if (scripts) {
      for (const scriptID in scripts) {
        const script = scripts[scriptID];
        const script_start_btn = document.createElement("button");
        script_start_btn.classList.add("script_start_btn");
        script_start_btn.textContent = script.title;
        script_start_btn.addEventListener("click", () => {
          try {
            window.electronAPI.startScript(script.interpritator, script.path);
          } catch (startAppError) {
            console.error("Ошибка при запуске приложения:", startAppError);
          }
        });
         script_start_btn.addEventListener('contextmenu', async()=>{
           let val_cofirm =confirm(` удалить папку: ${script.title}\n без возможности восстановления?`)
          if(val_cofirm){
            await window.WindowsAppAPI.reloadApp()
            await window.DataBaseAPI.deleteScript(script.id)
            
          }
          console.log(val_cofirm)
          
      })
        grub_ScriptStartBtn.appendChild(script_start_btn);
      }
      
      
    }
    
  }
  async function displayFolders(){
     

    // await window.DataBaseAPI.add_folder(1,"K:\\web dev curse","alt+f1", null)
    const folders= await window.DataBaseAPI.getAllFolders()
    folders
    for (const folderID in folders) {
      const folder =folders[folderID]
   

      const icon_folder = document.createElement("img");
      switch (folder.icon_id){
        case null:  icon_folder.src = '../../folder_icons/icon-folder-black.png'
        break
        case 1:  icon_folder.src = '../../folder_icons/icon-folder-black.png'
        break
         case 2:  icon_folder.src = '../../folder_icons/icon-folder-blue.png'
         break
         case 3:  icon_folder.src = '../../folder_icons/ficon-folder-dark1.png'
         break

      }
      icon_folder.alt = "Описание картинки";         
      icon_folder.width = 100;
      icon_folder.height = 100;
      icon_folder.id = "buttonImage";
      
      
      icon_folder.addEventListener("click", () => {
        try {
          window.electronAPI.openFolder(folder.path);
        } catch (startAppError) {
          console.error("Ошибка при запуске приложения:", startAppError);
        }
      });
      icon_folder.addEventListener('contextmenu', async()=>{
           let val_cofirm =confirm(` удалить папку: ${folder.path}\n без возможности восстановления?`)
          if(val_cofirm){
            await window.WindowsAppAPI.reloadApp()
            await window.DataBaseAPI.deleteFolder(folder.id)
            
          }
          console.log(val_cofirm)
          
      })
        icon_folder.addEventListener("mousedown", async(event)=>{
          if(event.which==2){
            const  folderData ={
              id:folder.id,
              icon_id:folder.icon_id, 
              path:folder.path, 
              hotkey:folder.hotkey,
              folder_grub_id: folder.folder_grub_id 
            }
            await window.DataBaseAPI.penUpdateFolderWindow(folderData)

          }
          
        })
      grub_fplder_btn.appendChild(icon_folder);
      
      
      // const app_start_btn = document.createElement("button");
      // app_start_btn.classList.add("folder_btn");
      // // app_start_btn.textContent = folder["name_folder"];
      // app_start_btn.appendChild(image)
      
      // setTimeout(() => {
        //   image.src ="../../icon-folder-blue.png"
        //   setTimeout(() => {
          //     image.src = "../../icon-folder-black.png";  
          
          //   },500);
          // },100);
          
          // image.addEventListener("mousemove", ()=>{
            //   name_folder_p_elem.classList.remove("modal_folder_name")
            //   name_folder_p_elem.classList.add("modal_folder_name_disp")
            //   name_folder_p_elem.textContent = folder["name_folder"]
            
            // })
            // image.addEventListener("mouseout", ()=>{
              
              //   name_folder_p_elem.classList.remove("modal_folder_name_disp")
              //   name_folder_p_elem.classList.add("modal_folder_name")
              // })
              // document.body.appendChild(name_folder_p_elem)
            }
            
  }
  
  
  displayFolders()
  
  displayScripts()
  async function display_notes(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
   
    
    
    
    
    const notes= await window.DataBaseAPI.getAllNotes()
    for (const noteID in notes) {
      const note =notes[noteID]
      if(note.length==0){
        const p_elem_not_notes = document.createElement('p')
        p_elem_not_notes.textContent='Добавьте записи '
        p_elem_not_notes.style.fontSize=40+'px'
        p_elem_not_notes.style.color='#fff'
        notes_block.appendChild(p_elem_not_notes)
      }
      
      note.forEach(async note => {
        console.log(note)
        const category= await window.DataBaseAPI.getCategoryById(note.category_id)
        // console.log(category[0].name)
      //  const category = getCategory(note.category_id)
    
        const note_elem_div= document.createElement('div')
        note_elem_div.className="note_element"
        const note_elem_title_div = document.createElement('div')
        const note_elem_content = document.createElement('p')
        note_elem_title_div.className='note_title_div'
        
        // created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        const note_elem_title = document.createElement('p')
        note_elem_title.className='note_title'
        const note_elem_data_updated_at = document.createElement('p')
        note_elem_data_updated_at.textContent= `Обновлён: ${note.updated_at}`
        note_elem_data_updated_at.className='note_data_updated'
        const  note_elem_data_created_at = document.createElement('p')
        note_elem_data_created_at.textContent= ` Создан: ${note.created_at}`
         note_elem_data_created_at.className='note_data_created'
        note_elem_title.textContent=note.title
          const note_elem_categoery= document.createElement('p')
          note_elem_categoery.textContent =` Катигория: ${category[0].name}`
          note_elem_categoery.className='note_category '
        // note_elem_content.className='note_content'
        // note_elem_content.textContent=note.content
        note_elem_div.addEventListener('dblclick', async()=>{
          const  noteData ={
            title:note.title, 
            content:note.content, 
            id:note.id,
            category_id:note.category_id
          }
          await window.DataBaseAPI.openUpdateNoteWindow(noteData)
          
        })
        let click = 0
        // note_elem_div.addEventListener('click', async()=>{
          
        //   if(click==0){
        //     note_elem_div.style.textOverflow='visible'
        //     note_elem_div.style.height=100+'vh'
        //     note_elem_div.style.maxHeight=550+'px'
        //     click=1
        //   }
        //   else{
        //     notes_block.style.width=100+'%'
        //     note_elem_div.style.textOverflow='hidden'
        //     note_elem_div.style.height=100+'vh'
        //     note_elem_div.style.maxHeight=200+'px'
            
        //     click=0
        //   }
          
          
        // })
        note_elem_div.addEventListener('contextmenu', async(event)=>{
          
          let val_cofirm =confirm(` удалить запись: ${note.title}\n без возможности восстановления?`)
          if(val_cofirm){
            await window.WindowsAppAPI.reloadApp()
            await window.DataBaseAPI.deleteNote(note.id)
            
          }
          console.log(val_cofirm)
          
          
          
        })
        note_elem_div.appendChild(note_elem_title)
       note_elem_div.appendChild(note_elem_data_updated_at)
        note_elem_div.appendChild(note_elem_data_created_at)
        note_elem_div.appendChild(note_elem_categoery)
        // note_elem_div.appendChild(note_elem_title_div)
        // note_elem_div.appendChild(note_elem_content)
        
        
        
        notes_block.appendChild(note_elem_div)
      }); 
    }
    
    
}
display_notes()

//  async function display_notes(){
//   const notes = await get_notes()
 
// }
// }
// display_notes()

// add_notes()
//   const data_file_path =getDataFilePath();
// async function get_json_data(){
//   try{
//     const file =await window.electronAPI.read_json_data(data_file_path)
//    return file

//   }
//   catch(error){
// console.log(error)
//   }
// }
// const data = get_json_data()
// console.log(data)