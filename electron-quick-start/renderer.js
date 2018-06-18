// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// let led = document.getElementById("lbl_led1")

// led.classList.add("redText")

// setTimeout(() => {red
//     led.classList.remove("redText")
// }, 1000);

/*
document.getElementById("btn_tec1").addEventListener("click", e => {
  console.log(e.target.src);
})
document.getElementById("h1_title").classList.add("Class_Title")
document.getElementById("nav_bar").classList.add("Class_NavBar")
document.getElementById("nav_home").classList.add("Class_NavItem")
document.getElementById("nav_news").classList.add("Class_NavItem")
document.getElementById("nav_contact").classList.add("Class_NavItem")
document.getElementById("nav_about").classList.add("Class_NavItem")
//variables
let redLed = document.getElementById("img_led2")
let redLedIsOn = true
// events
redLed.addEventListener('click', (e) => {
  if (redLedIsOn){
    e.target.src = 'images/led_off.svg'
  } else{
    e.target.src = 'images/led_red.svg'
  }
  redLedIsOn = !redLedIsOn
})
*/

/*==================[inclusions]=============================================*/

/*==================[macros]=================================================*/

/*==================[typedef]================================================*/

PeriphericalMap = {
  // Valores corespondientes a las teclas bluetooth
	LEDR           : 'q',
	LEDG           : 'w',
	LEDB           : 'e',
	LED1           : 'r',
	LED2           : 't',
	LED3           : 'y',
	// Valores corespondientes a las teclas bluetooth
	TEC1           : '1',
	TEC2           : '2',
	TEC3           : '3',
	TEC4           : '4',
	// Valores coorespondientes a los pines ADC
	ADC_CH1        : 'z',
	// Valores coorespondientes a los pines DAC
	DAC_CH1        : 'v',
	// Valores coorespondientes al periferico LCD
	DISPLAY_LCD1   : 'o',
	// Valores coorespondientes al periferico 7 segmentos
	DISPLAY__7SEGS : 'p'
}

/*==================[internal data declaration]==============================*/

const IMG_SWITCH_ON       = "images/switch_on.svg"
const IMG_SWITCH_OFF      = "images/switch_off.svg"

const IMG_TEC_NO_PRESSED  = "images/button_no_pressed.svg"
const IMG_TEC_PRESSED     = "images/button_pressed.svg"

const IMG_LED_RED         = "images/led_red.svg"
const IMG_LED_GREEN       = "images/led_green.svg"
const IMG_LED_BLUE        = "images/led_blue.svg"
const IMG_LED_CYAN        = "images/led_cyan.svg"
const IMG_LED_VIOLET      = "images/led_violet.svg"
const IMG_LED_YELOW       = "images/led_yellow.svg"
const IMG_LED_WHITE       = "images/led_white.svg"

let PortSelected_Value= "COM1";
let PortSwitch_State  = false;
let Led1_State        = false;
let Led2_State        = false;
let Led3_State        = false;
let Led4_State        = false;
let Tec1_State        = true;
let Tec2_State        = true;
let Tec3_State        = true;
let Tec4_State        = true;
let Adc1_Value        = 0;
let Dac1_Value        = 0;
let Display7Segs_Text = "0";
let DisplayLcd_Text   = "Hello world!";

/*==================[Objects events declaration]============================*/

document.getElementById("PortsCont_AviablePortsList").addEventListener('click', (e) => {
  console.log("[Event] - PortsCont_AviablePortsList - Eligieron puerto: " + e.target.value);
  PortSelected_Value = e.target.value;
})

document.getElementById("PortsCont_ImgPortSwitch").addEventListener('click', (e) => {
  PortSwitch_State = !PortSwitch_State;
  console.log("[Event] - PortsCont_ImgPortSwitch - Puerto COM: " + PortSwitch_State);
  if (PortSwitch_State){
    e.target.src = IMG_SWITCH_ON
  } else {
    e.target.src = IMG_SWITCH_OFF
  }
})

document.getElementById("GpioCont_ImgTec1").addEventListener('mousedown', (e) => {
  Tec1_State = false;
  console.log("[Event] - GpioCont_ImgTec1 - Tec 1 pressed");
  e.target.src = IMG_TEC_PRESSED;
})

document.getElementById("GpioCont_ImgTec1").addEventListener('mouseup', (e) => {
  Tec1_State = true;
  console.log("[Event] - GpioCont_ImgTec1 - Tec 1 released");
  e.target.src = IMG_TEC_NO_PRESSED;
})

document.getElementById("GpioCont_ImgTec2").addEventListener('mousedown', (e) => {
  Tec2_State = false;
  console.log("[Event] - GpioCont_ImgTec2 - Tec 1 pressed");
  e.target.src = IMG_TEC_PRESSED;
})

document.getElementById("GpioCont_ImgTec2").addEventListener('mouseup', (e) => {
  Tec2_State = true;
  console.log("[Event] - GpioCont_ImgTec2 - Tec 1 released");
  e.target.src = IMG_TEC_NO_PRESSED;
})

document.getElementById("GpioCont_ImgTec3").addEventListener('mousedown', (e) => {
  Tec3_State = false;
  console.log("[Event] - GpioCont_ImgTec3 - Tec 1 pressed");
  e.target.src = IMG_TEC_PRESSED;
})

document.getElementById("GpioCont_ImgTec3").addEventListener('mouseup', (e) => {
  Tec3_State = true;
  console.log("[Event] - GpioCont_ImgTec3 - Tec 1 released");
  e.target.src = IMG_TEC_NO_PRESSED;
})

document.getElementById("GpioCont_ImgTec4").addEventListener('mousedown', (e) => {
  Tec4_State = false;
  console.log("[Event] - GpioCont_ImgTec4 - Tec 1 pressed");
  e.target.src = IMG_TEC_PRESSED;
})

document.getElementById("GpioCont_ImgTec4").addEventListener('mouseup', (e) => {
  Tec4_State = true;
  console.log("[Event] - GpioCont_ImgTec4 - Tec 1 released");
  e.target.src = IMG_TEC_NO_PRESSED;
})


/*==================[internal function declaration]==========================*/

function GetHardwareInputState (commandToParse){

}