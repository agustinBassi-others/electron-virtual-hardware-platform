/**
 * @file index.js
 * @author Agustin Bassi <jagustinbassi@gmail.com>
 * @version 1.0
 * @description
 * 
 * Arquitectura:
 * - HTML: Crea los objetos visuales de la APP.
 * - CSS: Brinda estilo a los objetos HTML.
 * - JavaScript: Le da comportamiento a los objetos HTML.
 * 
 * Si bien todos los componentes que le dan comportamiento a la APP estan 
 * concentrados en este archivo, se realizo una arquitecura en "capas" al 
 * estilo de sistemas embebidos. Las capas a saber son:
 * 
 * -----------------
 * |    LOGIC      |
 * -----------------
 * |     API       |
 * -----------------
 * |    DRIVER     |
 * -----------------
 * 
 * - LOGIC: 
 *   Las funciones que tienen este prefijo se encargan de manejar la logica
 *   del programa, es decir de realizar las tareas macro mas importantes. Dentro de estas
 *   funciones se realizan llamadas a la capa API, que brinda soporte para realizar estas funciones.
 * - API: 
 *   En esta capa se realizan las llamadas a las funciones de DRIVERS y a su vez, llamadas 
 *   a funciones dentro de la misma capa API.
 * - DRIVER: 
 *   Se realizan llamadas a los modulos de mas bajo nivel, y que no realizan ninguna logica.
 * 
 * La guia de estilo seguida en este archivo para nombrar sus componentes son:
 * 
 * - Constantes: Mayuscula separados por guion bajo. Ej: const IPC_CONNECTION_RETRY = 1500;
 * - Variables globales: UpperCammelCase: Ej: let BaudRateSelected = 0;
 * - Variables locales: lowerCammelCase: Ej: let isConnected = false;
 * - Funciones: Sepa
 * 
 */

/*==================[inclusions]=============================================*/

const Required_SerialPort = require('serialport');

/*==================[macros]=================================================*/

const VIEW_DEFAUL_ZOOM_FACTOR = 0.85

const STRING_EMPTY = "";

// Settings asociados al formato de los comandos
const COMMAND_INIT = "{";
const COMMAND_END = "}";
const COMMAND_SEPARATOR = ";";
// Settings asociados a la conexion con puertos COM
const BAUD_RATES_LIST = [115200, 57600, 38400, 19200, 9600];
// Posibles estados de los GPIO
const GPIO_STATE_HIGH = '1';
const GPIO_STATE_LOW = '0';
const GPIO_STATE_INVALID = -1;
// Valores maximos y minimos de los adc y dac
const ANALOG_MIN_VALUE = 0;
const ANALOG_MAX_VALUE = 1023;
// Settings para el display LCD 18x3
const LCD_MULTI_LINE_LENGHT = 55;
const LCD_LINE_LENGHT = 18;
const LCD_LINE_2_PREAMBULE = "<br>";
const LCD_LINE_3_PREAMBULE = "<br><br>";
// Intervalos con los que se dispararan las funciones periodicas
const INTERVAL_REFRESH_APP = 20;
const INTERVAL_LIST_PORTS = 1000;
const INTERVAL_ADJUST_ZOOM = 1000;
// Paths con imagenes de la APP
const IMG_SWITCH_ON = "../assets/images/switch_on.svg"
const IMG_SWITCH_OFF = "../assets/images/switch_off.svg"
const IMG_TEC_NO_PRESSED = "../assets/images/button_no_pressed.svg"
const IMG_TEC_PRESSED = "../assets/images/button_pressed.svg"
const IMG_LED_RED = "../assets/images/led_red.svg"
const IMG_LED_GREEN = "../assets/images/led_green.svg"
const IMG_LED_BLUE = "../assets/images/led_blue.svg"
const IMG_LED_CYAN = "../assets/images/led_cyan.svg"
const IMG_LED_VIOLET = "../assets/images/led_violet.svg"
const IMG_LED_YELOW = "../assets/images/led_yellow.svg"
const IMG_LED_WHITE = "../assets/images/led_white.svg"
const IMG_LED_OFF = "../assets/images/led_off.svg"

/*==================[typedef]================================================*/

const LcdLine_t = {
  ALL: 0,
  FIRST: 1,
  SECOND: 2,
  THIRD: 3
}

