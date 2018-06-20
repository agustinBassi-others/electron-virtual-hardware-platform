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

const Command_t = {
	COMMAND_GPIO_READ         : 'a',
	COMMAND_GPIO_WRITE        : 'b',
	COMMAND_ADC_READ          : 'c',
	COMMAND_DAC_WRITE         : 'd',
	COMMAND_LCD_WRITE_BYTE    : 'e',
	COMMAND_LCD_WRITE_STRING  : 'f',
	COMMAND_7SEG_WRITE        : 'g',
	COMMAND_MOTOR_RIGHT       : 'h',
	COMMAND_MOTOR_LEFT        : 'i',
}

CommandType_t = {
	COMMAND_REQUEST  : '0',
	COMMAND_RESPONSE : '1',
}

PeriphMap_t = {
  // Valores corespondientes a las teclas bluetooth
	LEDR           : 'a',
	LEDG           : 'b',
	LED1           : 'c',
	LED2           : 'd',
	LED3           : 'e',
	LED4           : 'f',
	// Valores corespondientes a las teclas bluetooth
	TEC1           : 'g',
	TEC2           : 'h',
	TEC3           : 'i',
	TEC4           : 'j',
	// Valores coorespondientes a los pines ADC
	ADC_CH1        : 'k',
	// Valores coorespondientes a los pines DAC
	DAC_CH1        : 'n',
	// Valores coorespondientes al periferico LCD
	DISPLAY_LCD1   : 'o',
	// Valores coorespondientes al periferico 7 segmentos
	DISPLAY__7SEGS : 'p'
}

/*==================[internal data declaration]==============================*/

const STRING_EMPTY = "";

const GPIO_STATE_HIGH  = '1';
const GPIO_STATE_LOW  = '0';
const GPIO_STATE_INVALID  = -1;

const ANALOG_MIN_VALUE = 0;
const ANALOG_MAX_VALUE = 1023;

const LCD_MULTI_LINE = "0";
const LCD_FIRST_LINE = "1";
const LCD_SECOND_LINE = "2";
const LCD_THIRD_LINE = "3";
const LCD_MULTI_LINE_LENGHT = 55;
const LCD_LINE_LENGHT = 55;
const LCD_LINE_2_PREAMBULE = "<br>";
const LCD_LINE_3_PREAMBULE = "<br><br>";

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
let Adc1_Value            = 512;
let Dac1_Value            = 512;
let Display7Segs_Text     = "3";
let DisplayLcd_Text       = " \\(-)/ Hello CIAA \\(-)/ Temp 21° - Hum 68% Adc Value: 872";

let SerialBuffer          = "a";
let DebugProcessed_Text   = "Debug processed text";
let DebugSended_Text      = "Debug sended text";

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

  document.getElementById("AnalogCont_RangeDac").value         = Dac1_Value;

  document.querySelector(".LcdCont_TextContainer p").innerHTML = DisplayLcd_Text;
  
  document.querySelector(".Segments7Cont_Display").innerHTML   = Display7Segs_Text;

  document.getElementById("DebugCont_ProccesedText").innerHTML = DebugProcessed_Text;
  document.getElementById("DebugCont_SendedText").innerHTML = DebugSended_Text;

}

