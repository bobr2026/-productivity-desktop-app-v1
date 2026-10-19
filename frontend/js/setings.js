const token_input =document.getElementById("token_input")
 const set_token_button = document.getElementById("set_token_button")
set_token_button.addEventListener("click", async()=>{
    
await window.SetingsAPI.setTelegramBotToken(token_input.value)
})