const Log_t = {
  ERROR: 0,
  WARN: 1,
  NORMAL: 2,
  DEBUG: 3,
  EVENT: 4
}

// Posibles comandos que puede enviar el sistema embebido
const SerialCommand_t = {
  COMM_SERIAL_GPIO_READ: 'a',
  COMM_SERIAL_GPIO_WRITE: 'b',
  COMM_SERIAL_ADC_READ: 'c',
  COMM_SERIAL_DAC_WRITE: 'd',
  COMM_SERIAL_LCD_WRITE_BYTE: 'e',
  COMM_SERIAL_LCD_WRITE_STRING: 'f',
  COMM_SERIAL_7SEG_WRITE: 'g',
}
// Tipo de comando (request o response)
const SerialCommandType_t = {
  TYPE_SERIAL_REQUEST: '0',
  TYPE_SERIAL_RESPONSE: '1',
}
// Lista con todo el mapa de perifericos virtuales
const PeriphMap_t = {
  LEDR: 'a',
  LEDG: 'b',
  LEDB: 'z',
  LED1: 'c',
  LED2: 'd',
  LED3: 'e',
  LED4: 'f',

  TEC1: 'g',
  TEC2: 'h',
  TEC3: 'i',
  TEC4: 'j',

  ADC_CH1: 'k',

  DAC_CH1: 'n',

  DISPLAY_LCD1: 'o',

  DISPLAY__7SEGS: 'p'
}

/*==================[internal data declaration]==============================*/

// Variables asociadas a la conexion de puertos COM
let PortSelected = "";
let BaudRateSelected = 115200;
let SerialBuffer = "";
// Flags que rigen el comportamiento de la APP
let FlagPortsListed = false;
let FlagEmbeddedSysConnected = false;
// Variables asociadas a los objetos HTML
//let PortConnectionText         = "State: Trying to list ports..."
let Led1State = false;
let Led2State = false;
let Led3State = false;
let Led4State = false;
let Tec1State = true;
let Tec2State = true;
let Tec3State = true;
let Tec4State = true;
let Adc1Value = 512;
let Dac1Value = 512;
let Segment7Text = "-";
let LcdText = "\\(-)/ Hello CIAA \\(-)/";

let Obj_SerialPort;
let LogLevel = Log_t.ERROR;

/*==================[Objects events and initialization]=========================*/

Logic_InitPeriphericals();

/*==================[internal function declaration]==========================*/

/**
 * Setea el nivel de log global de la APP
 * @param {Log_t} logLevel 
 */
function Log_SetLevel(logLevel) {
  LogLevel = logLevel;
}

/**
 * Devuelve el nivel de log global de la APP
 * @returns {Log_t} loglevel
 */
function Log_GetLevel() {
  return LogLevel;
}

/**
 * Imprime un mensaje de log por consola.
 * El mensaje se imprimira siempre y cuando el nivel de 
 * log del mensaje sea menor o igual al nivel de log de la APP.
 * @param {*} logLevel puede ser desde ERROR a EVENT
 * @param {*} func nombre de la funcion que llama a esta funcion
 * @param {*} message mensaje a enviar a la consola.
 */
function Log_Print(logLevel, func, message) {

  if (Log_GetLevel() < Log_t.ERROR) {
    Log_SetLevel(Log_t.ERROR);
  } else if (Log_GetLevel() > Log_t.EVENT) {
    Log_SetLevel(Log_t.EVENT);
  }

  if (logLevel <= Log_GetLevel()) {

    if (logLevel == Log_t.ERROR) {
      logLevel = "[ERROR] ";
    } else if (logLevel == Log_t.WARN) {
      logLevel = "[WARN]  ";
    } else if (logLevel == Log_t.NORMAL) {
      logLevel = "[NORMAL]";
    } else if (logLevel == Log_t.DEBUG) {
      logLevel = "[DEBUG] ";
    } else if (logLevel == Log_t.EVENT) {
      logLevel = "[EVENT] ";
    }
    console.log(logLevel + " - " + func + ": " + message);
  }

}

/**
 * Envia data por el puerto serial.
 * @param {*} data data a enviar.
 */
function Serial_SendData(data) {
  Log_Print(Log_t.DEBUG, "Serial_SendData", 'Sending data serial: ' + data);

  Obj_SerialPort.write(data);
}

