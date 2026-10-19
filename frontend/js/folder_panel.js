
const grub_fplder_btn =document.querySelector(".grub_fplder_btn")
const vork_data = require("../../servis/readORwrite_data")
const {openFolder}=require("../../servis/openFolder")

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
      const file = await window.electronAPI.read_json_data(data_file_path)
      return file
  
    }
    catch(error){
  console.log(error)
    return null; // Или другое значение по умолчанию
    }
  }
  
  

async function displayFolders(){
  
    const data = await get_json_data();
    console.log(data)

    const folders = data.folders
    console.log(folders)
    if (folders) {
      for (const folderID in folders) {
        const folder = folders[folderID];
        
        const image = document.createElement("img");
        image.src = "../../folder_icons/icon-folder-black.png";  // Замените!
        image.alt = "Описание картинки";          // Не забудьте добавить alt!
        image.width = 40;
        image.height = 40;
        image.id = "buttonImage";
        
        
        
        image.addEventListener("click", () => {
          try {
            window.electronAPI.openFolder(folder["path_folder"]);
          } catch (startAppError) {
            console.error("Ошибка при запуске приложения:", startAppError);
          }
        });
        // const app_start_btn = document.createElement("button");
        // app_start_btn.classList.add("folder_btn");
        // // app_start_btn.textContent = folder["name_folder"];
        // app_start_btn.appendChild(image)
     
        // setTimeout(() => {
          //   image.src ="../../icon-folder-blue.png"
          //   setTimeout(() => {
            //     image.src = "../../icon-folder-black.png";  // Замените!
            
            //   },500);
          // },100);
          
        // image.addEventListener("mousemove", ()=>{
        //   name_folder_p_elem.classList.remove("modal_folder_name")
        //   name_folder_p_elem.classList.add("modal_folder_name_disp")
          
          
        // })
        image.addEventListener("mouseout", ()=>{
  
        //   name_folder_p_elem.classList.remove("modal_folder_name_disp")
        //   name_folder_p_elem.classList.add("modal_folder_name")
        })
        grub_fplder_btn.appendChild(image);
        // document.body.appendChild(name_folder_p_elem)
      }
    
   
  }
    }
    
  displayFolders()