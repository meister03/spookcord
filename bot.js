const ScaleCord = require('scalecord.ts'); // invokes usage of Discordeno
const {ClusterClient, getInfo} = require("discord-hybrid-sharding");
const config = require('./config.json'); // env on production
const mongoose = require('mongoose');

const eventManager =  new (require('./Managers/EventManager.js'))();

const client = ScaleCord.enableCachePlugin(new ScaleCord.createBot({
    token: config.token,
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMessageReactions", "GuildMembers"].reduce((bits, next) => (bits |= ScaleCord.Intents[next]), 0),
    events: eventManager.load()
}, {
/*     gateway:new ScaleCord.GatewayClientProvider({
        secretKey: '111',
        customUrl: 'http://localhost:3001',
    }) */
}), 
{
    guilds: {
        properties: [
            'id',
            'ownerId',
            'name',
            'memberCount',
            'members',
            'roles',
            'channels'
        ],
    },
    roles: {
        properties: ['id', 'name', 'permissions', 'toggles', 'position'],
    },
    channels: {
        maxSize: 0,
    },
    users: {
        maxSize: 0,
        forceSetFilter: (key, value) => {
            // @ts-ignore
            if (key === `${client.id}`) return true;
            // @ts-ignore
            if (key === `${client.id}${value?.guildId}`) return true;
            return false;
        }
    },
    members: {
        maxSize: 0,
        forceSetFilter: (key, value) => {
            // @ts-ignore
            if (key === `${client.id}`) return true;
            // @ts-ignore
            if (key === `${client.id}${value?.guildId}`) return true;
            return false;
        }
    },
    emojis: {
        maxSize: 0,
    },
    threads: {
        maxSize: 0,
    },
    messages: {
        maxSize: 0,
    },
    stageInstances: {
        maxSize: 0,
    },
    allowedMentions: true,
})

client.cluster = new ClusterClient(client);
client.config = config; // Removed from production and parsed from Node.ENV
connecttodb(config.url) // Replace with Env on production

// Assign Managers
eventManager.client = client;
client.eventListener = eventManager;
client.userCache = new (require('./Modules/user/user'))(client);
client.userCache.load();

client.configCache = new (require('./Modules/config/config'))(client);
client.configCache.load();

client.commands = new (require('./Managers/CommandManager.js'))(client);
client.commands.load();

client.messageCreator =  new (require('./Modules/message.js'))(client);

//client.gateway?.start()
// Start Gateway with Cluster Information
client.helpers.getGatewayBot().then(e => {
    console.log(
        `[ClusterClient] ID: ${client.cluster.id}`
        + `\nRecommended Shards: ${e.shards}`
        + `\nSession Remaining: ${e.sessionStartLimit.remaining}`
        + `\nTotal Shards: ${getInfo().TOTAL_SHARDS}`
        + `\nShardList: [${getInfo().LAST_SHARD_ID}, ..., ${getInfo().FIRST_SHARD_ID}]`
    );
    client.botGatewayData = e;
    client.gateway.gatewayBot = client.botGatewayData;
    client.gateway.manager.totalShards = getInfo().TOTAL_SHARDS;
    client.gateway.firstShardId = getInfo().FIRST_SHARD_ID;
    client.gateway.lastShardId = getInfo().LAST_SHARD_ID;
    client.gateway.maxShards = getInfo().TOTAL_SHARDS;
    ScaleCord.startBot(client);
})



// Readable  Rest Error
const { convertRestError } = client.rest;
client.rest.convertRestError = (stack, data = {}) => {
    stack = convertRestError(stack, data);
    stack.errors = data?.body ? flattenErrors(data.body.errors || data.body) : [];
    stack.code = stack.errors?.[0]?.replace(/[^0-9]/g, '') || JSON.parse(data?.body ?? {}).code;
    if(stack.code) stack.code = Number(stack.code);
    return stack;
}
function flattenErrors(obj, key = '') {
    obj = JSON.parse(obj);
    let messages = [];
    if (!obj.errors) {
        messages.push(`[${obj.code}] ${obj.message}`)
        return messages;
    };
    messages = subErrors(obj.errors);
    return messages;
}


function subErrors(obj, subpath = '') {
    let messages = [];
    for (let i in obj) {
        // console.log(obj[path])
        //CHeck sub path
        const path = i;
        if (obj[path].hasOwnProperty('_errors')) {
            const sub = obj[path]._errors.map(e => {
                return `${subpath}${path}: [${e.code}] ${e.message}`
            })
            messages = messages.concat(sub)
        } else {
            const message = obj[path].message;
            const code = obj[path].code;
            if (!code && !message) {
                //console.log(subErrors(obj[path], `${path}:`))
                messages = messages.concat(subErrors(obj[path], `${subpath}${path}:`))
            } else messages.push(`${subpath}${path}: [${code}] ${message}`);
        }
    }
    return messages;
}

async function connecttodb(dbUrl) {
    if (!dbUrl) throw new TypeError("A database url was not provided.");
    return mongoose.connect(dbUrl, {
    }).then(e => e);
}


/* let userids = ['827536878915944469', '931201621755576410', '683630053686378498', '340243638892101646', '442355791412854784', '270010330782892032', '869912554120577045', '713358663925891155'];
for(let i = 0; i < userids.length; i++) {
    const user = await client.users.fetch(userids[i]);

    const cUser = await client.userCache.create({userid: user.id, username: user.tag, useravatar: user.avatarURL()})
    const treats = []
    for(let i = 0; i < 5; i++) {
        // Random Number between 0 and 10
        treats.push(Math.floor(Math.random() * 10))
    }
    for(let i = 0; i < treats.length; i++) {
        cUser.storage.carrable[String(i)] += treats[i];
    }

    // Random Boolean
    if(Math.random() < 0.5) {
        cUser.weapons.push(Math.floor(Math.random() * 2))
    }
    // Random Boolean
    if(Math.random() < 0.5) {
        cUser.monsters.push(Math.floor(Math.random() * 4))
    }

    if(Math.random() < 0.5) {
        cUser.house = true;
        cUser.storage.treasure.unlocked = true;
        cUser.storage.treasure.capacity = 100;
        for(let i = 0; i < treats.length; i++) {
            cUser.storage.treasure[String(i)] += treats[i];
        }
    }

    client.userCache.update(cUser);
} */