/**
 * Llena las listas de puertos disponibles y baudrate a partir de la
 * info recibida del driver de puerto serie que devuelve una lista con
 * los puertos disponibles del sistema.
 * Si se pueden listar al menos un puerto, el flag FlagPortsListed se 
 * pone en true
 */
function Serial_FillPortsList() {
  var serialport = require('serialport');
  // list serial ports:
  serialport.list(function (err, ports) {
    var isSomePortSelected = false;
    ports.forEach(function (port) {
      // todo pensar si hay que meter un if para filtrar nombres

      if (!isSomePortSelected) {
        PortSelected = port.comName;
        isSomePortSelected = true;
      }

      Log_Print(Log_t.DEBUG, "Serial_FillPortsList", "Port detected" + port.comName);

      let portListObj = document.getElementById("PortsCont_AviablePortsList");
      let portOption = document.createElement("option");
      portOption.text = port.comName;
      portListObj.add(portOption);
      //todo agregar portselected aca con alguna logica
    });
    // Actualiza la lista desplegable de baudrate con las posibles velocidades de conexion
    BAUD_RATES_LIST.forEach(element => {
      let baudRateListObj = document.getElementById("PortsCont_AviableBaudrateList");
      let baudRateOption = document.createElement("option");
      baudRateOption.text = element;
      baudRateListObj.add(baudRateOption);
    });
    BaudRateSelected = BAUD_RATES_LIST[0];

    FlagPortsListed = true;
  });

}

/**
 * Limpia las listas de los puertos disponibles y el baudrate.
 * Para hacer esta funcion recorre las listas desplegables elemento
 * a elemento y los va eliminando.
 */
function Serial_ClearPortsLists() {
  var i;
  // Limpia las listas desplegables de los puertos disponibles
  let portListObj = document.getElementById("PortsCont_AviablePortsList");//var select = document.getElementById("PortsCont_AviablePortsList");
  var length = portListObj.options.length;
  for (i = 0; i < length; i++) {
    portListObj.remove(0);
  }
  // Limpia las listas desplegables de los baudrates disponibles
  let baudRateListObj = document.getElementById("PortsCont_AviableBaudrateList");
  length = baudRateListObj.options.length;
  for (i = 0; i < length; i++) {
    baudRateListObj.remove(0);
  }
}

/**
 * Crea una conexion serial.
 * Esta funcion tiene vital importancia en la APP ya que establece comunicacion 
 * con el sistema embebido.
 * Como la libreria 'serialport' funciona con callbacks segun los diferentes eventos 
 * que pueden suceder con el puerto serie, esta funcion recibe los callbacks que van 
 * a manejar cierta logica del programa una vez que sucedan los eventos asociados, tales 
 * como abrir el puerto, datos en el puerto, cerrar el puerto.
 * @param {*} port Puerto com seleccionado desde el menu desplegable
 * @param {*} baudrate baudrate seleccionado desde el menu desplegable
 * @param {*} openCallback callback que se ejecuta cuando se abre el puerto
 * @param {*} dataCallback callback que se ejecuta cuando llegan datos por el puerto
 * @param {*} closeCallback callback que se ejecuta cuando se cierra el puerto
 */
function Serial_CreateConnection(port, baudrate, openCallback, dataCallback, closeCallback) {
  Log_Print(Log_t.DEBUG, "Serial_CreateConnection", 'Try open port ' + port + " - at: " + baudrate + " baudios");

  Obj_SerialPort = new Required_SerialPort(PortSelected, { baudRate: parseInt(BaudRateSelected) });

  Obj_SerialPort.on('open', () => openCallback(true));

  Obj_SerialPort.on('data', data => dataCallback(data));

  Obj_SerialPort.on('close', () => closeCallback());
}

/**
 * Escribe un mensaje en label del panel de conexion (arriba a la izquierda)
 * @param  {String} messageToWrite mensaje a escribir
 */
function Serial_WriteConnectionLabel(messageToWrite) {
  //PortConnectionText = messageToWrite;
}

/**
 * Callback llamado automaticamente cuando se abre el puerto serie.
 * Este callback hace que el flag indicando que el sistema embebido esta 
 * conectado se ponga en true.
 * @param {*} flag 
 */
function Serial_CallbackOpen(flag) {
  Log_Print(Log_t.DEBUG, "Api_SerialCallbackOpen", 'Serial port connected, flag: ' + flag);
  FlagEmbeddedSysConnected = true;
}

