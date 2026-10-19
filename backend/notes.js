
 const {filePath , data_file_path, read_json_data , write_json_data} = require("../servis/readORwrite_data")

 const path = require('path')
 const name_db= 'Admin_app.db'
 const path_database = path.join(filePath,name_db )
 console.log(path_database)
  const Database = require('better-sqlite3');
  let db = new Database(path_database);

function add_note(title, content, category_id){
    const insertNote = db.prepare('INSERT INTO notes (title, content, category_id) VALUES (?, ?, ?)');
     const addNote = db.transaction((title, content, category_id) => {
       insertNote.run(title, content, category_id);
       console.log("ok test ")
    })
    addNote(title,  content, category_id)
}
function getAllNotes(){
    const getAllNotes = db.prepare('SELECT id, title, content, category_id,   created_at, updated_at  FROM notes');
    const notes = getAllNotes.all();
  
  return notes
}

function updateNote(title, content, category_id, note_id){
    const updateNote = db.prepare('UPDATE notes SET title = ?, content = ?, category_id = ? WHERE id = ?');
    const changes = updateNote.run(title, content, category_id, note_id).changes;
    return changes
}
// console.log(`Updated ${changes} notes`); // Updated 1 notes
function deleteNote(note_id){
    const deleteNote = db.prepare('DELETE FROM notes WHERE id = ?');
     const deleted = deleteNote.run(note_id).changes;
     return deleted

}
function getNoteByTitle(title_note){
    
    const getNoteByTitle = db.prepare('SELECT id, title, content, category_id FROM notes WHERE title = ?');
    const note = getNoteByTitle.get(title_note);
    return note
}
module.exports={
    getAllNotes, getNoteByTitle, deleteNote, updateNote,add_note
}
// console.log(`Deleted ${deleted} notes`); // Deleted 1 notes