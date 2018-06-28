/**
 * @file renderer.js
 * @author Agustin Bassi <jagustinbassi@gmail.com>
 * @version 1.0
 * @description
 * 
 * Este archivo es el que brinda funcionalidad a la aplicacion.
 * Para funcionar unicamente requiere del modulo node-ipc.
 * Para darle vida a la APP toma los objetos HTML creados en el archivo 
 * index.html mediante el objeto document.get....
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
 * - LOGIC: Las funciones que tienen este prefijo se encargan de manejar la logica
 * del programa, es decir de realizar las tareas macro mas importantes. Dentro de estas
 * funciones se realizan llamadas a la capa API, que brinda soporte para realizar estas funciones.
 * - API: En esta capa se realizan las llamadas a las funciones de DRIVERS y a su vez, llamadas 
 * a funciones dentro de la misma capa API.
 * - DRIVER: Se realizan llamadas a los modulos de mas bajo nivel, y que no realizan ninguna logica.
 * 
 * 
 * 
 * La guia de estilo seguida en este archivo para nombrar sus componentes son:
 * 
 * - Constantes: Mayuscula separados por guion bajo. Ej: const IPC_CONNECTION_RETRY = 1500;
 * - Variables globales: UpperCammelCase: Ej: let BaudRateSelected = 0;
 * - Variables locales: lowerCammelCase: Ej: let isConnected = false;
 * - Funciones: Sepa
 * 
 * 
 */

/*==================[inclusions]=============================================*/

// Objeto socket de conexion de ipc
var IpcClient = require('node-ipc');

/*==================[macros]=================================================*/

// Settings asociados a la comunicacion con el servidor
const IPC_SOCKET_ID            = 'ipcSocketId'
const IPC_CONNECTION_RETRY     = 1500
// Settings asociados al formato de los comandos
const COMMAND_INIT             = "{";
const COMMAND_END              = "}";
const COMMAND_SEPARATOR        = ";";
// Settings asociados a la conexion con puertos COM
const BAUD_RATES_LIST          = [9600, 19200, 38400, 57600, 115200];
const NO_PORTS_RESPONSE        = "0" 
// Respuestas del servidor
const SERVER_OK_RESPONSE       = "ok"
const STRING_EMPTY             = "";
// Posibles estados de los GPIO
const GPIO_STATE_HIGH          = '1';
const GPIO_STATE_LOW           = '0';
const GPIO_STATE_INVALID       = -1;
// Valores maximos y minimos de los adc y dac
const ANALOG_MIN_VALUE         = 0;
const ANALOG_MAX_VALUE         = 1023;
// Settings para el display LCD 18x3
const LCD_MULTI_LINE           = "0";
const LCD_FIRST_LINE           = "1";
const LCD_SECOND_LINE          = "2";
const LCD_THIRD_LINE           = "3";
const LCD_MULTI_LINE_LENGHT    = 55;
const LCD_LINE_LENGHT          = 55;
const LCD_LINE_2_PREAMBULE     = "<br>";
const LCD_LINE_3_PREAMBULE     = "<br><br>";
// Intervalos con los que se dispararan las funciones periodicas
const INTERVAL_REFRESH_APP     = 200;
const INTERVAL_CONNECT_SERVER  = 1000;
const INTERVAL_LIST_PORTS      = 1000;
const INTERVAL_PERIPH_COMMANDS = 200;
// Paths con imagenes de los swtiches
const IMG_SWITCH_ON            = "images/switch_on.svg"
const IMG_SWITCH_OFF           = "images/switch_off.svg"
// Paths con imagenes de teclas
const IMG_TEC_NO_PRESSED       = "images/button_no_pressed.svg"
const IMG_TEC_PRESSED          = "images/button_pressed.svg"
// Paths con imagenes de colores de leds
const IMG_LED_RED              = "images/led_red.svg"
const IMG_LED_GREEN            = "images/led_green.svg"
const IMG_LED_BLUE             = "images/led_blue.svg"
const IMG_LED_CYAN             = "images/led_cyan.svg"
const IMG_LED_VIOLET           = "images/led_violet.svg"
const IMG_LED_YELOW            = "images/led_yellow.svg"
const IMG_LED_WHITE            = "images/led_white.svg"
const IMG_LED_OFF              = "images/led_off.svg"

