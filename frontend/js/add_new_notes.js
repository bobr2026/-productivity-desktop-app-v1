const menu_category= document.getElementById('menu_category')
const input_title_notes= document.getElementById('input_title_notes')
const textarea_content_notes= document.getElementById('textarea_content_notes')
let selectedValue = 1;
let update_Note
let note_id

   document.getElementById("btn_add_category").addEventListener('click', async()=>{
    const name_category = document.getElementById('input_title_category').value
            await window.DataBaseAPI.add_category(name_category)
    })

    document.getElementById("btn_add_notes").addEventListener('click', async()=>{
        const notes={
            "title": input_title_notes.value, 
            "category_id":selectedValue ||null, 
            "content":textarea_content_notes.value
         }
         if(update_Note){
             await window.WindowsAppAPI.reloadApp()
         await window.DataBaseAPI.update_Note(notes.title, notes.content, notes.category_id, note_id)
         } 
         else{
             
             await window.WindowsAppAPI.reloadApp()
             await window.DataBaseAPI.add_notes(notes.title, notes.content, notes.category_id)
         }
            // input_title_notes.textContent= notes.title
            // textarea_content_notes.textContent= notes.content
    })
async function display_category(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
    const categorys = await window.DataBaseAPI.getAllCategories()
    console.log(categorys)
    for (const categoryID in categorys ) {
        const category  =categorys[categoryID]
        console.log(category )
        categorys.forEach(category  => {
          const new_option_menu_category = document.createElement('option')
          new_option_menu_category.textContent=category.name
          new_option_menu_category.setAttribute('value', category.id)
          menu_category.appendChild(new_option_menu_category)
        
      }); 
   }
  

 }
 display_category()
   menu_category.addEventListener('change', function() {
       selectedValue = menu_category.value;
      console.log(` "Вы выбрали вариант с value: " + ${selectedValue}`) 
    });

     
     
    window.DataBaseAPI.receiveNoteData((noteData) => {
    console.log('Данные заметки получены:', noteData);
input_title_notes.value = noteData.title;
textarea_content_notes.value = noteData.content;
 note_id= noteData.id
update_Note= true
    })