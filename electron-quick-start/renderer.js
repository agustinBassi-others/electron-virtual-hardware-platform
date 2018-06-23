
/*==================[inclusions]=============================================*/

/*==================[macros]=================================================*/

const COMMAND_INIT             = "{";
const COMMAND_END              = "}";
const COMMAND_SEPARATOR        = ";";

const BAUD_RATES_LIST          = [9600, 19200, 38400, 57600, 115200];
const NO_PORTS_RESPONSE        = "0" 
const SERVER_OK_RESPONSE       = "ok"

const STRING_EMPTY             = "";

const GPIO_STATE_HIGH          = '1';
const GPIO_STATE_LOW           = '0';
const GPIO_STATE_INVALID       = -1;

const ANALOG_MIN_VALUE         = 0;
const ANALOG_MAX_VALUE         = 1023;

const LCD_MULTI_LINE           = "0";
const LCD_FIRST_LINE           = "1";
const LCD_SECOND_LINE          = "2";
const LCD_THIRD_LINE           = "3";
const LCD_MULTI_LINE_LENGHT    = 55;
const LCD_LINE_LENGHT          = 55;
const LCD_LINE_2_PREAMBULE     = "<br>";
const LCD_LINE_3_PREAMBULE     = "<br><br>";

const APP_REFRESH_INTERVAL     = 200;

const IMG_SWITCH_ON            = "images/switch_on.svg"
const IMG_SWITCH_OFF           = "images/switch_off.svg"

const IMG_TEC_NO_PRESSED       = "images/button_no_pressed.svg"
const IMG_TEC_PRESSED          = "images/button_pressed.svg"

const IMG_LED_RED              = "images/led_red.svg"
const IMG_LED_GREEN            = "images/led_green.svg"
const IMG_LED_BLUE             = "images/led_blue.svg"
const IMG_LED_CYAN             = "images/led_cyan.svg"
const IMG_LED_VIOLET           = "images/led_violet.svg"
const IMG_LED_YELOW            = "images/led_yellow.svg"
const IMG_LED_WHITE            = "images/led_white.svg"
const IMG_LED_OFF              = "images/led_off.svg"

/*==================[typedef]================================================*/

const SerialCommand_t = {
	COMM_SERIAL_GPIO_READ        : 'a',
	COMM_SERIAL_GPIO_WRITE       : 'b',
	COMM_SERIAL_ADC_READ         : 'c',
	COMM_SERIAL_DAC_WRITE        : 'd',
	COMM_SERIAL_LCD_WRITE_BYTE   : 'e',
	COMM_SERIAL_LCD_WRITE_STRING : 'f',
	COMM_SERIAL_7SEG_WRITE       : 'g',
	COMM_SERIAL_MOTOR_RIGHT      : 'h',
	COMM_SERIAL_MOTOR_LEFT       : 'i',
}

const SerialCommandType_t = {
	TYPE_SERIAL_REQUEST          : '0',
	TYPE_SERIAL_RESPONSE         : '1',
}

const PeriphMap_t = {
	LEDR                         : 'a',
	LEDG                         : 'b',
	LED1                         : 'c',
	LED2                         : 'd',
	LED3                         : 'e',
  LED4                         : 'f',
	TEC1                         : 'g',
	TEC2                         : 'h',
	TEC3                         : 'i',
  TEC4                         : 'j',
  ADC_CH1                      : 'k',
  DAC_CH1                      : 'n',
	DISPLAY_LCD1                 : 'o',
	DISPLAY__7SEGS               : 'p'
}

const ServerCommand_t = {
	COMM_SERVER_LIST_PORTS       : 'list_ports',
  COMM_SERVER_CONNECT_PORT     : 'connect_port',
  COMM_SERVER_DISCONNECT_PORT  : 'disconnect_port',
}

const ServerCommandType_t = {
	TYPE_SERVER_REQUEST          : 'request',
	TYPE_SERVER_RESPONSE         : 'response',
}

/*==================[internal data declaration]==============================*/

let PortSelected               = "";
let BaudRateSelected           = 0;
let IsPortsAreListed           = false;

let PortConnectionState        = false;
let PortConnectionText         = "Estado: Iniciando..."
let Led1State                  = false;
let Led2State                  = false;
let Led3State                  = false;
let Led4State                  = false;
let Tec1State                  = true;
let Tec2State                  = true;
let Tec3State                  = true;
let Tec4State                  = true;
let Adc1Value                  = 512;
let Dac1Value                  = 512;
let Segment7Text               = "-";
let LcdText                    = " \\(-)/ Hello CIAA \\(-)/";

