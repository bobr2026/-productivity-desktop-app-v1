       const categoryNotes_list  = document.getElementById('categoryNotes_list')
      async function display_category(){
    //  await window.DataBaseAPI.add_notes("тест66", "blabla66767", null)
    
    const categorys = await window.DataBaseAPI.getAllCategories()
    console.log(categorys)
     categorys.map( category=>{
        const new_option_menu_category = document.createElement('li')
          new_option_menu_category.textContent=category.name
          new_option_menu_category.className ='Category_item'
          categoryNotes_list.appendChild(new_option_menu_category)

          new_option_menu_category.addEventListener('contextmenu', async()=>{
           let val_cofirm =confirm(` удалить катигорию : ${category.name} \n без возможности восстановления?`)
          if(val_cofirm){
            await window.DataBaseAPI.deleteCategoryByID(category.id)
          }
        
            
        
     })
      
        
        
        


 }
)}
 display_category()
      document.getElementById("btn_add_category_notes").addEventListener('click', async()=>{
    const name_categoryNotes = document.getElementById('input_title_category_notes').value
            await window.DataBaseAPI.add_category(name_categoryNotes)
    })

    
    
    // document.getElementById("btn_add_category").addEventListener('click', async()=>{
    // const name_appGrub = document.getElementById('input_title_category').value
    //         await window.DataBaseAPI.addApps_grub(name_appGrub)
    // })
