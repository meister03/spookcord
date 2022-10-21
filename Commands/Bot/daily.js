const BaseCommand = require('../../Structures/BaseCommand.js');
const Constants = require('../../Structures/Constants.js');
const { Component } = require('scalecord.ts');

class daily extends BaseCommand {
    static name = 'daily';
    static description = 'Get your daily treats';
    static category = 'Bot';
    static slashcommand = {
        name: 'daily',
        description: 'Get your daily treats',
        options: [],
    };
    static slash = { name: "daily", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            return this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);
        if(user.lastDailyAt) {
            if(user.lastDailyAt + 86400000 > Date.now()) {
               return this.reject(`**You can claim your next ${this.client.commands.cache.get('daily').slash.mention} treats <t:${(user.lastDailyAt/1000 + 60*60*24).toFixed(0)}:R> **`)
            }
        }
        user.lastDailyAt = Date.now();
        const treats = [8, 4,3,2,1];
        const totalTreats = [];

        for(let i = 0; i < treats.length; i++) {
            user.storage.carrable[String(i)] += treats[i];
            totalTreats.push(`${treats[i]}x ${Constants.TREAT[i].name} ${Constants.TREAT[i].emoji}`)
        }
        const treatEmbed = new Discord.Embed();
        treatEmbed.setTitle('Daily Treats');
        treatEmbed.setDescription('**' + totalTreats.join('\n') + '**')
        treatEmbed.setColor('#00BFFF')
        
        client.userCache.update(user);

        return this.reply({embeds: [treatEmbed]});
    }
}
module.exports = daily;