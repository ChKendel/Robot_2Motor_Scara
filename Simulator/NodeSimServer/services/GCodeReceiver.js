class GCodeReceiver{

    constructor(){
      
        var maxSimNr = process.env.RUN_MAX_SIM_COUNT || 25

        this.x = Array(maxSimNr).fill(0);
        this.z = Array(maxSimNr).fill(0);

        console.log(this.x[0], maxSimNr); 
    }

    receive(message, simNr = 0){
        if(message == "?"){
            return ":"+String(this.x[simNr])+", ,"+String(this.z[simNr]);
        }
        if(message == null || message=="Ping"){return;}
        if(String(message).length < 3){return;}
        let g = String(message).split(" ");
        let x, z, c = NaN;

        if((g[0] == "G1" || g[0] == "G0")){
          g.forEach((s) => { 
            if(s.includes("X")){ this.x[simNr]  = Number(s.substring(1, s.length));}
            if(s.includes("x")){ this.x[simNr]  = Number(s.substring(1, s.length));}
            if(s.includes("Z")){ this.z[simNr]  = Number(s.substring(1, s.length));}
            if(s.includes("z")){ this.z[simNr]  = Number(s.substring(1, s.length));}
          });
        }
        console.log("Empfangen: ", g, simNr, this.z[simNr]);
        return(`{"Message":"GCode message received","simNr":"${simNr}", "xMotor":"${this.x[simNr]}", "zMotor":"${this.z[simNr]}"}`);
    }

}


module.exports = GCodeReceiver 
