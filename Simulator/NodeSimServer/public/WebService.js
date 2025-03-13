
startTime = Date.now();



const wsUrl = new URL(document.location);
wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');
wsUrl.pathname = 'echo';

const socket = new WebSocket(wsUrl.toString());
reconnectInterval= null;
  

socket.onopen = () => { console.log('Connected');  
                        window.WSSocket = socket;
                        clearInterval(reconnectInterval);
                        pingInterval = setInterval(() => {  lastPingRequest = Date.now();
                                                                        socket.send("Ping");
                                                                     }, 5000)};    

socket.onclose = (event) => { 
    console.log((event.wasClean) ? 'Disconnected' :  'Connection break: ' + (event.reason || event.code)); 
    clearInterval(pingInterval);
    window.WSSocket = null;
    /*
    reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect...');
        const newSocket = new WebSocket(wsUrl.toString());
        newSocket.onopen = socket.onopen;
        newSocket.onclose = socket.onclose;
        newSocket.onmessage = socket.onmessage;
        socket = newSocket;
    }, 5000); // Attempt to reconnect every 5 seconds
    */
}


socket.onmessage = (event) => {
    console.log("message:", event.data);
    if(!event.data.includes("{")){return;}
    const obj = JSON.parse(event.data);
    console.log("Daten werden ausgelesen: ", obj.xMotor, obj.zMotor);
    window.xGloablMotor = obj.xMotor;
    window.zGloablMotor = obj.zMotor;
}

socket.onerror = (err) => console.error(err.message);
