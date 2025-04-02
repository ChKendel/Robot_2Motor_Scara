const WebSocket = require('../node_modules/ws');


class SimWebSocket {

    constructor(server, receiver){

        this.Logger = require('./../services/Logger.js')

        this.wss = new WebSocket.Server({ server });

        this.totalNr = 0;
        this.lastNrChange = new Array();

        this.logger = null;

        this.wss.on('connection', (ws) => {
            
            if(ws.Number == undefined){
                ws.Number = this.totalNr++;
                this.lastNrChange.push(Date.now()-10000)
            }
            console.log(`New WS from (${ws.remoteAddress}) [${this.wss.remoteAddress}]  connected. Internally: Nr=${ws.Number} at time=${this.lastNrChange[ws.Number]}` );
            this.Logger.getInstance().log(`WSS from (${ws.remoteAddress}) [${this.wss.remoteAddress}]  connected. Internally: Nr=${ws.Number}`);

            ws.isAlive = true;
            ws.simNr = 0;

            ws.send(`{"Message":"Connected to default","simNr":"${ws.simNr}", "xMotor":"${receiver.x[ws.simNr]}", "zMotor":"${receiver.z[ws.simNr]}"}`)

            ws.on('message', (message) => {
                //console.log(`Received message: ${message}`);
                ws.send(`Server received: ${message}`);
                ws.isAlive = true;
                
                if(message.includes("simNr=")){
                    this.Logger.getInstance().log(`WSS Nr=${ws.Number} wants change SimNr: ${message}`);
                    try{
                        if(Date.now() > this.lastNrChange[ws.Number] + 10000){
                            ws.simNr = Number(String(message).split("mNr=")[1]);
                            this.lastNrChange[ws.Number] = Date.now();
                        }
                        else{
                            console.warn(`WS ${ws.Number}  trys to change simNr too fast`)
                        }
                    }
                    catch(e){
                        console.log(e)
                        console.log("WS caused Problem. SimNr was no Nr  or did not end with Nr.")
                    }
                    console.log(`WS ${ws.Number} send command to change SimNr to ${ws.simNr}`);
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
                console.log(`Client ${ws.Number} disconnected`);
                this.Logger.getInstance().log(`WSS Nr=${ws.Number} disconnected`);
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