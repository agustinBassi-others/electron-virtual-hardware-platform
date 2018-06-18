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

const APP_REFRESH_INTERVAL = 200;

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
const IMG_LED_OFF         = "images/led_off.svg"

let PortSelected_Value    = "COM1";
let PortSwitch_State      = false;
let PortConnection_State   = "Estado: No se puede conectar. Revise el puerto seleccionado!"
let Led1_State            = false;
let Led2_State            = false;
let Led3_State            = false;
let Led4_State            = false;
let Tec1_State            = true;
let Tec2_State            = true;
let Tec3_State            = true;
let Tec4_State            = true;
let Adc1_Value            = 0;
let Dac1_Value            = 340;
let Display7Segs_Text     = "3";
let DisplayLcd_Text       = " \\(-)/ Hello CIAA \\(-)/ Temp 21° - Hum 68% Adc Value: 872";

/*==================[Objects events and initialization]=========================*/

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

document.querySelector(".PortsCont_LblPortState").innerHTML = PortConnection_State;

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

document.getElementById("GpioCont_ImgTec1").addEventListener('mouseout', (e) => {
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

document.getElementById("GpioCont_ImgTec2").addEventListener('mouseout', (e) => {
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

document.getElementById("GpioCont_ImgTec3").addEventListener('mouseout', (e) => {
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

document.getElementById("GpioCont_ImgTec4").addEventListener('mouseout', (e) => {
  Tec4_State = true;
  console.log("[Event] - GpioCont_ImgTec4 - Tec 1 released");
  e.target.src = IMG_TEC_NO_PRESSED;
})

var RangeAdc = document.getElementById("AnalogCont_RangeAdc");
RangeAdc.oninput = function() {
  Adc1_Value = this.value;
  console.log("[Event] - AnalogCont_RangeAdc - El valor del ADC es: " + Adc1_Value);
}

document.getElementById("AnalogCont_RangeDac").disabled = true;
document.getElementById("AnalogCont_RangeDac").value = Dac1_Value;


document.querySelector(".LcdCont_TextContainer p").innerHTML = DisplayLcd_Text;

document.querySelector(".Segments7Cont_Display").innerHTML = Display7Segs_Text;

// setInterval(function () {
//   Dac1_Value.value = Dac1_Value.value + 100
// }, 2000)


/*==================[internal function declaration]==========================*/

setInterval(UpdateAppState, APP_REFRESH_INTERVAL)

function UpdateAppState () {
  document.querySelector(".PortsCont_LblPortState").innerHTML  = PortConnection_State;
  document.getElementById("AnalogCont_RangeDac").value         = Dac1_Value;
  document.querySelector(".LcdCont_TextContainer p").innerHTML = DisplayLcd_Text;
  document.querySelector(".Segments7Cont_Display").innerHTML   = Display7Segs_Text;
  
  if (!Led1_State){
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_RED;
  }

  if (!Led2_State){
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_GREEN;
  }

  if (!Led3_State){
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_BLUE;
  }

  if (!Led4_State){
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_VIOLET;
  }

}




document.getElementById("sendCommand").addEventListener('click', (e) => {
 console.log(document.getElementById("commands").value);
 
})

