const checkbox = document.querySelector("#myCheckbox"); // По ID
const interpretator_script_input =document.getElementById("interpretator_script_input")
const name_script_input =document.getElementById("name_script_input")
const path_script_input =document.getElementById("path_script_input")
const script_hotkey_input =document.getElementById("script_hotkey_input")
const button_ok = document.getElementById("button_ok")
   const menu_category= document.getElementById('menu_category')
let selectedValue  =1
button_ok.addEventListener("click",  async function() {  create_new_scripts_object(),
     await window.WindowsAppAPI.reloadApp()
 });

// 4. Функция для создания объекта нового приложения
const create_new_scripts_object = async() => {
    let val_heckbox
    if (checkbox.checked) {
     val_heckbox ="true"
      
    } else {
    
      val_heckbox = "false"
  
    }
    let val_interpretator_script_input= interpretator_script_input.value
    let val_name_script_input = name_script_input.value
    let val_path_script_input= path_script_input.value
    let val_hotkey_input= script_hotkey_input.value
    const scriptData = {
        "start": val_heckbox, 
        "interpretator_script": val_interpretator_script_input,
        "name_script": val_name_script_input,
        "path_script": val_path_script_input,
        "hotkey": val_hotkey_input
    };
    console.log(scriptData)
     await window.DataBaseAPI.add_script(scriptData.name_script, scriptData.path_script, scriptData.hotkey, 
        scriptData.interpretator_script, scriptData.start , selectedValue)
        await window.electronAPI.get_script_hotkey()
     
    // if(appData.name_app==""||appData.path_app=="" ){
    // //    alert("Запони форму")
    //     return undefined
    // }
    // else{

    //     return appData;
    // }
}
async function display_category(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
    const scritsGrubs = await window.DataBaseAPI.getAllScritsGrub()
    console.log(scritsGrubs)
    if(scritsGrubs.length===0){
      selectedValue = null
    }
    for (const scritsGrubsbID in scritsGrubs ) {
        const  scritsGrub  =scritsGrubs[scritsGrubsbID ]

        console.log(scritsGrub)

         
         
               const new_option_menu_category = document.createElement('option')
               new_option_menu_category.textContent=scritsGrub.name
               new_option_menu_category.setAttribute('value', scritsGrub.id)
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
            await window.DataBaseAPI.addScrits_grub(name_category)
    })