/*==================[typedef]================================================*/

// Posibles comandos que puede enviar el sistema embebido
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
// Tipo de comando (request o response)
const SerialCommandType_t = {
	TYPE_SERIAL_REQUEST          : '0',
	TYPE_SERIAL_RESPONSE         : '1',
}
// Lista con todo el mapa de perifericos virtuales
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
// Posibles comandos que se pueden enviar entre servidor y cliente.
const ServerCommand_t = {
	COMM_SERVER_LIST_PORTS       : 'list_ports',
  COMM_SERVER_CONNECT_PORT     : 'connect_port',
  COMM_SERVER_DISCONNECT_PORT  : 'disconnect_port',
  COMM_SERVER_CLIENTUP         : 'client_up',
}
// Tipo de comando (request o response)
const ServerCommandType_t = {
	TYPE_SERVER_REQUEST          : 'request',
	TYPE_SERVER_RESPONSE         : 'response',
}
// Posibles topicos que se pueden enviar entre server y cliente
const IpcTopic_t = {
  MESSAGE    : 'message',
  CONNECT    : 'connect',
  DISCONNECT : 'disconnect'
}

/*==================[internal data declaration]==============================*/

// Variables asociadas a la conexion de puertos COM
let PortSelected               = "";
let BaudRateSelected           = 0;
// Flags que rigen el comportamiento de la APP
let FlagPortsListed            = false;
let FlagEmbeddedSysConnected   = false;
let FlagServerConnected        = false;
let FlagClientIsUp             = false;
// Variables asociadas a los objetos HTML
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
let LcdText                    = "\\(-)/ Hello CIAA \\(-)/";
// Buffer de comunicacion entre servidor y cliente
let ServerBuffer               = "";
// Labels asociados al panel de debug.
let DebugProcessedText         = "Debug processed text";
let DebugSendedText            = "Debug sended text";

/*==================[Objects events and initialization]=========================*/

Logic_InitializeApp();

/*==================[internal function declaration]==========================*/

/**
 * Devuelve el contenido de lo que hay en el ServerBuffer
 */
function Driver_Ipc_ReadServerBuffer (){
  return ServerBuffer;
}

/**
 * Escribe el buffer ServerBuffer con el contenido pasado como parametro.
 * Cuando llegan datos por el socket conectado al servidor, los datos llegan
 * a una funcion de callback. Para poder acceder a los datos del socket desde
 * cualquier lado, ese callback llama a esta funcion con los datos recibidos,
 * asi quedan alojados en el buffer.
 * @param  {String} dataToWrite
 */
function Driver_Ipc_WriteServerBuffer (dataToWrite){
  console.log("[DEBUG] - Driver_Ipc_WriteServerBuffer - Writing server buffer: " + dataToWrite)
  ServerBuffer = dataToWrite;
}

/**
 * Envia un topic con data hacia el socket abierto entre el servidor y cliente.
 * El topic es una forma de identificar que tipo de mensaje se manda.
 * Cada topic tiene asociado un callback.
 * Los topics que se mandan entre cliente y servidor son: connect/disconnect y 
 * message, este ultimo representa un mensaje.
 * @param  {String} topic
 * @param  {String} dataToSend
 */
function Driver_Ipc_SendData (topic, dataToSend){
  // Escribe el mensaje a enviar en un label de debug.
  DebugSendedText = dataToSend;
  // Envia los datos a enviar por consola.
  console.log("[DEBUG] - Driver_Ipc_SendData - Send to server: " + dataToSend)
  // Realiza el envio de los datos.
  IpcClient.of.ipcSocketId.emit(topic, dataToSend)
}

/**
 * Crea un cliente que se conecta con el servidor mediante IPC.
 * Dentro de esta funcion se le asignan parametros al objeto 
 * IpcClient (que es un require de la libreria ipc). Ademas de 
 * asignarse parametros al objeto, se le asignan funciones de callback 
 * dependiendo el tipo de evento. Entre ellas las funciones que se asignan son:
 * - Que hacer cuando se conecta al servidor (1era funcion)
 * - Que hacer cuando llegan datos por el socket (2da funcion)
 * - Que hacer cuando se desconecta del servidor (3ra funcion)
 */
