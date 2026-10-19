const { spawn } = require('child_process');
const { exec } = require('child_process');
// async function openFolder(folderPath) {
//     try {
//       const open = await import('open'); // Динамический импорт
//       await open.default(folderPath, { wait: false }); // open.default, так как import возвращает объект с default экспортом
//       console.log(`Открыта папка: ${folderPath}`);
//       return { success: true, message: `Открыта папка: ${folderPath}` }; // Возвращаем результат
//     } catch (err) {
//       console.error(`Ошибка открытия папки: ${err}`);
//       return { success: false, message: `Ошибка открытия папки: ${err.message}` }; // Возвращаем ошибку
//     }
//   }
async function openFolder(folderPath) {
   let command = '';

  switch (process.platform) {
    case 'win32': // Windows
      command = `explorer "${folderPath}"`;
      break;
    case 'darwin': // macOS
      command = `open "${folderPath}"`;
      break;
    case 'linux': // Linux
      command = `xdg-open "${folderPath}"`; // Попробуйте также 'gnome-open' или 'kde-open' в зависимости от вашей системы
      break;
    default:
      console.log('Unsupported platform!');
      return;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при открытии папки: ${error}`);
      return;
    }
    console.log(`Папка открыта: ${folderPath}`);
  });
}
  async function startApp(path_app){

    const app = spawn(path_app)
    app.on("error", (error) => {
        console.error("Ошибка при запуске приложения:", error);

      });
      app.on('exit', (code) => {
        console.log(`App exited with code ${code}`);
      
      });
}
async function startScript( interpretator , path_script){

  const script = spawn( interpretator, [path_script ])
  script.stdout.on("data", (data)=>{
    console.log(`run Script: ${data}`);
  })
  script.on("error", (error) => {
      console.error("Ошибка при запуске приложения:", error);

    });
    script.on('exit', (code) => {
      console.log(`App exited with code ${code}`);
    
    });
}

module.exports ={
    openFolder, startApp, startScript
}