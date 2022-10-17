const fs = require('fs');
const path = require('path');
const resolveFolder = folderName => path.resolve(__dirname, ".", folderName);

const { EventEmitter } = require('events');

class EventManager extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;       
        this.allEvents = {};
    } 
    load() {
        const eventsFolder = resolveFolder("../Events");
        let i = 0;
        fs.readdirSync(eventsFolder).map(async (file) => {
            if (!file.endsWith(".js")) return;
            i++
            const fileName = path.join(eventsFolder, file);
            const event = require(fileName);
            const eventName = file.split(".")[0];
            
            this.allEvents[`${eventName}`] = (...args) => {
                this.emit(eventName, ...args);
                return event(...args);
            };
        });
        console.log(`[Loaded Events] ${i}`);
        return this.allEvents;
    }

    reload(eventName) {
        if (!eventName) return;
        const file = path.join(__dirname, '..', `events`, `${eventName}.js`);
        delete require.cache[require.resolve(file)];
        const event = require(file);
        if (Array.isArray(this.allEvents[eventName])) {
            this.allEvents[eventName] = (...args) => {
                this.emit(eventName, ...args);
                return event(...args);
            };
        } else {
            this.allEvents[eventName] = (...args) => {
                this.emit(eventName, ...args);
                return event(...args);
            };
        }
        console.log(`[Reloaded Event] ${eventName}`);
        return event;
    }

    reloadAll() {
        const eventsFolder = resolveFolder("../events");
        fs.readdir(eventsFolder, async (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                const eventName = file.split(".")[0];
                this.reload(eventName)
            });
        });
    }
}
module.exports = EventManager;