function Api_Ipc_CreateClient (){
  IpcClient.config.retry = IPC_CONNECTION_RETRY;
  
  IpcClient.connectTo(
      IPC_SOCKET_ID,
      function(){
          // Connection to server
          IpcClient.of.ipcSocketId.on(
              IpcTopic_t.CONNECT,
              function(){
                  console.log("[NORMAL] - Ipc_Client_CreateClient - Conected to server")
                  FlagServerConnected = true;
              }
          );
          // Set callback for disconnection to server
          IpcClient.of.ipcSocketId.on(IpcTopic_t.DISCONNECT, function(){
            console.log("[NORMAL] - Ipc_Client_DisconnectFromServer - Disconnected from server")
            FlagServerConnected = false;
          });
          // Set callback for write server buffer when receive data from socket
          IpcClient.of.ipcSocketId.on(IpcTopic_t.MESSAGE, function(data){
            Driver_Ipc_WriteServerBuffer(data);
          });
      }
  );
}

/**
 * Escribe un mensaje en label del panel de conexion (arriba a la izquierda)
 * @param  {String} messageToWrite mensaje a escribir
 */
function Api_SetConnectionStateMessage (messageToWrite) {
  PortConnectionText = messageToWrite;
}

/**
 * Envia un mensaje hacia el servidor.
 * Los mensajes a enviar al servidor en estos casos estan compuestos por este formato:
 * "{commando;request}"
 * Estos comandos estan asociados a conectarse con el servidor, dar de alta el cliente,
 * listar los puertos COM disponibles, conectarse/desconectarse a un puerto, etc.
 * Notar que dentro del switch si el comando es valido, se arma concatenando strings 
 * previamente definidos en los enums Server_..._t del encabezado de este archivo.
 * @param {String} serverCommand 
 */
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
    Driver_Ipc_SendData(IpcTopic_t.MESSAGE, dataToSend);
  }
}

/**
 * Parsea la respuesta proveniente del servidor para determinar si es una 
 * respuesta al pedido de listar los puertos. Ademas, interpreta la respuesta enviada 
 * por el servidor. Los posibles casos que se pueden dar son:
 * - Que el servidor no responda a la peticion (error).
 * - Que el servidor responda con un '0' (indicando que no hay puertos disponibles)
 * - Que el servidor responda con la lista de puertos disponibles.
 * 
 * En el caso que no haya puertos, el servidor respondera:
 * - "{list_ports;response;0}"
 * En el caso que haya el COM4 y el USB3 disponibles:
 * - "{list_ports;response;COM4;USB3}"
 * 
 * Esta respuesta se vera reflejada en el label de conexion (arriba a la izquiera) y 
 * ademas la lista de Port disponibles y Baudrate se carga con los valores recibidos.
 * 
 * @param {String} response la respuesta proveniente del servidor.
 * @returns {Boolean} true si pudo listar los puertos, sino false
 */
function Api_Server_ParseResponse_ListPorts (response){
  let isPortsListReceived = false;
  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 21 
  ){
    // Quita los caracteres de inicio y fin del comando.
    response = response.substring(1, response.length-1);
    // Realiza un split de la cadena separandola por COMMAND_SEPARATOR.
    response = response.split(COMMAND_SEPARATOR);
    // Si la respuesta del servidor coincide con el formato esperado se analiza.
    if (
      response[0] == ServerCommand_t.COMM_SERVER_LIST_PORTS && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){
      // Si no hay puertos disponibles actualiza el estado de conexion
      if (response[2] == NO_PORTS_RESPONSE){
        Api_SetConnectionStateMessage("Puertos disponibles: 0");
      } else {
        // Si hay puertos disponibles, muestra la cantidad en el estado de conexion
        Api_SetConnectionStateMessage("Puertos disponibles: " + (response.length - 2) );
        // Actualiza la lista desplegable de puertos disponibles con lo recibido desde el servidor
        for (var i = 2; i < response.length; i++){
          let portListObj = document.getElementById("PortsCont_AviablePortsList");
          let portOption = document.createElement("option");
          portOption.text = response[i];
          portListObj.add(portOption);
        }
        PortSelected = response[2];
        // Actualiza la lista desplegable de baudrate con las posibles velocidades de conexion
        BAUD_RATES_LIST.forEach(element => {
          let baudRateListObj = document.getElementById("PortsCont_AviableBaudrateList");
          let baudRateOption = document.createElement("option");
          baudRateOption.text = element;
          baudRateListObj.add(baudRateOption);
        });
        BaudRateSelected = BAUD_RATES_LIST[0];
        // Actualiza el flag de devolucion para avisar que se listaron los puertos
        isPortsListReceived = true;
      }
    }
  } else {
    // Si el mensaje recibido no tiene el formato correcto lo muestra en el estado de conexion.
    Api_SetConnectionStateMessage("No se pueden listar los puertos!");
  }
  // Devuelve el estado del flag si se pudieron listar los puertos.
  return isPortsListReceived;
}

