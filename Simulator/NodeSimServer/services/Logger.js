const fs = require('fs');
const path = require('path');

class Logger{

    constructor() {
        const date = new Date();
        const fileName = `Log-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
        this.filePath = path.resolve(__dirname,"..","logs", fileName);

        fs.writeFile(this.filePath, '', { flag: 'a' }, (err) => {
            if (err) { console.error('Failed to create log file:', err);  }
        });
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}\n`;
        
        fs.appendFile(this.filePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }

    static getInstance() {
        if (!Logger.instance) {
            Date.now().toString
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

module.exports = Logger