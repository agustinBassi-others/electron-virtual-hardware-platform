var IpcServer = require('node-ipc');

const IPC_TOPIC_MESSAGE    = 'message'
const IPC_TOPIC_DISCONNECT = 'socket.disconnected'

const IPC_SOCKET_ID        = 'ipcSocketId'
const IPC_CONNECTION_RETRY = 1500

const IPC_CLIENTUP_REQ     = "{client_up;request}"
const IPC_CLIENTUP_RES_OK  = "{client_up;response;ok}"
const IPC_CLIENTUP_RES_ERR = "{client_up;response;error}"

var IpcSocketFd            = 0;

Ipc_Server_CreateServer()

function Ipc_Server_CallbackReceiveData (data, socket){
    if (IpcSocketFd == 0){
        console.log("[DEBUG] - Ipc_Server_ReceiveData - Inicializando el socket global") 
        IpcSocketFd = socket;
    }
    if (data == IPC_CLIENTUP_REQ){
        console.log("[DEBUG] - Ipc_Server_CallbackReceiveData - Client connected.");
        Ipc_Server_SendData (IPC_CLIENTUP_RES_OK);
    } else {
        console.log("[DEBUG] - Ipc_Server_ReceiveData - Receive from client: " + data) 
    }
    
}

function Ipc_Server_SendData (data){
    console.log("[DEBUG] - Ipc_Server_SendData - Sending to client: " + data)
    IpcServer.server.emit(IpcSocketFd, IPC_TOPIC_MESSAGE, data);
}

function Ipc_Server_CallbackDisconectedClient (){
    console.log("[NORMAL] - Ipc_Server_CallbackDisconectedClient - The client has been disconnected!")
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
