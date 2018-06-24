
/*==================[inclusions]=============================================*/

var IpcClient = require('node-ipc');

/*==================[macros]=================================================*/

const IPC_TOPIC_MESSAGE        = 'message'
const IPC_TOPIC_CONNECT        = 'connect'
const IPC_TOPIC_DISCONNECT     = 'disconnect'

const IPC_SOCKET_ID            = 'ipcSocketId'
const IPC_CONNECTION_RETRY     = 1500

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

const INTERVAL_REFRESH_APP     = 200;
const INTERVAL_CONNECT_SERVER  = 1000;
const INTERVAL_LIST_PORTS      = 1000;
const INTERVAL_PERIPH_COMMANDS = 200;

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
  COMM_SERVER_CLIENTUP         : 'client_up',
}

const ServerCommandType_t = {
	TYPE_SERVER_REQUEST          : 'request',
	TYPE_SERVER_RESPONSE         : 'response',
}

/*==================[internal data declaration]==============================*/

let PortSelected               = "";
let BaudRateSelected           = 0;

let FlagPortsListed            = false;
let FlagEmbeddedSysConnected   = false;
let FlagServerConnected        = false;
let FlagClientIsUp             = false;

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

let ServerBuffer               = "";

let DebugProcessedText         = "Debug processed text";
let DebugSendedText            = "Debug sended text";

/*==================[Objects events and initialization]=========================*/

Logic_InitializeApp();

/*==================[internal function declaration]==========================*/

function Driver_Ipc_ReadServerBuffer (){
  return ServerBuffer;
}

function Driver_Ipc_WriteServerBuffer (dataToWrite){
  ServerBuffer = dataToWrite;
}

function Driver_Ipc_SendData (topic, dataToSend){
  DebugSendedText = dataToSend;
  console.log("[DEBUG] - Driver_Ipc_SendData - Send to server: " + dataToSend)
  IpcClient.of.ipcSocketId.emit(topic, dataToSend)
}

function Api_Ipc_CreateClient (){
  IpcClient.config.retry = IPC_CONNECTION_RETRY;
  
  IpcClient.connectTo(
      IPC_SOCKET_ID,
      function(){
          // Connection to server
          IpcClient.of.ipcSocketId.on(
              IPC_TOPIC_CONNECT,
              function(){
                  console.log("[NORMAL] - Ipc_Client_CreateClient - Conected to server")
                  FlagServerConnected = true;
              }
          );
          // Set callback for disconnection to server
          IpcClient.of.ipcSocketId.on(IPC_TOPIC_DISCONNECT, function(){
            console.log("[NORMAL] - Ipc_Client_DisconnectFromServer - Disconnected from server")
            FlagServerConnected = false;
          });
          // Set callback for write server buffer when receive data from socket
          IpcClient.of.ipcSocketId.on(IPC_TOPIC_MESSAGE, function(data){
            Driver_Ipc_WriteServerBuffer(data);
          });
      }
  );
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

    case ServerCommand_t.COMM_SERVER_CLIENTUP:
      dataToSend = 
        COMMAND_INIT +
        ServerCommand_t.COMM_SERVER_CLIENTUP + 
        COMMAND_SEPARATOR +
        ServerCommandType_t.TYPE_SERVER_REQUEST + 
        COMMAND_END;
    break;

    default:
      console.log("[DEBUG] - Api_Server_SendCommand - El mensaje a enviar al servidor es invalido!");
  }
 
  if (dataToSend != STRING_EMPTY){
    Driver_Ipc_SendData(IPC_TOPIC_MESSAGE, dataToSend);
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

function Api_Server_ParseResponse_Clientup (response){
  let isConnected = false;

  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 20 
  ){
    response = response.substring(1, response.length-1);
    response = response.split(COMMAND_SEPARATOR);

    if (
      response[0] == ServerCommand_t.COMM_SERVER_CLIENTUP && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){

      if (response[2] == SERVER_OK_RESPONSE){
        Api_SetConnectionStateMessage("Conectado al servidor");
        console.log("[DEBUG] - Api_Server_ParseResponse_Clientup - Conectado");
        isConnected = true;
      } else {
        Api_SetConnectionStateMessage("No conectado al servidor. Error message: " + response[2]);
        console.log("[DEBUG] - Api_Server_ParseResponse_Clientup - No conectado");
      }

    }
  } else {
    Api_SetConnectionStateMessage("No se recibio respuesta de conexion");
  }

  return isConnected;
}

