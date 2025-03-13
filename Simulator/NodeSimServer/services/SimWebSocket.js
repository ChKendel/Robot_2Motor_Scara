const WebSocket = require('../node_modules/ws');


class SimWebSocket {

    constructor(server, receiver){
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws) => {
            console.log(`New client (${ws.remoteAddress})  connected.`);
            ws.isAlive = true;
            ws.simNr = 0;

            ws.send(`{"Message":"Connected to default","simNr":"${ws.simNr}", "xMotor":"${receiver.x[ws.simNr]}", "zMotor":"${receiver.z[ws.simNr]}"}`)

            ws.on('message', (message) => {
                console.log(`Received message: ${message}`);
                ws.send(`Server received: ${message}`);
                ws.isAlive = true;
                
                if(message.includes("simNr=")){
                    ws.simNr = Number(String(message).split("mNr=")[1]);
                    console.log("WS changed SimNr");
                }

                const reply = receiver.receive(message, ws.simNr);
                this.wss.clients.forEach(function (client) 
                {
                    if (client.readyState == WebSocket.OPEN && client.simNr == ws.simNr && reply != undefined){  
                        client.send(reply);
                    }
                });
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });

        this.interval = setInterval(() => {
            this.wss.clients.forEach((client) => {
                if (!client.isAlive){
                    console.log(`WSS client  disconnected`);
                    return client.terminate();
                }
                client.isAlive = false;
            });
        }, 10000);

    }

}

module.exports = SimWebSocket 