/**
 * Callback que se ejecuta cuando llegan datos por el puerto serie provenientes del 
 * sistema embebido. 
 * Como todos los datos que deben llegar del sistema embebido deberian ser comandos de los 
 * perifericos virtuales, cada arrivo de datos hace que se llame a la funcion Logic_ParseCommandArrived()
 * @param {*} data data recibida por el perto serie
 */
function Serial_CallbackDataArrived(data) {
  var receiveBuffer = "";

  Log_Print(Log_t.DEBUG, "Api_SerialCallbackDataArrived", 'Data received from serial: ' + data);

  receiveBuffer = data.toString().replace(/(\n)/g, "");

  if (receiveBuffer.includes("{") && receiveBuffer.includes("}")) {
    Logic_ParseCommandArrived(receiveBuffer);
  } else {
    if (SerialBuffer == "" && receiveBuffer.includes("{")) {
      // Log_Print(Log_t.DEBUG, "Serial_CallbackDataArrived", "Assigning to Serial buffer first part of command: " + receiveBuffer);
      SerialBuffer = receiveBuffer;
    } else if (SerialBuffer.includes("{") && !receiveBuffer.includes("}")) {
      // Log_Print(Log_t.DEBUG, "Serial_CallbackDataArrived", "Assigning to Serial buffer las part of command: " + receiveBuffer);
      SerialBuffer = SerialBuffer + receiveBuffer;
    } else if (SerialBuffer.includes("{") && receiveBuffer.includes("}")) {
      // Log_Print(Log_t.DEBUG, "Serial_CallbackDataArrived", "Assigning to Serial buffer las part of command: " + receiveBuffer);
      SerialBuffer = SerialBuffer + receiveBuffer;
      Logic_ParseCommandArrived(SerialBuffer);
      SerialBuffer = "";
    }
  }
}

/**
 * Cierra la conexion con el puerto serie y ademas realiza las tareas asociadas
 * al evento.
 * Por ejemplo pone los flags de sistema embebid conectado y de puertos listados 
 * en false, elimina el objeto de conexion serial y limpia las listas de puertos 
 * disponibles y baudrates.
 */
function Serial_CloseConnection() {
  if (FlagEmbeddedSysConnected) {
    Log_Print(Log_t.DEBUG, "Serial_CloseConnection", 'Closing serial port...');

    Obj_SerialPort.end();

    Obj_SerialPort.close();

    Serial_ClearPortsLists();
    // Setea el flag de puertos no listados para que se vuelvan a listar.
    FlagPortsListed = false;
    FlagEmbeddedSysConnected = false;

    delete Obj_SerialPort;
  }
}

/**
 * Chequea el tamaño de la pantalla y en funcion del tamaño ajusta el zoom.
 * Esta funcion es llamada desde Logic_InitializaApp()
 * Debido a que los componentes de la APP tienen un tamaño fijo, en vez de 
 * estar ajustando escalas de componentes, lo que se hace es darle mas o 
 * menos zoom dependiendo del tamaño de la ventana. De esta manera siempre 
 * se mantiene constante la relacion de aspecto.
 */