function Api_Serial_ParseCommandArrived (commString){
  var isValidCommand = false;
  if (
    commString.charAt(0) == COMMAND_INIT && 
    commString.charAt(2) == COMMAND_SEPARATOR && 
    commString.charAt(4) == COMMAND_SEPARATOR && 
    commString.charAt(commString.length -1) == COMMAND_END
  ){
    isValidCommand = true;

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
            
            Driver_Ipc_SendData(commandResponse);
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

            Driver_Ipc_SendData(commandResponse);
        }

        break;

      default:
        DebugProcessedText = "Invalid command";
    }

  } else {
    DebugProcessedText = "Invalid command string";
  }

  return isValidCommand;
}

function Logic_TryToConnectToServer (){
  
  if (!FlagServerConnected){
    Api_Ipc_CreateClient();
    FlagClientIsUp = false;
  }

  if (!FlagClientIsUp){

    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_CLIENTUP);
  
    let commandReceived = Driver_Ipc_ReadServerBuffer();
    
    if (commandReceived != STRING_EMPTY){
      Driver_Ipc_WriteServerBuffer(STRING_EMPTY);
  
      FlagClientIsUp = Api_Server_ParseResponse_Clientup(commandReceived);

      console.log("[DEBUG] - Logic_TryToConnectToServer - Clientup: " + FlagClientIsUp);
    }
  }
}

function Logic_TryToListPorts (){
  if (FlagServerConnected && FlagClientIsUp){
    if (!FlagPortsListed){
      console.log("Tratando de listar los puertos");

      Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_LIST_PORTS);// Command_SendListPorts();
      let commandReceived = Driver_Ipc_ReadServerBuffer();
      FlagPortsListed = Api_Server_ParseResponse_ListPorts(commandReceived);
    }
  }
}

function Logic_TryToConnectPort (){
  if (FlagServerConnected && FlagClientIsUp && FlagPortsListed){
    console.log("[DEBUG] - Logic_TryToConnectPort - Intentando conectar...");
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_CONNECT_PORT); // Command_SendConnectToPort();
    let commandReceived = Driver_Ipc_ReadServerBuffer();
    FlagEmbeddedSysConnected = Api_Server_ParseResponse_Connect(commandReceived);
  } else {
    console.log("Para conectar primero se deben listar los puertos");
  }
}

function Logic_TryToDisconnectPort (){
  if (FlagServerConnected && FlagClientIsUp && FlagPortsListed && FlagEmbeddedSysConnected){
    console.log("Intentando desconectar...");
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_DISCONNECT_PORT); //Command_SendDisconnectToPort();
    let commandReceived = Driver_Ipc_ReadServerBuffer();
    if (commandReceived != STRING_EMPTY){
      FlagEmbeddedSysConnected = Api_Server_ParseResponse_Disconnect(commandReceived);
      Driver_Ipc_WriteServerBuffer(STRING_EMPTY); 
      if (!FlagEmbeddedSysConnected){
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
  
        FlagPortsListed = false;
      }
    }
  } else {
    console.log("Para desconectar primero debe estar conectado");
  }
}

function Logic_CheckIfPeriphericalCommand (){
  if (FlagServerConnected && FlagClientIsUp && FlagPortsListed && FlagEmbeddedSysConnected){
    var dataFromServer = Driver_Ipc_ReadServerBuffer();
    if (dataFromServer != STRING_EMPTY){
      let isValidCommand = Api_Serial_ParseCommandArrived(dataFromServer);
      if (isValidCommand){
        Driver_Ipc_WriteServerBuffer (STRING_EMPTY);
      }
    }
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

    if (!FlagEmbeddedSysConnected){
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
  
  setInterval(Logic_TryToConnectToServer, INTERVAL_CONNECT_SERVER);

  setInterval(Logic_UpdateAppState, INTERVAL_REFRESH_APP);

  setInterval(Logic_TryToListPorts, INTERVAL_LIST_PORTS);

  setInterval(Logic_CheckIfPeriphericalCommand, INTERVAL_PERIPH_COMMANDS);

}

function Logic_UpdateAppState () {

  if (FlagEmbeddedSysConnected){
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
  // ServerBuffer = document.getElementById("DebugCont_TxtBoxCommand").value;
  // Api_Serial_ParseCommandArrived(ServerBuffer);
})