/**
 * Cuando el usuario selecciona un puerto y baudrate y decide conectarse, presionando el boton 
 * de conexion, ese evento genera que la aplicacion le mande al servidor un request de conexion
 * con el siguiente formato:
 * - "{connect_port;request;COM;baudrate}"
 * 
 * Si el servidor puede realizar la conexion con el sistema embebido en ese puerto y baudrate devuelve:
 * - "{connect_port;response;ok}
 * En caso de no poder respondera:
 * - "{connect_port;response;error}
 * 
 * @param {String} response 
 * 
 * Luego de parsear la respuesta del servidor, la aplicacion mostrara el resultado de la funcion 
 * funcion en el estado de conexion. La funcion devuelve:
 * @param {Boolean} isConnected true si se pudo conectar, false caso contrario.
 */
function Api_Server_ParseResponse_Connect (response){
  let isConnected = false;
  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 26 
  ){
    // Quita los caracteres de inicio y fin del comando.
    response = response.substring(1, response.length-1);
    // Realiza un split de la cadena separandola por COMMAND_SEPARATOR.
    response = response.split(COMMAND_SEPARATOR);
    // Si la respuesta del servidor coincide con el formato esperado se analiza.
    if (
      response[0] == ServerCommand_t.COMM_SERVER_CONNECT_PORT && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){
      // Si el servidor respone OK, activa el flag
      if (response[2] == SERVER_OK_RESPONSE){
        Api_SetConnectionStateMessage("Conectado al sistema embebido");
        isConnected = true;
      } else {
        Api_SetConnectionStateMessage("No conectado. Error message: " + response[2]);
      }

    }
  } else {
    // Si el mensaje recibido no tiene el formato correcto lo muestra en el estado de conexion.
    Api_SetConnectionStateMessage("No se recibio respuesta de conexion");
  }
  return isConnected;
}

/**
 * Cuando el usuario decide desconectarse, presionando el boton 
 * de conexion, ese evento genera que la aplicacion le mande al servidor un request de desconexion
 * con el siguiente formato:
 * - "{disconnect_port;request;COM;baudrate}"
 * 
 * Si el servidor puede realizar la desconexion con el sistema embebido devuelve:
 * - "{disconnect_port;response;ok}
 * En caso de no poder respondera:
 * - "{disconnect_port;response;error}
 * 
 * @param {String} response 
 * 
 * Luego de parsear la respuesta del servidor, la aplicacion mostrara el resultado de la funcion 
 * en el estado de conexion. La funcion devuelve:
 * @param {Boolean} isConnected false si se pudo desconectar, true caso contrario.
 */
function Api_Server_ParseResponse_Disconnect (response){
  let isDisconnected = false;
  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 26 
  ){
    // Quita los caracteres de inicio y fin del comando.
    response = response.substring(1, response.length-1);
    // Realiza un split de la cadena separandola por COMMAND_SEPARATOR.
    response = response.split(COMMAND_SEPARATOR);
    // Si la respuesta del servidor coincide con el formato esperado se analiza.
    if (
      response[0] == ServerCommand_t.COMM_SERVER_DISCONNECT_PORT && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){
      // Si el servidor respone OK, activa el flag
      if (response[2] == SERVER_OK_RESPONSE){
        Api_SetConnectionStateMessage("Desconectado del sistema embebido");
        isDisconnected = true;
      } else {
        Api_SetConnectionStateMessage("No desconectado. Error message: " + response[2]);
      }
    }
  } else {
    // Si el mensaje recibido no tiene el formato correcto lo muestra en el estado de conexion.
    Api_SetConnectionStateMessage("No se recibio respuesta de desconexion");
  }
  return !isDisconnected;
}

