const Schema = require('./schema');
class Config {
    constructor(client){
        this.client = client;
        this.cache = new Map();
    }
    async load(){
        const configs = await Schema.find({});
        configs.forEach(config => {
            this.cache.set(config.guildid, config.channelid);
        });
    }

    async find(guildid){
        const config = this.cache.get(guildid);
        if(config) return config;
        const newConfig = await Schema.findOne({guildid});
        if(newConfig){
            this.cache.set(guildid, newConfig.channelid);
            return newConfig;
        }
        return null;
    }

    async create({guildid, channelid}){
        let config = await this.find(guildid);
        if(!config) {
            config = await Schema.create({guildid});
        }
        config.channelid = channelid;
        await config.save();
        this.cache.set(guildid, config.channelid);
        return config;
    }

    async delete(guildid){
        const config = await Schema.findOne({guildid});
        await config.delete();
        return this.cache.delete(config.guildid);
    }
}
module.exports = Config;