function View_AdjustAppZoom() {

  /////////////////////////////////////////
  // DEBUG PARA AJUSTAR ZOOM CON EL ADC
  //
  // let zoomFactor = Adc1Value / 1024;
  // if (zoomFactor < 0.5) {
  //   zoomFactor = 1.0 - (0.5 - zoomFactor);
  // } else {
  //   zoomFactor = 1.0 + (zoomFactor - 0.5);
  // }
  // LcdText = "ADC: " + Adc1Value + " - Scl: " + zoomFactor;
  // View_SetZoomFactor(zoomFactor);
  //
  /////////////////////////////////////////

  // Tamanos de resoluciones indexadas
  const AVIABLE_RESOLUTIONS = 7;
  // Posible desvio de tamanos de resoluciones
  const RESOLUTION_BIAS = 0.05;
  // Resoluciones indexadas
  const absoluteResolutions = [
    573340,  //(1024 x 600)  - 60 (barra inicio) 
    724992,  //(1024 x 768)  - 60 (barra inicio)
    884800,  //(1280 x 720)  - 60 (barra inicio)
    967128,  //(1366 x 768)  - 60 (barra inicio)
    1344000, //(1600 x 900)  - 60 (barra inicio)
    1958400, //(1920 x 1080) - 60 (barra inicio)
    3532800  //(2560 x 1440) - 60 (barra inicio)
  ];
  // Factores de zoom indexados dependiendo la resolucion de pantalla
  const absoluteZooms = [
    0.77,
    0.80,
    0.93,
    1.01,
    1.2,
    1.43,
    1.8
  ];

  // Obtiene el tamano de la pantalla, su producto y la
  // posible desviacion de los tamanos indexados
  // const screen = require('electron').screen;
  // const display = screen.getPrimaryDisplay();
  // var dimensions = display.size;
  // let width = dimensions.width;
  // let height = dimensions.height;
  const electron = require('electron')
  const remote = electron.remote;
  let height = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().height;
  let width = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().width;
  let resolutionProduct = width * height;
  let sizeBias = resolutionProduct * RESOLUTION_BIAS;

  // En funcion del tamano de la pantalla calcula el posible zoom
  for (i = 0; i < AVIABLE_RESOLUTIONS; i++){
    // Si el tamano de pantalla encaja con los indexados +- una desviacion
    if (resolutionProduct > (absoluteResolutions[i] - sizeBias) && resolutionProduct < (absoluteResolutions[i] + sizeBias)){
      // Ajusta el zoom al tamano de pantalla apropiado
      const { webFrame } = require('electron');
      webFrame.setZoomFactor(absoluteZooms[i]);
      break;
    }
  }

  // Muestra por consola la informacion procesada
  Log_Print(Log_t.DEBUG, "View_AdjustAppZoom", "Resolution: " + width + " x " + height);
  Log_Print(Log_t.DEBUG, "View_AdjustAppZoom", "Resolution product: " + resolutionProduct + ", posible bias: " + sizeBias);
  Log_Print(Log_t.DEBUG, "View_AdjustAppZoom", "Zoom calculated " + absoluteZooms[i]);
  
}

/**
 * Trata de listar los puertos disponibles.
 * Esta funcion se dispara periodicamente.
 * Para que se ejecuten sus acciones, primero es necesario que exista conexion
 * con el servidor, y ademas, el cliente este dado de alta.
 */
function Api_SerialTryToListPorts() {
  if (!FlagPortsListed) {
    Log_Print(Log_t.DEBUG, "Logic_TryToListPorts", "Trying to list ports...");
    Serial_FillPortsList();
  }
}

/**
 * Trata de conectase al puerto y baudrate seleccionados por el usuario.
 * Esta funcion se dispara cuando el usuario presiona el boton de conexion/desconexion.
 * Para que se ejecuten sus acciones, es necesario que exista conexion con el 
 * servidor, el cliente este dado de alta y los puertos esten listados.
 */
function Api_SerialManageConnection() {
  if (!FlagEmbeddedSysConnected) {

    Serial_CreateConnection(
      PortSelected,
      BaudRateSelected,
      Serial_CallbackOpen,
      Serial_CallbackDataArrived,
      Serial_CloseConnection
    );

    Log_Print(Log_t.NORMAL, "Logic_ManageSerialConnection", "State: Embedded System connected");
    Serial_WriteConnectionLabel("State: Embedded System connected");
  } else {
    Serial_CloseConnection();
    Log_Print(Log_t.NORMAL, "Logic_ManageSerialConnection", "State: Embedded System disconnected");
    Serial_WriteConnectionLabel("State: Embedded System disconnected");
  }
}

/**
 * Si bien todas las funciones son necesarias, particularmente esta es la que le da vida a 
 * la aplicacion, ya que, en esta funcion se reciben los comandos del sistema embebido que 
 * pretenden emular el accionar de un periferico.
 * Todas las demas funciones en este archivo sirven de soporte para que, a fin de cuentas,
 * pueda haber una comunicacion correcta entre el sistema embebido y los perifericos virtuales.
 * 
 * El flujo de tareas que ocurran para que los datos lleguen a esta funcion es el siguiente:
 * 1) Cuando el servidor arranca, trata de listar los puertos disponibles y abrir un socket listener.
 * El socket tendra el objetivo de hacer un passthrough entre lo que recibe por socket y el puerto serie,
 * es decir, si llegan datos por el puerto serie los manda por el socket, si llegan datos por el socket los 
 * manda por el puerto serie.
 * 2) Cuando la aplicacion arranca, trata de comunicarse con el servidor mediante el socket ipc.
 * 3) Cuando hay conexion entre servidor y cliente, el cliente le envia peticiones para listar los puertos disponibles.
 * 4) Si hay puertos disponibles el servidor le responde con los puertos y la APP lo muestra en las listas desplegables.
 * 5) El usuario elije de la lista de puertos y baudrate una combinacion, y mediante el boton de conexion 
 * trata de conectarse con el sistema embebido.
 * 6) Si todo esta bien, el servidor le responde con un OK, y recien ahi la APP y el embebido estan conectados.
 * 7) Desde el embebido se enviaran los comandos para interactuar con el hardware virtual.
 * 8) La APP interpretara los comandos enviados por el embebido y realizara las acciones pertinentes.
 * 
 * Cada comando tendra un formato diferente, dependiendo de a que periferico se quiere acceder, por lo que,
 * para entender bien cada uno de los comando sera necesario prestar atencion a cada CASE del switch.
 * 
 * @param {String} commString el comando recibido desde el sistema embebido.
 * 
 * Si es un comando valido:
 * 
 * @returns {Boolean} isValidCommand true si es un comando valido, false caso contrario.
 */
