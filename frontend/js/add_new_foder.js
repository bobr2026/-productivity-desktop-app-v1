 const folder_icons_grub = document.querySelector('.folder_icons_grub')
 const button_ok = document.getElementById('button_ok')
  const folder_path_input = document.getElementById('folder_path_input')
   const folder_hotkey_input = document.getElementById('folder_hotkey_input')
   const menu_category= document.getElementById('menu_category')
      const selected_folder_gryb = document.getElementById('selected_folder_gryb')
   const secected_icon_folser= document.getElementById('secected_icon_folser')
      const selected_icon_folder_img= document.getElementById('selected_icon-folder_img')
   

let select_icon=0;
let selectedValue = 1;
let folderUprete = false
let folder_id

// function add_new_folders(icon_path, folderColor, select_id){
//   const folderName= `icon_folder_${folderColor}`
//   const  folder= document.createElement('img')
//   folder.className = folderName
// //  icon_folder_black.src ='../../folder_icons/icon-folder-black.png'
// folder.src =icon_path
// folder.addEventListener('click', ()=>{
//   folder.style.width= 80+'px'
//      folder.style.height= 80+'px'
//     select_icon =select_id
//         console.log(select_icon)
//      .style.width= 50+'px'
//      icon_folder_dark.style.height= 50+'px'
//         icon_folder_blue .style.width= 50+'px'
//      icon_folder_blue .style.height= 50+'px'
 
//  })
// }

 const icon_folder_black = document.createElement('img')
 icon_folder_black.className = 'icon_folder'
 icon_folder_black.src ='../../folder_icons/icon-folder-black.png'
icon_folder_black.addEventListener('click', ()=>{
    icon_folder_black.style.width= 80+'px'
     icon_folder_black.style.height= 80+'px'
    select_icon =1
        console.log(select_icon)
     icon_folder_dark.style.width= 50+'px'
     icon_folder_dark.style.height= 50+'px'
        icon_folder_blue .style.width= 50+'px'
     icon_folder_blue .style.height= 50+'px'
 
 })

  const icon_folder_blue = document.createElement('img')
   icon_folder_blue.className = 'icon_folder'
 icon_folder_blue.src ='../../folder_icons/icon-folder-blue.png'
icon_folder_blue.addEventListener('click', ()=>{
    icon_folder_blue.style.width= 80+'px'
     icon_folder_blue.style.height= 80+'px'
    select_icon =2
        console.log(select_icon)
     icon_folder_dark.style.width= 50+'px'
     icon_folder_dark.style.height= 50+'px'
        icon_folder_black.style.width= 50+'px'
     icon_folder_black.style.height= 50+'px'
 
 })

  const icon_folder_dark = document.createElement('img')
   icon_folder_dark.className = 'icon_folder'
 icon_folder_dark.src ='../../folder_icons/ficon-folder-dark1.png'
 icon_folder_dark.addEventListener('click', ()=>{
    icon_folder_dark.style.width= 80+'px'
     icon_folder_dark.style.height= 80+'px'
    select_icon =3
    console.log(select_icon)
       icon_folder_black.style.width= 50+'px'
     icon_folder_black.style.height= 50+'px'
        icon_folder_blue.style.width= 50+'px'
     icon_folder_blue.style.height= 50+'px'

 
 })
folder_icons_grub.appendChild(icon_folder_black)
folder_icons_grub.appendChild(icon_folder_blue)
folder_icons_grub.appendChild(icon_folder_dark)
button_ok.addEventListener("click",  async()=> {
    console.log('click')
    if(folderUprete){
      
      const val_path = folder_path_input.value 
 const val_hotkey = folder_hotkey_input.value 
      await window.WindowsAppAPI.reloadApp()
    
           await window.DataBaseAPI.updateFolder(select_icon,val_path, val_hotkey, selectedValue,folder_id )
            window.electronAPI.get_folder_hotkey()
       
    }
    const val_path = folder_path_input.value 
 const val_hotkey = folder_hotkey_input.value 
      await window.WindowsAppAPI.reloadApp()
           await window.DataBaseAPI.add_folder(select_icon,val_path, val_hotkey, selectedValue)
           await window.electronAPI.get_folder_hotkey()
 });
async function display_category(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
    const foldersGrubs = await window.DataBaseAPI.getAllFoldersGrub()
    console.log(foldersGrubs)
    if(foldersGrubs.length===0){
      selectedValue = null
    }
    for (const foldersGrubID in foldersGrubs ) {
        const  foldersGrub  =foldersGrubs[foldersGrubID ]

        console.log(foldersGrub )

         
         
               const new_option_menu_category = document.createElement('option')
               new_option_menu_category.textContent=foldersGrub.name
               new_option_menu_category.setAttribute('value', foldersGrub.id)
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
            await window.DataBaseAPI.addFolder_grub(name_category)
    })

  window.DataBaseAPI.receiveFolderData(async(folderData) => {
    console.log('Данные папки получены:', folderData);
    folder_path_input.value = folderData.path
    folder_hotkey_input.value = folderData.hotkey
    folder_id = folderData.id
    // selected_icon_folder_img.src =
    console.log(folderData.folder_grub_id)
    if(folderData.folder_grub_id!=null){
      
      const folder_grub= await window.DataBaseAPI. getFolderGrybById(folderData.folder_grub_id)
    selected_folder_gryb.textContent= `Группа: ${folder_grub[0].name}`
  
  }
  else{
    selected_folder_gryb.textContent= `Выберите группу`
  }
  console.log(folderData.icon_id)
  switch (folderData.icon_id){
    case 1:  selected_icon_folder_img.src = '../../folder_icons/icon-folder-black.png'
    console.log('test')
    break
    case 2:  selected_icon_folder_img.src = '../../folder_icons/icon-folder-blue.png'
    break
    case 3:  selected_icon_folder_img.src = '../../folder_icons/ficon-folder-dark1.png'
    break
    
    
  }
  // secected_icon_folser.style.display='block'
  selected_icon_folder_img.style.width= 50+'px'
  selected_icon_folder_img.style.height= 50+'px'
  //  secected_icon_folser.appendChild(selected_icon_folder_img)
  if(select_icon!=0){
    switch(select_icon){
      case 1: selected_icon_folder_img.src = '../../folder_icons/icon-folder-black.png'
        break
          case 2:  selected_icon_folder_img.src = '../../folder_icons/icon-folder-blue.png'
     break
     case 3:  selected_icon_folder_img.src = '../../folder_icons/ficon-folder-dark1.png'
     break
    }
  }
      // console.log(folder_grub[0].name)
      folderUprete = true
      // input_title_notes.value = noteData.title;
      // textarea_content_notes.value = noteData.content;
      //  note_id= noteData.id
      // update_Note= true
    })