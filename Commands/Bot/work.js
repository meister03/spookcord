const BaseCommand = require('../../Structures/BaseCommand.js');

const { Component } = require('scalecord.ts');
const Constants = require('../../Structures/Constants.js');

class work extends BaseCommand {
    static name = 'work';
    static description = 'Earn some trick or treats by working every hour';
    static category = 'Bot';
    static slashcommand = {
        name: 'work',
        description: 'Earn some trick or treats by working every hour',
        options: [],
    };
    static slash = { name: "work", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);
        if(user.lastWorkedAt) {
            if(user.lastWorkedAt + 3600000 > Date.now()) {
               return this.reject(`**You can claim your next ${this.client.commands.cache.get('work').slash.mention} <t:${(user.lastWorkedAt/1000 + 60*60).toFixed(0)}:R> **`)
            }
        }
        user.lastWorkedAt = Date.now();

        const workMessages = [
            "You worked as a cashier at a local store and earned 4 trick or treats.",
            "You collected the garbage and earned 4 trick or treats.",
            "You helped your neighbor with their yard work and earned 4 trick or treats.",
            "You washed your neighbor's car and earned 4 trick or treats.",
            "You washed the dishes at a local restaurant and earned 4 trick or treats.",
            "You worked at a local candy store and earned 4 trick or treats.",
        ];

        const randomMessage = workMessages[Math.floor(Math.random() * workMessages.length)];

        const treats = [0, 0,1,1,2];
        const totalTreats = [];

        for(let i = 0; i < treats.length; i++) {
            user.storage.carrable[String(i)] += treats[i];
            if(treats[i]) totalTreats.push(`${treats[i]}x ${Constants.TREAT[i].name} ${Constants.TREAT[i].emoji}`)
        }
        const treatEmbed = new Discord.Embed();
        treatEmbed.setAuthor({name: randomMessage, iconUrl: this.user.avatarURL()});
        
        treatEmbed.setDescription('**__Treats:__ ' + totalTreats.join(', ') + '**')
        treatEmbed.setColor('#00BFFF')
        
        client.userCache.update(user);

        return interaction.reply({embeds: [treatEmbed]});
    
    }
}
module.exports = work;