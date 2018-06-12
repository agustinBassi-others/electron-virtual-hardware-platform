// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// let led = document.getElementById("lbl_led1")

// led.classList.add("redText")

// setTimeout(() => {
//     led.classList.remove("redText")
// }, 1000);
document.getElementById("btn_tec1").addEventListener("click", e =>{
  console.log(e.target.src);
})

document.getElementById("h1_title").classList.add("Class_Title")

document.getElementById("nav_bar").classList.add("Class_NavBar")

document.getElementById("nav_home").classList.add("Class_NavItem")
document.getElementById("nav_news").classList.add("Class_NavItem")
document.getElementById("nav_contact").classList.add("Class_NavItem")
document.getElementById("nav_about").classList.add("Class_NavItem")
