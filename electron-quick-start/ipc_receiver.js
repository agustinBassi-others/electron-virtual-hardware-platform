var IpcServer = require('node-ipc');


const IPC_TOPIC_MESSAGE    = 'message'
const IPC_TOPIC_DISCONNECT = 'socket.disconnected'

const IPC_SOCKET_ID        = 'ipcSocketId'
const IPC_CONNECTION_RETRY = 1500

Ipc_Server_CreateServer()

function Ipc_Server_CallbackReceiveData (data, socket){
    console.log("[DEBUG] - Ipc_Server_ReceiveData - Receive from client: " + data)
    Ipc_Server_SendData (socket, 'Saludo desde el servidor')
}

function Ipc_Server_SendData (socket, data){
    console.log("[DEBUG] - Ipc_Server_SendData - Sending to client: " + data)
    IpcServer.server.emit(socket, IPC_TOPIC_MESSAGE, data);
}

function Ipc_Server_CallbackDisconectedClient (){
    console.log("[NORMAL] - Ipc_Server_CallbackDisconectedClient - The client has been disconnected!")
}

function Ipc_Server_CreateServer (){
    IpcServer.config.id   = IPC_SOCKET_ID;
    IpcServer.config.retry= IPC_CONNECTION_RETRY;

    IpcServer.serve(
        function(){
            IpcServer.server.on(IPC_TOPIC_MESSAGE, (data,socket) => Ipc_Server_CallbackReceiveData(data,socket) );
			IpcServer.server.on(IPC_TOPIC_DISCONNECT, () => Ipc_Server_CallbackDisconectedClient() );
        }
    );

    IpcServer.server.start();
}












// var ipc = require("crocket"),
// server = new ipc();

// // Start listening, this example communicate by file sockets
// server.listen({ "path": "/tmp/crocket-ipc-test.sock" }, (e) => { 

// // Fatal errors are supplied as the first parameter to callback
// if(e) throw e; 

// // All is well if we got this far
// console.log('IPC listening on /tmp/crocket-test.sock');

// });
// // Events are handled by EventEmitter by default ...
// server.on('/request/food', function (payload) {
// // Respond to the query
// server.emit('/response', 'You asked for food and supplied ' + payload);
// });

// // React to communication errors
// server.on('error', (e) => { console.error('Communication error occurred: ', e); });












// const ipc = require('node-ipc');

// ipc.config.id = 'a-unique-process-name1';
// ipc.config.retry = 1500;
// ipc.config.silent = true;
// ipc.serve(() => ipc.server.on('a-unique-message-name', message => {
//   console.log(message);
// }));
// ipc.server.start();