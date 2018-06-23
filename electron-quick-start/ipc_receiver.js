var IpcServer = require('node-ipc');

Ipc_Server_CreateServer()
    

function Ipc_Server_ReceiveData (data,socket){
    IpcServer.log('got a message : '.debug, data);
    Ipc_Server_SendData (socket, data)
}

function Ipc_Server_SendData (socket, data){
    IpcServer.server.emit(
        socket,
        'message',  //this can be anything you want so long as
                    //your client knows.
        data + ' world!'
    );
}

function Ipc_Server_DisconectClient (socket, destroyedSocketID){
    IpcServer.log('client ' + destroyedSocketID + ' has disconnected!');
}

function Ipc_Server_CreateServer (){
    IpcServer.config.id   = 'world';
    IpcServer.config.retry= 1500;

    IpcServer.serve(
        function(){
            IpcServer.server.on(
                'message',
                (data,socket) =>
                Ipc_Server_ReceiveData(data,socket)
            );
			IpcServer.server.on(
                'socket.disconnected',
                (socket, destroyedSocketID) =>
                Ipc_Server_DisconectClient(socket, destroyedSocketID) 
			);
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