function ParseSerialCommand (commString){

  if (commString.charAt(0) == '<' && commString.charAt(2) == ';' && commString.charAt(4) == ';' && commString.charAt(commString.length -1) == '>'){
    let command = commString.charAt(1);
    let periphericalMap = commString.charAt(3);

    switch(command){
      case Command_t.COMMAND_GPIO_WRITE:
        DebugProcessed_Text = "COMMAND_GPIO_WRITE";
        
        let gpioState;

        if (commString.charAt(5) == GPIO_STATE_LOW){
          gpioState = false;
        } else if (commString.charAt(5) == GPIO_STATE_HIGH){
          gpioState = true;
        } else {
          gpioState = GPIO_STATE_INVALID;
          DebugProcessed_Text = "COMMAND_GPIO_WRITE - Invalid state received!";
        }

        if (gpioState != GPIO_STATE_INVALID){
          if (periphericalMap == PeriphMap_t.LED1){
            Led1_State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED2){
            Led2_State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED3){
            Led3_State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED4){
            Led4_State = gpioState;
          } else {
            DebugProcessed_Text = "COMMAND_GPIO_WRITE - Invalid peripherical received!";
          }
        }
        
        break;
      case Command_t.COMMAND_DAC_WRITE:
        DebugProcessed_Text = "COMMAND_DAC_WRITE";

        let dacStringValue = commString.slice(5, (commString.length - 1) );
        let dacIntValue = parseInt(dacStringValue);
        
        if (!isNaN(dacIntValue)){
          if (dacIntValue < ANALOG_MIN_VALUE){
            dacIntValue = ANALOG_MIN_VALUE;
          } else if (dacIntValue > ANALOG_MAX_VALUE){
            dacIntValue = ANALOG_MAX_VALUE;
          } 
          Dac1_Value = dacIntValue;
        }

        break;
      case Command_t.COMMAND_LCD_WRITE_STRING:
        DebugProcessed_Text = "COMMAND_LCD_WRITE_STRING";
        
        let lcdLine = commString.charAt(5);
        let lcdStr = commString.slice(7, (commString.length - 1) );

        if (lcdLine == LCD_MULTI_LINE){
          if (lcdStr != STRING_EMPTY){
            if (lcdStr.length > LCD_MULTI_LINE_LENGHT){
              lcdStr = lcdStr.slice(0, LCD_MULTI_LINE_LENGHT);
            }
            DisplayLcd_Text = lcdStr;
          }
        } else if (lcdLine == LCD_FIRST_LINE || lcdLine == LCD_SECOND_LINE || lcdLine == LCD_THIRD_LINE){
          
          if (lcdStr != STRING_EMPTY){
            
            if (lcdStr.length > LCD_LINE_LENGHT){
              lcdStr = lcdStr.slice(0, LCD_LINE_LENGHT);
            }

            if (lcdLine == LCD_SECOND_LINE){
              DisplayLcd_Text = LCD_LINE_2_PREAMBULE + lcdStr;
            } else if (lcdLine == LCD_THIRD_LINE){
              DisplayLcd_Text = LCD_LINE_3_PREAMBULE + lcdStr;
            } else {
              DisplayLcd_Text = lcdStr;
            }
          }

        }
        
        break;
      case Command_t.COMMAND_7SEG_WRITE:
        DebugProcessed_Text = "COMMAND_7SEG_WRITE"; 

        if (periphericalMap == PeriphMap_t.DISPLAY__7SEGS){

          if ( (commString.charAt(5) != STRING_EMPTY) && (commString.charAt(5) != '>') ){
            Display7Segs_Text = commString.charAt(5);
          }

        }

        break;
      case Command_t.COMMAND_GPIO_READ:
        DebugProcessed_Text = "COMMAND_GPIO_READ";
        
        let commandType = commString.charAt(5);

        if (commandType == CommandType_t.COMMAND_REQUEST){

          let gpioReadState = GPIO_STATE_INVALID;

          if (periphericalMap == PeriphMap_t.LED1){
            gpioReadState = Led1_State;
          } else if (periphericalMap == PeriphMap_t.LED2){
            gpioReadState = Led2_State;
          } else if (periphericalMap == PeriphMap_t.LED3){
            gpioReadState = Led3_State;
          } else if (periphericalMap == PeriphMap_t.LED4){
            gpioReadState = Led4_State;
          } else if (periphericalMap == PeriphMap_t.TEC1){
            gpioReadState = Tec1_State;
          } else if (periphericalMap == PeriphMap_t.TEC2){
            gpioReadState = Tec2_State;
          } else if (periphericalMap == PeriphMap_t.TEC3){
            gpioReadState = Tec3_State;
          } else if (periphericalMap == PeriphMap_t.TEC4){
            gpioReadState = Tec4_State;
          }

          if (gpioReadState != GPIO_STATE_INVALID){
            
            if (!gpioReadState){
              gpioReadState = GPIO_STATE_LOW;
            } else {
              gpioReadState = GPIO_STATE_HIGH;
            }

            let commandResponse = 
              "{" +
              Command_t.COMMAND_GPIO_READ + 
              ";" +
              periphericalMap + 
              ";" +
              CommandType_t.COMMAND_RESPONSE + 
              ";" +
              gpioReadState +
              "}";
            
            DebugSended_Text = commandResponse;
          }

        }

        break;
      case Command_t.COMMAND_ADC_READ:
        DebugProcessed_Text = "COMMAND_ADC_READ"; 

        if (periphericalMap == PeriphMap_t.ADC_CH1){
          
          let commandResponse = 
            "{" +
            Command_t.COMMAND_ADC_READ + 
            ";" +
            periphericalMap + 
            ";" +
            ("000" + Adc1_Value).slice(-4) +
            "}";

            DebugSended_Text = commandResponse;
        }

        break;
      default:
        DebugProcessed_Text = "Invalid command";
    }

  } else {
    DebugProcessed_Text = "Invalid command string";
  }
}

//===============[ Debug Container]===================================

document.getElementById("DebugCont_BtnSend").addEventListener('click', (e) => {
  SerialBuffer = document.getElementById("DebugCont_TxtBoxCommand").value;
  ParseSerialCommand(SerialBuffer);
})