function Logic_ParseCommandArrived(commString) {
  var isValidCommand = false;

  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    commString.charAt(0) == COMMAND_INIT &&
    commString.charAt(2) == COMMAND_SEPARATOR &&
    commString.charAt(4) == COMMAND_SEPARATOR &&
    commString.charAt(commString.length - 1) == COMMAND_END
  ) {
    // Activa el flag si es un comando valido.
    isValidCommand = true;
    // Guarda en la variable "command" el comando recibido.
    let command = commString.charAt(1);
    // Guarda en la variable "periphericalMap" el periferico recibido.
    let periphericalMap = commString.charAt(3);
    // Realiza un switch del comando recibido.
    switch (command) {

      case SerialCommand_t.COMM_SERIAL_GPIO_WRITE:
        DebugProcessedText = "COMMAND_GPIO_WRITE";

        let gpioState;

        if (commString.charAt(5) == GPIO_STATE_LOW) {
          gpioState = false;
        } else if (commString.charAt(5) == GPIO_STATE_HIGH) {
          gpioState = true;
        } else {
          gpioState = GPIO_STATE_INVALID;
          DebugProcessedText = "COMMAND_GPIO_WRITE - Invalid state received!";
        }

        if (gpioState != GPIO_STATE_INVALID) {
          if (periphericalMap == PeriphMap_t.LED1) {
            Led1State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED2) {
            Led2State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED3) {
            Led3State = gpioState;
          } else if (periphericalMap == PeriphMap_t.LED4) {
            Led4State = gpioState;
          } else {
            DebugProcessedText = "COMMAND_GPIO_WRITE - Invalid peripherical received!";
          }
        }

        break;

      case SerialCommand_t.COMM_SERIAL_DAC_WRITE:
        DebugProcessedText = "COMMAND_DAC_WRITE";

        let dacStringValue = commString.slice(5, (commString.length - 1));
        let dacIntValue = parseInt(dacStringValue);

        if (!isNaN(dacIntValue)) {
          if (dacIntValue < ANALOG_MIN_VALUE) {
            dacIntValue = ANALOG_MIN_VALUE;
          } else if (dacIntValue > ANALOG_MAX_VALUE) {
            dacIntValue = ANALOG_MAX_VALUE;
          }
          Dac1Value = dacIntValue;
        }

        break;

      case SerialCommand_t.COMM_SERIAL_LCD_WRITE_STRING:
        DebugProcessedText = "COMMAND_LCD_WRITE_STRING";

        let lcdLine = commString.charAt(5);
        let lcdStr = commString.slice(7, (commString.length - 1));

        if (lcdLine == LcdLine_t.ALL) {
          if (lcdStr != STRING_EMPTY) {
            if (lcdStr.length > LCD_MULTI_LINE_LENGHT) {
              lcdStr = lcdStr.slice(0, LCD_MULTI_LINE_LENGHT);
            }
            LcdText = lcdStr;
          }
        } else if (lcdLine == LcdLine_t.FIRST || lcdLine == LcdLine_t.SECOND || lcdLine == LcdLine_t.THIRD) {

          if (lcdStr != STRING_EMPTY) {

            if (lcdStr.length > LCD_LINE_LENGHT) {
              lcdStr = lcdStr.slice(0, LCD_LINE_LENGHT);
            }

            if (lcdLine == LcdLine_t.SECOND) {
              LcdText = LCD_LINE_2_PREAMBULE + lcdStr;
            } else if (lcdLine == LcdLine_t.THIRD) {
              LcdText = LCD_LINE_3_PREAMBULE + lcdStr;
            } else {
              LcdText = lcdStr;
            }
          }

        }

        break;

      case SerialCommand_t.COMM_SERIAL_7SEG_WRITE:
        DebugProcessedText = "COMMAND_7SEG_WRITE";

        if (periphericalMap == PeriphMap_t.DISPLAY__7SEGS) {

          if ((commString.charAt(5) != STRING_EMPTY) && (commString.charAt(5) != COMMAND_END)) {
            Segment7Text = commString.charAt(5);
          }

        }

        break;

      case SerialCommand_t.COMM_SERIAL_GPIO_READ:
        DebugProcessedText = "COMMAND_GPIO_READ";

        let commandType = commString.charAt(5);

        if (commandType == SerialCommandType_t.TYPE_SERIAL_REQUEST) {

          let gpioReadState = GPIO_STATE_INVALID;

          if (periphericalMap == PeriphMap_t.LED1) {
            gpioReadState = Led1State;
          } else if (periphericalMap == PeriphMap_t.LED2) {
            gpioReadState = Led2State;
          } else if (periphericalMap == PeriphMap_t.LED3) {
            gpioReadState = Led3State;
          } else if (periphericalMap == PeriphMap_t.LED4) {
            gpioReadState = Led4State;
          } else if (periphericalMap == PeriphMap_t.TEC1) {
            gpioReadState = Tec1State;
          } else if (periphericalMap == PeriphMap_t.TEC2) {
            gpioReadState = Tec2State;
          } else if (periphericalMap == PeriphMap_t.TEC3) {
            gpioReadState = Tec3State;
          } else if (periphericalMap == PeriphMap_t.TEC4) {
            gpioReadState = Tec4State;
          }

          if (gpioReadState != GPIO_STATE_INVALID) {

            if (!gpioReadState) {
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

            Serial_SendData(commandResponse);
          }

        }

        break;

      case SerialCommand_t.COMM_SERIAL_ADC_READ:
        DebugProcessedText = "COMMAND_ADC_READ";

        if (periphericalMap == PeriphMap_t.ADC_CH1) {

          let commandResponse =
            COMMAND_INIT +
            SerialCommand_t.COMM_SERIAL_ADC_READ +
            COMMAND_SEPARATOR +
            periphericalMap +
            COMMAND_SEPARATOR +
            SerialCommandType_t.TYPE_SERIAL_RESPONSE +
            COMMAND_SEPARATOR +
            ("000" + Adc1Value).slice(-4) +
            COMMAND_END;

          Serial_SendData(commandResponse);
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

/**
 * Inicializa la aplicacion. Esta funcion es llamada al inicio del archivo.
 * Basicamente las opraciones que realiza son darles comportamiento a los 
 * objetos HTML obtenidos desde el document y asociar algunas variables a esos objetos.
 * Por otro lado, setea los timers para disparar las acciones periodicas requeridas 
 * por la aplicacion.
 */
function Logic_InitPeriphericals() {

  Log_SetLevel(Log_t.EVENT);

  document.getElementById("PortsCont_AviablePortsList").addEventListener('click', (e) => {
    Log_Print(Log_t.EVENT, "PortsCont_AviablePortsList", "Selected port: " + e.target.value);
    PortSelected = e.target.value;
  })

  document.getElementById("PortsCont_AviableBaudrateList").addEventListener('click', (e) => {
    Log_Print(Log_t.EVENT, "PortsCont_AviableBaudrateList", "Selected baudrate: " + e.target.value);
    BaudRateSelected = e.target.value;
  })

  document.getElementById("PortsCont_ImgPortSwitch").addEventListener('click', (e) => {
    Api_SerialManageConnection();
  })

  //document.querySelector(".PortsCont_LblPortState").innerHTML = PortConnectionText;

  document.getElementById("GpioCont_ImgTec1").addEventListener('mousedown', (e) => {
    Tec1State = false;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 1 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec1").addEventListener('mouseup', (e) => {
    Tec1State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec1").addEventListener('mouseout', (e) => {
    Tec1State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 1 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec2").addEventListener('mousedown', (e) => {
    Tec2State = false;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 2 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec2").addEventListener('mouseup', (e) => {
    Tec2State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 2 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec2").addEventListener('mouseout', (e) => {
    Tec2State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 2 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec3").addEventListener('mousedown', (e) => {
    Tec3State = false;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 3 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec3").addEventListener('mouseup', (e) => {
    Tec3State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 3 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec3").addEventListener('mouseout', (e) => {
    Tec3State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 3 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec4").addEventListener('mousedown', (e) => {
    Tec4State = false;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 4 pressed");
    e.target.src = IMG_TEC_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec4").addEventListener('mouseup', (e) => {
    Tec4State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 4 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  document.getElementById("GpioCont_ImgTec4").addEventListener('mouseout', (e) => {
    Tec4State = true;
    Log_Print(Log_t.EVENT, "GpioCont_ImgTec", "Tec 4 released");
    e.target.src = IMG_TEC_NO_PRESSED;
  })

  var RangeAdc = document.getElementById("AnalogCont_RangeAdc");
  RangeAdc.oninput = function () {
    Adc1Value = this.value;
    Log_Print(Log_t.EVENT, "AnalogCont_RangeAdc", "ADC Value changed to: " + Adc1Value);
  }

  document.getElementById("AnalogCont_RangeDac").disabled = true;

  document.getElementById("AnalogCont_RangeDac").value = Dac1Value;

  document.querySelector(".LcdCont_TextContainer p").innerHTML = LcdText;

  document.querySelector(".Segments7Cont_Display").innerHTML = Segment7Text;

  setInterval(Logic_UpdatePeriphericalsState, INTERVAL_REFRESH_APP);

  setInterval(Api_SerialTryToListPorts, INTERVAL_LIST_PORTS);

  View_AdjustAppZoom();

  document.getElementById("LinkHome").addEventListener('click', (e) => {
    Logic_ManageHtmlToShow("Periphericals");
  });

  document.getElementById("LinkSource").addEventListener('click', (e) => {
    Logic_ManageHtmlToShow("Source");
  });

  document.getElementById("LinkManual").addEventListener('click', (e) => {
    Logic_ManageHtmlToShow("Documentation");
  });

  document.getElementById("LinkContact").addEventListener('click', (e) => {
    Logic_ManageHtmlToShow("Contact");
  });

  Logic_ManageHtmlToShow("Periphericals")

}

/**
 * Actualiza el estado de la aplicacion de manera periodica.
 * Todos los objetos HTML de la interfaz grafica tienen asociadas sus 
 * respectivas variables. Por ejemplo, el LED1 tiene asociado un estado,
 * el display LCD tiene asociado un texto y el ADC tiene asociado un valor.
 * Esas variables son modificadas por algunas funciones de la APP, por ejemplo,
 * en la funcion de Api_Serial_ParseCommandArrived (), o mediante el boton de 
 * conexion/desconexion.
 * Entonces, para acceder a los objetos HTML de manera centralizada y organizada
 * esta funcion asigna a los objetos html el estado de las variables.
 */
function Logic_UpdatePeriphericalsState() {

  if (FlagEmbeddedSysConnected) {
    document.getElementById("PortsCont_ImgPortSwitch").src = IMG_SWITCH_ON;
  } else {
    document.getElementById("PortsCont_ImgPortSwitch").src = IMG_SWITCH_OFF;
  }

  // document.querySelector(".PortsCont_LblPortState").innerHTML  = PortConnectionText;

  if (!Led1State) {
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed1").src = IMG_LED_RED;
  }

  if (!Led2State) {
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed2").src = IMG_LED_GREEN;
  }

  if (!Led3State) {
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed3").src = IMG_LED_BLUE;
  }

  if (!Led4State) {
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_OFF;
  } else {
    document.getElementById("GpioCont_ImgLed4").src = IMG_LED_BLUE;
  }

  document.getElementById("AnalogCont_RangeDac").value = Dac1Value;

  document.querySelector(".LcdCont_TextContainer p").innerHTML = LcdText;

  document.querySelector(".Segments7Cont_Display").innerHTML = Segment7Text;

}

function Logic_ManageHtmlToShow(htmlToShow) {

  if (htmlToShow == "Periphericals") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Source") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Documentation") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Contact") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'block';


  } else {
    console.log("Invalid htmlToShow")
  }

}

/*==================[internal function declaration]==========================*/
