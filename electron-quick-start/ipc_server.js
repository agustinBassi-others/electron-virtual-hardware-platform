/*==================[inclusions]=============================================*/

var IpcServer = require('node-ipc');

/*==================[macros]=================================================*/

const IPC_TOPIC_MESSAGE             = 'message'
const IPC_TOPIC_DISCONNECT          = 'socket.disconnected'

const IPC_SOCKET_ID                 = 'ipcSocketId'
const IPC_CONNECTION_RETRY          = 1500

const REQUEST_CLIENTUP              = "{client_up;request}"
const RESPONSE_CLIENTUP_OK          = "{client_up;response;ok}"
const RESPONSE_CLIENTUP_ERR         = "{client_up;response;error}"

const REQUEST_LIST_PORTS            = "{list_ports;request}"
const RESPONSE_LIST_PORTS_OK        = "{list_ports;response;COM4;USB3}"
const RESPONSE_LIST_PORTS_ERR       = "{list_ports;response;error}"

const REQUEST_CONNECT_PORT          = "{connect_port;request;COM4;9600}"
const RESPONSE_CONNECT_PORTS_OK     = "{connect_port;response;ok}"
const RESPONSE_CONNECT_PORTS_ERR    = "{connect_port;response;error}"

const REQUEST_DISCONNECT_PORTS      = "{disconnect_port;request}"
const RESPONSE_DISCONNECT_PORTS_OK  = "{disconnect_port;response;ok}"
const RESPONSE_DISCONNECT_PORTS_ERR = "{disconnect_port;response;error}"

/*==================[internal data declaration]==============================*/

var IpcSocketFd            = 0;

/*==================[Objects events and initialization]=========================*/

Ipc_Server_CreateServer()

/*==================[internal function declaration]==========================*/

function Mock_ServerResponses (clientRequest){
    if (clientRequest == REQUEST_CLIENTUP){
        Ipc_Server_SendData (RESPONSE_CLIENTUP_OK);
    } else if (clientRequest == REQUEST_LIST_PORTS){
        Ipc_Server_SendData (RESPONSE_LIST_PORTS_OK);
    } else if (clientRequest == REQUEST_CONNECT_PORT){
        Ipc_Server_SendData (RESPONSE_CONNECT_PORTS_OK);
    } else if (clientRequest == REQUEST_DISCONNECT_PORTS){
        Ipc_Server_SendData (RESPONSE_DISCONNECT_PORTS_OK);
    } 
}

function Ipc_Server_CallbackReceiveData (data, socket){
    if (IpcSocketFd == 0){
        console.log("[DEBUG] - Ipc_Server_ReceiveData - Inicializando el socket global") 
        IpcSocketFd = socket;
    }
    Mock_ServerResponses (data);
}

function Ipc_Server_SendData (data){
    console.log("[DEBUG] - Ipc_Server_SendData - Sending to client: " + data)
    IpcServer.server.emit(IpcSocketFd, IPC_TOPIC_MESSAGE, data);
}

function Ipc_Server_CallbackDisconectedClient (){
    console.log("[NORMAL] - Ipc_Server_CallbackDisconectedClient - The client has been disconnected!")
    IpcSocketFd = 0;
}

function Ipc_Server_CreateServer (){
    IpcServer.config.id   = IPC_SOCKET_ID;
    IpcServer.config.retry= IPC_CONNECTION_RETRY;

    IpcServer.serve(function(){
        IpcServer.server.on(IPC_TOPIC_MESSAGE,      (data,socket) =>    Ipc_Server_CallbackReceiveData (data, socket) );
        IpcServer.server.on(IPC_TOPIC_DISCONNECT,   () =>               Ipc_Server_CallbackDisconectedClient() );
    });

    IpcServer.server.start();
}



// Readline lets us tap into the process events
const readline = require('readline');

Serial_InitKeyListener();

function Serial_InitKeyListener (){
    // Allows us to listen for events from stdin
    readline.emitKeypressEvents(process.stdin);
    // Raw mode gets rid of standard keypress events and other
    // functionality Node.js adds by default
    process.stdin.setRawMode(true);
    var SerialBuffer = "";
    // Start the keypress listener for the process
    process.stdin.on('keypress', (str, key) => {

        let keyPressed = key.sequence

        if(keyPressed === '\n' || keyPressed === '\r') {
            console.log("Se va a enviar por el socket: " + SerialBuffer)
            Ipc_Server_SendData(SerialBuffer)
            SerialBuffer = "";
        } else if(keyPressed === '\t') {
            process.exit();
        } else {
            SerialBuffer = SerialBuffer + keyPressed;
        }
    });
}
