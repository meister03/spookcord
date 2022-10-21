const BaseCommand = require('../../Structures/BaseCommand.js');

const { Component } = require('scalecord.ts');
const Constants = require('../../Structures/Constants.js');

class trickortreat extends BaseCommand {
    static name = 'trickortreat';
    static description = 'Earn some trick or treats by knocking on random doors or attacking someone';
    static category = 'Bot';
    static slashcommand = {
        name: 'trickortreat',
        description: 'Earn some trick or treats by knocking on random doors or attacking someone',
        options: [],
    };
    static slash = { name: "trickortreat", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            return this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }

        const user = client.userCache.cache.get(this.user.id);
        if(user.lastKnockedAt) {
            if(user.lastKnockedAt + 60000 > Date.now()) {
                return this.reject(`**You can knock on another door <t:${(user.lastKnockedAt/1000 + 60*10).toFixed(0)}:R> **`)
            }
        }

        const users = [...client.userCache.cache.values()].filter(u => u.userid !== this.user.id && ((u.lastKnockedFromAt || 0) + 60000*10) <  Date.now());
        if(users.length === 0) {
            return this.reject(`**There are no users to knock on their door**`)
        }
        
        const lastRecentUsers = users.sort((a, b) => a.lastKnockedFromAt - b.lastKnockedFromAt).slice(0, 5).sort((a, b) => getCandyAmount(a) - getCandyAmount(b));
        const randomUser = lastRecentUsers[Math.floor(Math.random() * lastRecentUsers.length)];

        if(!randomUser) {
            return this.reject(`**There are no users to knock on their door**`)
        }

        const attackCooldown = (randomUser.lastAttackedFromAt || 0) + 60000*60;
        let attackCooldownState = true;
        if(attackCooldown < Date.now()) {
            attackCooldownState = false;
        }
        const lastAttackedAt = (user.lastAttackedAt || 0) + 60000*60;
        if(lastAttackedAt > Date.now()) {
            attackCooldownState = true;
        }

        client.messageCreator.houseEmbed({usertag: randomUser.username, avatarurl: randomUser.useravatar, userid: randomUser.userid, channelid: this.channel.id, interaction: this.interaction , attackCooldown: attackCooldownState})
    }
}
module.exports = trickortreat;

function getCandyAmount(user) {
    let amount = 0;
    for(let i = 0; i < 5; i++) {
        amount += user.storage.carrable[String(i)] * Constants.TREAT[i].rank
    }
    return amount;
}