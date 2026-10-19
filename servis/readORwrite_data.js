const data= {
     "flag": true,
     "token": "",
     "initDatabase":false,
     "apps": {
        
     
     },
     "folders":{
         
     }, 
     "scripts":{
        
         
    }
 }
 
const fs = require("fs") 
const path = require("path") 
let flag
const  read_json_data=(file_path)=>{
 const fileData = fs.readFileSync(file_path, 'utf8');
    let file = JSON.parse(fileData);
    return file
}

const write_json_data =(file_path, data)=>{
const jsonData=JSON.stringify(data, null, 4)
fs.writeFile(file_path , jsonData,"utf8",(err)=>{
if(err){
    console.log(err)
}
})
console.log("всё ок")
}
const getHomeDirPath=()=>{
    
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    
    const homeDir = os.homedir();
    return homeDir
}
const homeDir = getHomeDirPath()
const filePath = path.join(homeDir, 'Admin-app'); // путь к файлу
const data_file_path=path.join(filePath, "data.json")
console.log(data_file_path)
function create_folder_data(){
    console.log(333)
    if(fs.existsSync(data_file_path)){
       const data = read_json_data(data_file_path)
    flag = data.flag
    }
    if(!fs.existsSync(data_file_path)){

        fs.mkdir(filePath, (err)=>{
            if(err){
                console.log(err)
            }
        })
        const jsonString = JSON.stringify(data, null, 4);
        fs.writeFile(data_file_path, jsonString,  (err)=>{
           if(err){
               console.log(err)
           
           }
        })
        

    }
    if(flag!=true){
        const jsonString = JSON.stringify(data, null, 4);
         fs.writeFile(data_file_path, jsonString,  (err)=>{
            if(err){
                console.log(err)
            }
      })

    }
}

module.exports={
    read_json_data, write_json_data, getHomeDirPath, create_folder_data, data_file_path, filePath
}