/**
 * Cuando la aplicacion inicia, entre sus primeras actividades que realiza, 
 * se intenta conectar al servidor. Una vez conectado, le envia al servidor un 
 * request para que el servidor registre el socket que conecta a ambos. 
 * Para ello, la aplicacion le envia al servidor un request de alta con este formato:
 * - "{client_up;request}"
 * 
 * Si el servidor puede dar de alta y guardar correctamente el socket que une a ambos,
 * el servidor envia un response con este formato:
 * - {client_up;response;ok}
 * En caso de error, enviara:
 * - {client_up;response;error}
 * 
 * Esta funcion 
 * @param {String} response 
 */
function Api_Server_ParseResponse_Clientup (response){
  let isConnected = false;
  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    response.charAt(0) == COMMAND_INIT && 
    response.charAt(response.length-1) == COMMAND_END &&
    response.length >= 20 
  ){
    // Quita los caracteres de inicio y fin del comando.
    response = response.substring(1, response.length-1);
    // Realiza un split de la cadena separandola por COMMAND_SEPARATOR.
    response = response.split(COMMAND_SEPARATOR);
    // Si la respuesta del servidor coincide con el formato esperado se analiza.
    if (
      response[0] == ServerCommand_t.COMM_SERVER_CLIENTUP && 
      response[1] == ServerCommandType_t.TYPE_SERVER_RESPONSE && 
      response[2] != STRING_EMPTY
    ){
      // Si el servidor respone OK, activa el flag
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
    // Si el mensaje recibido no tiene el formato correcto lo muestra en el estado de conexion.
    Api_SetConnectionStateMessage("No se recibio respuesta de conexion");
  }
  return isConnected;
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
function Api_Serial_ParseCommandArrived (commString){
  var isValidCommand = false;
  // Chequea que la respuesta del servidor tenga formato correcto.
  if (
    commString.charAt(0) == COMMAND_INIT && 
    commString.charAt(2) == COMMAND_SEPARATOR && 
    commString.charAt(4) == COMMAND_SEPARATOR && 
    commString.charAt(commString.length -1) == COMMAND_END
  ){
    // Activa el flag si es un comando valido.
    isValidCommand = true;
    // Guarda en la variable "command" el comando recibido.
    let command = commString.charAt(1);
    // Guarda en la variable "periphericalMap" el periferico recibido.
    let periphericalMap = commString.charAt(3);
    // Realiza un switch del comando recibido.
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
            
            Driver_Ipc_SendData(IpcTopic_t.MESSAGE, commandResponse);
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

            Driver_Ipc_SendData(IpcTopic_t.MESSAGE, commandResponse);
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
 * Trata de conectarse al servidor.
 * Cuando la aplicacion inicia (o si por alguna razon se desconecta del servidor),
 * esta funcion realiza una serie de pasos para lograr (re)conectarse al server.
 * Al iniciar la aplicacion (en la funcion Logic_InitializeApp()), se setea un timer 
 * que dispara la ejecucion de esta funcion.
 * Como el accionar de esta funcion esta regido por los flags FlagServerConnected y 
 * FlagClientIsUp, solo se realizaran acciones en caso que sea necesario, sino se 
 * saltearan las mismas.
 */
function Logic_TryToConnectToServer (){
  // Si no esta conectado al servidor, crea el socket cliente.
  if (!FlagServerConnected){
    Api_Ipc_CreateClient();
    // Si recien se crea el cliente, el mismo no esta dado de alta, por eso pone en false.
    FlagClientIsUp = false;
  }
  // Si el cliente no esta dado de alta, realiza las acciones pertinentes...
  if (!FlagClientIsUp){
    // Envia el request para dar de alta el cliente
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_CLIENTUP);
    // Lee el ServerBuffer con la posible respuesta que envio el servidor
    let commandReceived = Driver_Ipc_ReadServerBuffer();
    // Chequea que el buffer no este vacio
    if (commandReceived != STRING_EMPTY){
      // Limpia el buffer ServerBuffer
      Driver_Ipc_WriteServerBuffer(STRING_EMPTY);
      // Llama a la funcion para determinar si realmente se pudo dar de alta el cliente
      FlagClientIsUp = Api_Server_ParseResponse_Clientup(commandReceived);
      // Muestra el estado del flag por consola.
      console.log("[DEBUG] - Logic_TryToConnectToServer - Clientup: " + FlagClientIsUp);
    }
  }
}

/**
 * Trata de listar los puertos disponibles.
 * Esta funcion se dispara periodicamente.
 * Para que se ejecuten sus acciones, primero es necesario que exista conexion
 * con el servidor, y ademas, el cliente este dado de alta.
 */
function Logic_TryToListPorts (){
  if (FlagServerConnected && FlagClientIsUp){
    if (!FlagPortsListed){
      console.log("Tratando de listar los puertos");
      Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_LIST_PORTS);
      let commandReceived = Driver_Ipc_ReadServerBuffer();
      FlagPortsListed = Api_Server_ParseResponse_ListPorts(commandReceived);
    }
  }
}

/**
 * Trata de conectase al puerto y baudrate seleccionados por el usuario.
 * Esta funcion se dispara cuando el usuario presiona el boton de conexion/desconexion.
 * Para que se ejecuten sus acciones, es necesario que exista conexion con el 
 * servidor, el cliente este dado de alta y los puertos esten listados.
 */
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

/**
 * Trata de desconectase del puerto seleccionado por el usuario.
 * Esta funcion se dispara cuando el usuario presiona el boton de conexion/desconexion.
 * Para que se ejecuten sus acciones, es necesario que exista conexion con el 
 * servidor, el cliente este dado de alta, los puertos esten listados y este conectado
 * al sistema embebido.
 */
function Logic_TryToDisconnectPort (){
  // Chequea todos los flags.
  if (FlagServerConnected && FlagClientIsUp && FlagPortsListed && FlagEmbeddedSysConnected){
    console.log("Intentando desconectar...");
    // Envia el comando de desconexion al servidor
    Api_Server_SendCommand(ServerCommand_t.COMM_SERVER_DISCONNECT_PORT);
    let commandReceived = Driver_Ipc_ReadServerBuffer();
    if (commandReceived != STRING_EMPTY){
      // Se paresea la respuesta
      FlagEmbeddedSysConnected = Api_Server_ParseResponse_Disconnect(commandReceived);
      Driver_Ipc_WriteServerBuffer(STRING_EMPTY); 
      // Si se pudo desconectar correctamente....
      if (!FlagEmbeddedSysConnected){
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
        // Setea el flag de puertos no listados para que se vuelvan a listar.
        FlagPortsListed = false;
      }
    }
  } else {
    console.log("Para desconectar primero debe estar conectado");
  }
}

/**
 * Esta funcion chequea periodicamente si llegaron comandos provenientes del sistema embebidos.
 * Se dispara periodicamente ya que en la funcion Logic_InitializaApp() se setea un intervalo 
 * que dispara esta funcion.
 * Notar que se realizara el chequeo si llegaron nuevos datos unicamente si se esta conectado 
 * al servidor, si el cliente esta dado de alta, si estan listados los puertos y si se esta 
 * conectado al sistema embebido. En casi contrario, no se chequea nada.
 */
function Logic_CheckIfPeriphericalCommand (){
  if (FlagServerConnected && FlagClientIsUp && FlagPortsListed && FlagEmbeddedSysConnected){
    var dataFromServer = Driver_Ipc_ReadServerBuffer();
    console.log("[DEBUG] - Logic_CheckIfPeriphericalCommand - Llego: '" + dataFromServer + "'");
    if (dataFromServer != STRING_EMPTY){
      console.log("[DEBUG] - Logic_CheckIfPeriphericalCommand - Chequeando si es valido");
      let isValidCommand = Api_Serial_ParseCommandArrived(dataFromServer);
      if (isValidCommand){
        console.log("[DEBUG] - Logic_CheckIfPeriphericalCommand - Es un comando valido");
        Driver_Ipc_WriteServerBuffer (STRING_EMPTY);
      }
    }
  }
}

/**
 * Inicializa la aplicacion. Esta funcion es llamada al inicio del archivo.
 * Basicamente las opraciones que realiza son darles comportamiento a los 
 * objetos HTML obtenidos desde el document y asociar algunas variables a esos objetos.
 * Por otro lado, setea los timers para disparar las acciones periodicas requeridas 
 * por la aplicacion.
 */
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





