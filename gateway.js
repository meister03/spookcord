const { GatewayServerProvider,Server} = require('scalecord.ts'); // change to lib import
const { GatewayIntents } = require('discordeno/types');
const config = require('./config.json')
const server = new Server({
    token: config.token,
    providers: {
        gateway: new GatewayServerProvider({
            secretKey: '111',
            customUrl: 'http://localhost:3001',
            intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
            totalMachines: 1,
        })
    }
})

server.gateway?.start()