let SerialBuffer               = "";
let ServerBuffer               = "";

let DebugProcessedText         = "Debug processed text";
let DebugSendedText            = "Debug sended text";

/*==================[Objects events and initialization]=========================*/

Logic_InitializeApp();

/*/////////////////////////////////////////////////////////////////////////////
////////////////////// TODO LIST //////////////////////////////////////////////

- Sacarle los comentarios al package.json y ponerle los del proyecto.


/////////////////////////////////////////////////////////////////////////////*/

/*==================[internal function declaration]==========================*/

function Driver_Time_SleepMs(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



function Api_SetConnectionStateMessage (messageToWrite) {
  PortConnectionText = messageToWrite;
}

function Api_Server_SendCommand (serverCommand){
  let dataToSend = STRING_EMPTY;

  switch (serverCommand){
    
    case ServerCommand_t.COMM_SERVER_LIST_PORTS:
      dataToSend =
        COMMAND_INIT +
        ServerCommand_t.COMM_SERVER_LIST_PORTS + 
        COMMAND_SEPARATOR +
        ServerCommandType_t.TYPE_SERVER_REQUEST + 
        COMMAND_END;
    break;

    case ServerCommand_t.COMM_SERVER_CONNECT_PORT:
      dataToSend = 
        COMMAND_INIT +
        ServerCommand_t.COMM_SERVER_CONNECT_PORT + 
        COMMAND_SEPARATOR +
        ServerCommandType_t.TYPE_SERVER_REQUEST + 
        COMMAND_SEPARATOR +
        PortSelected + 
        COMMAND_SEPARATOR + 
        BaudRateSelected +
        COMMAND_END;
    break;

    case ServerCommand_t.COMM_SERVER_DISCONNECT_PORT:
      dataToSend = 
        COMMAND_INIT +
        ServerCommand_t.COMM_SERVER_DISCONNECT_PORT + 
        COMMAND_SEPARATOR +
        ServerCommandType_t.TYPE_SERVER_REQUEST + 
        COMMAND_END;
    break;

    default:
      console.log("El mensaje a enviar al servidor es invalido!");
  }
 
  if (dataToSend != STRING_EMPTY){
    Driver_Socket_SendData(dataToSend);
  }
}

function Api_Server_ParseResponse_ListPorts (response){
  let isPortsListReceived = false;

  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 21 
  ){
    
    response = response.substring(1, response.length-1);

    response = response.split(COMMAND_SEPARATOR);

    if (
      response[0] == ServerCommand_t.COMM_SERVER_LIST_PORTS && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){

      if (response[2] == NO_PORTS_RESPONSE){
        Api_SetConnectionStateMessage("Puertos disponibles: 0");
      } else {

        Api_SetConnectionStateMessage("Puertos disponibles: " + (response.length - 2) );

        for (var i = 2; i < response.length; i++){
          let portListObj = document.getElementById("PortsCont_AviablePortsList");
          let portOption = document.createElement("option");
          portOption.text = response[i];
          portListObj.add(portOption);
        }
        PortSelected = response[2];

        BAUD_RATES_LIST.forEach(element => {
          let baudRateListObj = document.getElementById("PortsCont_AviableBaudrateList");
          let baudRateOption = document.createElement("option");
          baudRateOption.text = element;
          baudRateListObj.add(baudRateOption);
        });
        BaudRateSelected = BAUD_RATES_LIST[0];

        isPortsListReceived = true;
      }
    }
    
  } else {
    Api_SetConnectionStateMessage("No se pueden listar los puertos!");
  }

  return isPortsListReceived;
}

function Api_Server_ParseResponse_Connect (response){
  let isConnected = false;

  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 26 
  ){
    response = response.substring(1, response.length-1);
    response = response.split(COMMAND_SEPARATOR);

    if (
      response[0] == ServerCommand_t.COMM_SERVER_CONNECT_PORT && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){

      if (response[2] == SERVER_OK_RESPONSE){
        Api_SetConnectionStateMessage("Conectado al sistema embebido");
        isConnected = true;
      } else {
        Api_SetConnectionStateMessage("No conectado. Error message: " + response[2]);
      }

    }
  } else {
    Api_SetConnectionStateMessage("No se recibio respuesta de conexion");
  }

  return isConnected;
}

