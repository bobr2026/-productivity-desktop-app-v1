
 const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")
 const{parentPort, workerData, Worker}= require("worker_threads")
 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

function addCategory(name){
    const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const addCategory = db.transaction((name) => {
      insertCategory.run(name);
    });
    addCategory(name)
    
}
function deleteCategoryByID(category_id){
    const deleteCategory = db.prepare('DELETE FROM categories WHERE id = ?');
    const deleted = deleteCategory.run(category_id).changes;
    return deleted

}
function getAllCategories(){
    const getAllCategories = db.prepare('SELECT id, name FROM categories');
    const categories = getAllCategories.all();
    return categories
    console.log(categories)

}
function getCategoryById(category_id) {
    const getCategoryById= db.prepare('SELECT name FROM  categories WHERE id =?')
    const category = getCategoryById.all(category_id)
    return category
}
// const getNotesByCategory = db.prepare(`
//   SELECT id, title, content FROM notes WHERE category_id = ?
// `);
// const personalNotes = getNotesByCategory.all(1); // Заметки из категории "Personal"
// console.log('Personal Notes:', personalNotes);

// const getNotesWithoutCategory = db.prepare(`
//   SELECT id, title, content FROM notes WHERE category_id IS NULL
// `);
// const uncategorizedNotes = getNotesWithoutCategory.all();
// console.log('Uncategorized Notes:', uncategorizedNotes);
module.exports={
    addCategory, deleteCategoryByID, getAllCategories, getCategoryById
}
