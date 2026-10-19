const {startScript} =require("../../servis/openFolder")
const {getAllScripts} = require('../../backend/scripts')
const {read_json_data, getHomeDirPath, write_json_data, data_file_path} = require("../../servis/readORwrite_data")
 async function get_scripts(){

    const scripts =await getAllScripts()
    console.log(scripts)
 for (const scriptID in scripts) {
    let script = scripts[scriptID]
    if (script.start==="true"){
        
        
    startScript(script.interpritator, script.path)
    }
    
    
 }
 
}
module.exports={get_scripts}