function Api_Server_ParseResponse_Disconnect (response){
  let isDisconnected = false;

  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 26 
  ){
    response = response.substring(1, response.length-1);
    response = response.split(COMMAND_SEPARATOR);

    if (
      response[0] == ServerCommand_t.COMM_SERVER_DISCONNECT_PORT && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){

      if (response[2] == SERVER_OK_RESPONSE){
        Api_SetConnectionStateMessage("Desconectado del sistema embebido");
        isDisconnected = true;
      } else {
        Api_SetConnectionStateMessage("No desconectado. Error message: " + response[2]);
      }

    }
  } else {
    Api_SetConnectionStateMessage("No se recibio respuesta de desconexion");
  }

  return !isDisconnected;
}

function Api_Serial_ParseCommandArrived (commString){

  if (
    commString.charAt(0) == COMMAND_INIT && 
    commString.charAt(2) == COMMAND_SEPARATOR && 
    commString.charAt(4) == COMMAND_SEPARATOR && 
    commString.charAt(commString.length -1) == COMMAND_END
  ){
    let command = commString.charAt(1);
    let periphericalMap = commString.charAt(3);

    switch(command){

      case SerialCommand_t.COMM_SERIAL_GPIO_WRITE:
        DebugProcessedText = "COMMAND_GPIO_WRITE";
        
        let gpioState;

        if (commString.charAt(5) == GPIO_STATE_LOW){
          gpioState = false;
        } else if (commString.charAt(5) == GPIO_STATE_HIGH){
          gpioState = true;
        } else {
          gpioState = GPIO_STATE_INVALID;
          DebugProcessedText = "COMMAND_GPIO_WRITE - Invalid state received!";
        }

        if (gpioState != GPIO_STATE_INVALID){
          if (periphericalMap == PeriphMap_t.LED1){
            Led1State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED2){
            Led2State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED3){
            Led3State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED4){
            Led4State = gpioState;
          } else {
            DebugProcessedText = "COMMAND_GPIO_WRITE - Invalid peripherical received!";
          }
        }
        
        break;

      case SerialCommand_t.COMM_SERIAL_DAC_WRITE:
        DebugProcessedText = "COMMAND_DAC_WRITE";

        let dacStringValue = commString.slice(5, (commString.length - 1) );
        let dacIntValue = parseInt(dacStringValue);
        
        if (!isNaN(dacIntValue)){
          if (dacIntValue < ANALOG_MIN_VALUE){
            dacIntValue = ANALOG_MIN_VALUE;
          } else if (dacIntValue > ANALOG_MAX_VALUE){
            dacIntValue = ANALOG_MAX_VALUE;
          } 
          Dac1Value = dacIntValue;
        }

        break;

      case SerialCommand_t.COMM_SERIAL_LCD_WRITE_STRING:
        DebugProcessedText = "COMMAND_LCD_WRITE_STRING";
        
        let lcdLine = commString.charAt(5);
        let lcdStr = commString.slice(7, (commString.length - 1) );

        if (lcdLine == LCD_MULTI_LINE){
          if (lcdStr != STRING_EMPTY){
            if (lcdStr.length > LCD_MULTI_LINE_LENGHT){
              lcdStr = lcdStr.slice(0, LCD_MULTI_LINE_LENGHT);
            }
            LcdText = lcdStr;
          }
        } else if (lcdLine == LCD_FIRST_LINE || lcdLine == LCD_SECOND_LINE || lcdLine == LCD_THIRD_LINE){
          
          if (lcdStr != STRING_EMPTY){
            
            if (lcdStr.length > LCD_LINE_LENGHT){
              lcdStr = lcdStr.slice(0, LCD_LINE_LENGHT);
            }

            if (lcdLine == LCD_SECOND_LINE){
              LcdText = LCD_LINE_2_PREAMBULE + lcdStr;
            } else if (lcdLine == LCD_THIRD_LINE){
              LcdText = LCD_LINE_3_PREAMBULE + lcdStr;
            } else {
              LcdText = lcdStr;
            }
          }

        }
        
        break;

      case SerialCommand_t.COMM_SERIAL_7SEG_WRITE:
        DebugProcessedText = "COMMAND_7SEG_WRITE"; 

        if (periphericalMap == PeriphMap_t.DISPLAY__7SEGS){

          if ( (commString.charAt(5) != STRING_EMPTY) && (commString.charAt(5) != COMMAND_END) ){
            Segment7Text = commString.charAt(5);
          }

        }

        break;

      case SerialCommand_t.COMM_SERIAL_GPIO_READ:
        DebugProcessedText = "COMMAND_GPIO_READ";
        
        let commandType = commString.charAt(5);

        if (commandType == SerialCommandType_t.TYPE_SERIAL_REQUEST){

          let gpioReadState = GPIO_STATE_INVALID;

          if (periphericalMap == PeriphMap_t.LED1){
            gpioReadState = Led1State;
          } else if (periphericalMap == PeriphMap_t.LED2){
            gpioReadState = Led2State;
          } else if (periphericalMap == PeriphMap_t.LED3){
            gpioReadState = Led3State;
          } else if (periphericalMap == PeriphMap_t.LED4){
            gpioReadState = Led4State;
          } else if (periphericalMap == PeriphMap_t.TEC1){
            gpioReadState = Tec1State;
          } else if (periphericalMap == PeriphMap_t.TEC2){
            gpioReadState = Tec2State;
          } else if (periphericalMap == PeriphMap_t.TEC3){
            gpioReadState = Tec3State;
          } else if (periphericalMap == PeriphMap_t.TEC4){
            gpioReadState = Tec4State;
          }

          if (gpioReadState != GPIO_STATE_INVALID){
            
            if (!gpioReadState){
              gpioReadState = GPIO_STATE_LOW;
            } else {
              gpioReadState = GPIO_STATE_HIGH;
            }

            let commandResponse = 
              COMMAND_INIT +
              SerialCommand_t.COMM_SERIAL_GPIO_READ + 
              COMMAND_SEPARATOR +
              periphericalMap + 
              COMMAND_SEPARATOR +
              SerialCommandType_t.TYPE_SERIAL_RESPONSE + 
              COMMAND_SEPARATOR +
              gpioReadState +
              COMMAND_END;
            
            DebugSendedText = commandResponse;
          }

        }

        break;

      case SerialCommand_t.COMM_SERIAL_ADC_READ:
        DebugProcessedText = "COMMAND_ADC_READ"; 

        if (periphericalMap == PeriphMap_t.ADC_CH1){
          
          let commandResponse = 
            COMMAND_INIT +
            SerialCommand_t.COMM_SERIAL_ADC_READ + 
            COMMAND_SEPARATOR +
            periphericalMap + 
            COMMAND_SEPARATOR +
            ("000" + Adc1Value).slice(-4) +
            COMMAND_END;

            DebugSendedText = commandResponse;
        }

        break;

      default:
        DebugProcessedText = "Invalid command";
    }

  } else {
    DebugProcessedText = "Invalid command string";
  }
}

