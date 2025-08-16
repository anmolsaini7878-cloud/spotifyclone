// console.log("hello")
  let currentSong= new Audio()
let play=document.getElementById("play")
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


// walllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll


 async function getsongs(folder) {
    
  currFolder=folder;
     let a= await fetch(`http://127.0.0.1:3000/${folder}/`)
     let response= await a.text()
console.log (response)
let div=document.createElement("div")
    div.innerHTML=response
   let as= div.getElementsByTagName("a")
   songs=[]
   
for (const e of as) {
    if(e.href.endsWith(".mp3")){

        songs.push(e.href.split(`/${folder}/`)[1])
    }
    
}







  //   show all the songs in library
     let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
     songul.innerHTML=""
for (const song of songs) {
  
  songul.innerHTML=songul.innerHTML+`<li>
<img class="invert fit " src="music.svg" alt="">
<div class="info">
<div>${song.replaceAll("%20"," ")}</div>
<div>Talwinder</div>

    <!-- song info div -->
</div>

<div class="playnow">
    <span>play now</span>
<img class="invert"  src="play.svg" alt="">
</div>
</li>
  `
  

}

// Attached an event listner eacg song

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

e.addEventListener("click",()=>{

  // console.log(e.querySelector(".info").firstElementChild.innerHTML)
  playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
  
})

})
return songs;

 }
 

const playMusic=(track, pause=false)=>{

// let audio= new Audio("/songs/"+track)
currentSong.src=`/${currFolder}/`+track
if(!pause){

  currentSong.play()
  play.src="pause.svg"
}

document.querySelector(".songinfo").innerHTML=decodeURI(track)
document.querySelector(".songtime").innerHTML="00:00/00:00"

}



async function displayAlbums() {
  let a= await fetch(`http://127.0.0.1:3000/songs/`)
     let response= await a.text()

let div=document.createElement("div")
    div.innerHTML=response
 let anchors=div.getElementsByTagName("a")
 let cardContainer=document.querySelector(".cardContainer")
  
let array=Array.from(anchors)

for (let index = 0; index < array.length; index++) {
  const e= array[index];
  

  



  if(e.href.includes("/songs")){
let folder=e.href.split("/").slice(-2)[0]
// get the meta data of the folder
let a= await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
     let response= await a.json()
     cardContainer.innerHTML=cardContainer.innerHTML +`<div data-folder="${folder}" class="card ">
    <div  class="play">
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="#1ED760"/>
  <polygon points="26,20 46,32 26,44" fill="#000000" fill-opacity="0.9"/>
</svg>


    </div>
<!-- img -->
    <img src="/songs/${folder}/cover.jpg" alt="">
    <h2>${response.title}</h2>
    <p>${response.description}</p>
<!-- card div -->
</div>
    `
  }



}

 Array.from( document.getElementsByClassName("card")).forEach(e=>{

e.addEventListener("click", async(item)=>{
   songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
   playMusic(songs[0])


})


})

}


  async function main() {

   
    // get list of songs
        await getsongs("songs/ncs")
      playMusic(songs[0],true)

// display all the albums on the page
displayAlbums()



      
// attach an event listner to play and previous

play.addEventListener("click",()=>{
if(currentSong.paused){

  currentSong.play()
  play.src="pause.svg"
}
else{
  currentSong.pause()
  play.src="play.svg"
}



})

// / listen for timeupadte event

currentSong.addEventListener("timeupdate",()=>{
  


document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)* 100+"%";

})

    // add an event listner to seek bar

 document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

// add event listner hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{

  document.querySelector(".left").style.left="0"
  
})

 // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
        
    })

// add in previuos
previous.addEventListener("click",()=>{

   let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
if((index-1)>=0){

  playMusic(songs[index-1])
}
})

// next 
next.addEventListener("click",()=>{

   let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
   console.log(index)
if((index+1)<songs.length){

  playMusic(songs[index+1])
}
})


// add an event listner volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{

currentSong.volume=parseInt(e.target.value)/100

})

// add event to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })






  



 }


main()