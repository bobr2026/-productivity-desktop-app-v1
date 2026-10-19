
const checkbox = document.querySelector("#myCheckbox"); // По ID
const app_name_input =document.getElementById("app_name_input")
const app_path_input =document.getElementById("app_path_input")
const app_hotkey_input =document.getElementById("app_hotkey_input")
// const token_input =document.getElementById("token_input")
const button_ok = document.getElementById("button_ok")
// const set_token_button = document.getElementById("set_token_button")
  const menu_category= document.getElementById('menu_category')

let selectedValue = 1;
let update_app = false
let app_id
// set_token_button.addEventListener("click", ()=>{setToken()})
button_ok.addEventListener("click", async()=> {
    //  
//     checkbox.addEventListener("change", function(event) {
//         if (checkbox.checked) {
//        // Чекбокс отмечен
//        app_name_input.style.display="none"
//   } else {
// app_name_input.style.display="block"
// // Чекбокс не отмечен
       


  
        // Изменяем текст кнопки, если checkbox отмечен
         await window.WindowsAppAPI.reloadApp()
      // await create_new_app_object()
     
  
      let val_app_name_input = app_name_input.value
      let val_app_path_input = app_path_input.value
      let val_app_hotkey_input= app_hotkey_input.value
      const appData = {
          "title": val_app_name_input,
          "path": val_app_path_input,
          "hotkey": val_app_hotkey_input,
          "app_grub_id": selectedValue
          
      };
      // await window.DataBaseAPI.add_app(appData.title, appData.path, appData.hotkey, appData.app_grub_id)
          await window.WindowsAppAPI.reloadApp()
      
          if(update_app){
            await window.WindowsAppAPI.reloadApp()
        await window.DataBaseAPI.update_app(appData.title, appData.path, appData.hotkey, appData.app_grub_id, app_id)
        await window.electronAPI.get_app_hotkey()
        } 
        else{
            
            await window.WindowsAppAPI.reloadApp()
            await window.DataBaseAPI.add_app(appData.title, appData.path, appData.hotkey, appData.app_grub_id)
            await window.electronAPI.get_app_hotkey()
        }
})
// const create_new_app_object = async() => {
    
//     }

    async function display_category(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
    const AppsGrubs = await window.DataBaseAPI.getAllAppsGrub()
    console.log(AppsGrubs)
    if(AppsGrubs.length===0){
      selectedValue = null
    }
    for (const AppsGrubID in AppsGrubs ) {
        const  AppsGrub  =AppsGrubs[AppsGrubID ]

        console.log(AppsGrub )

         
         
               const new_option_menu_category = document.createElement('option')
               new_option_menu_category.textContent=AppsGrub.name
               new_option_menu_category.setAttribute('value', AppsGrub.id)
               menu_category.appendChild(new_option_menu_category)
               
        
          }
     
   }
  

 
 display_category()

 menu_category.addEventListener('change', function() {
       selectedValue = menu_category.value;
      console.log(` "Вы выбрали вариант с value: " + ${selectedValue}`) 
    });

    document.getElementById("btn_add_category").addEventListener('click', async()=>{
    const name_category = document.getElementById('input_title_category').value
            await window.DataBaseAPI.addApps_grub(name_category)
    })

    window.DataBaseAPI.receiveAppData((appData) => {
      console.log('Данные заметки получены:', appData);
  app_name_input.value = appData.title;
   app_path_input.value = appData.path;
   app_hotkey_input.value = appData.hotkey
   
   
   app_id = appData.id
  update_app= true

})