function Logic_TryToListPorts (){
  if (!IsPortsAreListed){
    console.log("Tratando de listar los puertos");

    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_LIST_PORTS);// Command_SendListPorts();
    let commandReceived = Driver_Socket_ReceiveData();
    IsPortsAreListed = Api_Server_ParseResponse_ListPorts(commandReceived);
  }
}

function Logic_TryToConnectPort (){
  if (IsPortsAreListed){
    console.log("Intentando conectar...");
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_CONNECT_PORT); // Command_SendConnectToPort();
    let commandReceived = Driver_Socket_ReceiveData();
    PortConnectionState = Api_Server_ParseResponse_Connect(commandReceived);
  } else {
    console.log("Para conectar primero se deben listar los puertos");
  }
}

function Logic_TryToDisconnectPort (){
  if (PortConnectionState){
    console.log("Intentando desconectar...");
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_DISCONNECT_PORT); //Command_SendDisconnectToPort();
    let commandReceived = Driver_Socket_ReceiveData();
    PortConnectionState = Api_Server_ParseResponse_Disconnect(commandReceived);
    if (!PortConnectionState){
      let portListObj = document.getElementById("PortsCont_AviablePortsList");//var select = document.getElementById("PortsCont_AviablePortsList");
      var length = portListObj.options.length;
      for (i = 0; i < length; i++) {
        portListObj.remove(0);
      }

      let baudRateListObj = document.getElementById("PortsCont_AviableBaudrateList");
      length = baudRateListObj.options.length;
      for (i = 0; i < length; i++) {
        baudRateListObj.remove(0);
      }

      IsPortsAreListed = false;
    }
  } else {
    console.log("Para desconectar primero debe estar conectado");
  }
}

