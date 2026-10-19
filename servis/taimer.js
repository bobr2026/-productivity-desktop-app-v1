class  Taimer {
    constructor(hurus, minuts,audio){
     this.secend_value = 0
       this.minut_value = 0
      this.hurus_value = 0
       this._secend=60
     this.minut =0
     this.play_audio= true
      
      this.audio= audio
     this.hurus= hurus
     this.minuts= minuts
 
     
     
     
     this.result_value_secned = 0
     this.result_value_minut = 0
     this.result_value_hurus =0
 
 }
 playAudio(){setInterval(()=>{
 
this.audio.play()
 if(this.play_audio!=true){
     this.audio.pause()
 }
 }, 500)
 }
 stopAudio(){this.play_audio=false}
 startTaimer(){
     console.log("start taimer")
     this.taimer_interval= setInterval(() => {
          this.secend_value++
          this.result_value_secned = this._secend- this.secend_value
          this.result_value_minut = this.minuts -this.minut
          this.result_value_hurus = this.hurus- this.hurus_value
          if(this.result_value_hurus==0){this.hurus_value=0}
            if(this.result_value_minut==0){this.minut=0}
 
          console.log(this.secend_value)
          if(this.secend_value==60){
              this.minut_value++
              this.minut++
              console.log(`минуты: ${this.minut_value}`)
              this.secend_value=0
          }
          if(this.minut_value==60){
              this.hurus_value++
              this.minut_value=0
          }
          if (this.hurus == this.hurus_value && this.minuts == this.minut) {
              this.playAudio()
              clearInterval(this.taimer_interval),
              console.log("stop")
          }
          if(this.hurus==0&& this.minuts==this.minut_value){
             this.playAudio()
              console.log("stop")
              clearInterval(this.taimer_interval)
              
     
          }
          if (this.hurus == this.hurus_value && this.minuts == 0) { clearInterval(this.taimer_interval), console.log("stop1") }
      }, 1000);
 
    }
    
    stopTaimer(){
     // this.result_value_secned = this._secend- this.secend_value
     // this.result_value_minut = this.minuts-1 -this.minut
     // this.result_value_hurus = this.hurus- this.hurus_value
      let stop_value_taimer={
            "stop_value_hurus":this.result_value_hurus,
            "stop_value_minut":this.result_value_minut,
            "stop_value_secend":this.result_value_secned,
         }
         console.log('stop taimer')
         this.secend_value = 0
         this.minut_value = 0
        this.hurus_value = 0
 
        clearInterval(this.taimer_interval)
        return stop_value_taimer
    }
    getTaime(){
     // this.result_value_sened = this._secend- this.secend_value
     // this.result_value_minut = this.minuts -this.minut
     // this.result_value_hurus = this.hurus- this.hurus_value
     return {
         "value_hurus":this.result_value_hurus,
         "value_minut":this.result_value_minut,
         "value_secned":this.result_value_secned,
     }
    }
 
 }
 module.exports={Taimer}