function Logic_InitializeApp (){
  document.getElementById("PortsCont_AviablePortsList").addEventListener('click', (e) => {
    console.log("[Event] - PortsCont_AviablePortsList - Eligieron puerto: " + e.target.value);
    PortSelected = e.target.value;
  })
  
  document.getElementById("PortsCont_AviableBaudrateList").addEventListener('click', (e) => {
    console.log("[Event] - PortsCont_AviableBaudrateList - Eligieron baudrate: " + e.target.value);
    BaudRateSelected = e.target.value;
  })
  
  document.getElementById("PortsCont_ImgPortSwitch").addEventListener('click', (e) => {

    if (!PortConnectionState){
      Logic_TryToConnectPort();
    } else {
      Logic_TryToDisconnectPort();
    }
  })
  
  document.querySelector(".PortsCont_LblPortState").innerHTML = PortConnectionText;
  
  document.getElementById("GpioCont_ImgTec1").addEventListener('mousedown', (e) => {
    Tec1State = false;
    console.log("[Event] - GpioCont_ImgTec1 - Tec 1 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec1").addEventListener('mouseup', (e) => {
    Tec1State = true;
    console.log("[Event] - GpioCont_ImgTec1 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec1").addEventListener('mouseout', (e) => {
    Tec1State = true;
    console.log("[Event] - GpioCont_ImgTec1 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec2").addEventListener('mousedown', (e) => {
    Tec2State = false;
    console.log("[Event] - GpioCont_ImgTec2 - Tec 1 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec2").addEventListener('mouseup', (e) => {
    Tec2State = true;
    console.log("[Event] - GpioCont_ImgTec2 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec2").addEventListener('mouseout', (e) => {
    Tec2State = true;
    console.log("[Event] - GpioCont_ImgTec2 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec3").addEventListener('mousedown', (e) => {
    Tec3State = false;
    console.log("[Event] - GpioCont_ImgTec3 - Tec 1 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec3").addEventListener('mouseup', (e) => {
    Tec3State = true;
    console.log("[Event] - GpioCont_ImgTec3 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec3").addEventListener('mouseout', (e) => {
    Tec3State = true;
    console.log("[Event] - GpioCont_ImgTec3 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec4").addEventListener('mousedown', (e) => {
    Tec4State = false;
    console.log("[Event] - GpioCont_ImgTec4 - Tec 1 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec4").addEventListener('mouseup', (e) => {
    Tec4State = true;
    console.log("[Event] - GpioCont_ImgTec4 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  document.getElementById("GpioCont_ImgTec4").addEventListener('mouseout', (e) => {
    Tec4State = true;
    console.log("[Event] - GpioCont_ImgTec4 - Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })
  
  var RangeAdc = document.getElementById("AnalogCont_RangeAdc");
  RangeAdc.oninput = function() {
    Adc1Value = this.value;
    console.log("[Event] - AnalogCont_RangeAdc - El valor del ADC es: " + Adc1Value);
  }
  
  document.getElementById("AnalogCont_RangeDac").disabled = true;
  document.getElementById("AnalogCont_RangeDac").value = Dac1Value;
  
  document.querySelector(".LcdCont_TextContainer p").innerHTML = LcdText;
  
  document.querySelector(".Segments7Cont_Display").innerHTML = Segment7Text;

  setInterval(Logic_UpdateAppState, APP_REFRESH_INTERVAL)

  setInterval(Logic_TryToListPorts, 1000)

  Driver_Socket_InitClient();
}

function Logic_UpdateAppState () {
  
  if (PortConnectionState){
    document.getElementById("PortsCont_ImgPortSwitch").src = IMG_SWITCH_ON;
  } else {
    document.getElementById("PortsCont_ImgPortSwitch").src = IMG_SWITCH_OFF;
  }

  document.querySelector(".PortsCont_LblPortState").innerHTML  = PortConnectionText;
  
  if (!Led1State){
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_RED;
  }

  if (!Led2State){
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_GREEN;
  }

  if (!Led3State){
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_BLUE;
  }

  if (!Led4State){
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_VIOLET;
  }

  document.getElementById("AnalogCont_RangeDac").value         = Dac1Value;

  document.querySelector(".LcdCont_TextContainer p").innerHTML = LcdText;
  
  document.querySelector(".Segments7Cont_Display").innerHTML   = Segment7Text;

  document.getElementById("DebugCont_ProccesedText").innerHTML = DebugProcessedText;

  document.getElementById("DebugCont_SendedText").innerHTML = DebugSendedText;

}

//===============[ Debug Container]===================================

document.getElementById("DebugCont_BtnSend").addEventListener('click', (e) => {
  SerialBuffer = document.getElementById("DebugCont_TxtBoxCommand").value;
  ServerBuffer = SerialBuffer;
  Api_Serial_ParseCommandArrived(SerialBuffer);
})



var net = require('net');
 
// Configuration parameters
var HOST = 'localhost';
var PORT = 1234;
 

// Create Server instance 
var server = net.createServer(onClientConnected);  
 
server.listen(PORT, HOST, function() {  
  console.log('server listening on %j', server.address());
});
 
function onClientConnected(sock) {  
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);
 
  sock.on('data', function(data) {
    console.log('%s Says: %s', remoteAddress, data);
    sock.write(data);
    //sock.write(' exit');
  });
  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};




// var net = require('net');

// const SERVER_HOST = 'localhost';
// const SERVER_PORT = 1234;
 
// var client = new net.Socket();
 
// function Driver_Socket_InitClient (){
//   console.log('Client connected ');//to: ' + SERVER_HOST + ':' + SERVER_PORT);
//   // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
//   Driver_Socket_SendData("Mensaje de bienvenida desde la UI")

// }
// client.connect(SERVER_PORT, SERVER_HOST, function() {
//   Driver_Socket_InitClient ();
// });

// client.on('data', function(data) {    
//   Driver_Socket_ReceiveData (data);
// });

// // Add a 'close' event handler for the client socket
// client.on('close', function() {
//     console.log('Client closed');
// });

// client.on('error', function(err) {
//     console.error(err);
// });


// Driver_Socket_InitClient(SERVER_PORT, SERVER_HOST);

// function Driver_Socket_InitClient (serverPort, serverHost){
//   TcpSocketclient.connect(serverPort, serverHost, function() {
//     console.log('Client connected to: ' + SERVER_HOST + ':' + SERVER_PORT);
//     // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
//     Driver_Socket_SendData("Enviando bienvenida desde Driver_Socket_SendData")
//   }); 
// }
 

 
// TcpSocketclient.on('data', (data) => Driver_Socket_ReceiveData(data) );
 
// // Add a 'close' event handler for the client socket
// TcpSocketclient.on('close', () => Driver_Socket_Close() );
 
// TcpSocketclient.on('error', function(err) {
//     console.error(err);
// });

function Driver_Socket_SendData (dataToSend){
  DebugSendedText = dataToSend;
}

function Driver_Socket_ReceiveData (data){
  // console.log('Client received: ' + data);
  // if (data.toString().endsWith('exit')) {
  //   // client.destroy();
  // }
  // return data;
}
 
// function Driver_Socket_Close (){
//   TcpSocketclient.destroy();
//   console.log('Client closed');
// }



// var net = require('net');
 
// var HOST = 'localhost';
// var PORT = 1234;
 
// var client = new net.Socket();
 
// client.connect(PORT, HOST, function() {
//     console.log('Client connected to: ' + HOST + ':' + PORT);
//     // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
//     client.write('Hello World!');
 
// });
 
// client.on('data', function(data) {    
//     console.log('Client received: ' + data);
//      if (data.toString().endsWith('exit')) {
//        client.destroy();
//     }
// });
 
// // Add a 'close' event handler for the client socket
// client.on('close', function() {
//     console.log('Client closed');
// });
 
// client.on('error', function(err) {
//     console.error(err);
// });

// const socket = Required_SocketIo.io('http://localhost');

// console.log(socket.id); // undefined

// socket.on('command', (msg) => {
//   Api_SetConnectionStateMessage("Command received: " + msg);
// });
// socket.on('new message', (msg) => {
//   Api_SetConnectionStateMessage("Message from server: " + msg);
// });
// socket.on('close', () => {
//   Api_SetConnectionStateMessage('Lost connection to device.');
// });

// socket.on('disconnect', () => {
//   socket.open();
// });

// var net = require('net');

// var client = new net.Socket();
// client.connect(1337, '127.0.0.1', function() {
// 	console.log('Connected');
// 	client.write('Hello, server! Love, Client.');
// });

// client.on('data', function(data) {
// 	console.log('Received: ' + data);
// 	client.destroy(); // kill client after server's response
// });

// client.on('close', function() {
// 	console.log('Connection closed');
// });
