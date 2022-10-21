const BaseCommand = require('../../Structures/BaseCommand.js');

const { Component } = require('scalecord.ts');
const Constants = require('../../Structures/Constants.js');

class profile extends BaseCommand {
    static name = 'profile';
    static description = 'Get some info about your balance and inventory or other users balance';
    static category = 'Bot';
    static slashcommand = {
        name: 'profile',
        description: 'Get some info about your balance and inventory or other users balance',
        options: [{
            name: 'user',
            description: 'The user you want to get the profile of',
            type: 6,
            required: false
        }],
    };
    static slash = { name: "profile", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            return this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }

        let userId = '';
        if(interaction.data.options?.[0]?.value) {
            userId = interaction.data.options[0].value;
        } else {
            userId = this.user.id;
        }

        const user = client.userCache.cache.get(userId);
        if(!user) {
            return this.reject(`**The mentioned user does not has a profile**`)
        }

        const embed = new Discord.Embed();
        embed.setAuthor({ name: `${user.username}'s Profile`, iconUrl: user.useravatar});

        let totalValue = 0;
        let totalStorageValue = 0;
        let totalCandy = 0;
        let totalStorage = 0;
        const totalTreats = [];
        for(let i = 0; i < 5; i++) {
            totalTreats.push(`${user.storage.carrable[String(i)]}x ${Constants.TREAT[i].name} ${Constants.TREAT[i].emoji}`)
            totalValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
            totalCandy += user.storage.carrable[String(i)];
        }
        totalTreats.push(`**Value: ${totalValue} 🪙**`)
        embed.addField({name: 'Carriable Storage', value: totalTreats.join('\n')});

        const houseInfo = [];
        if(!user.house){
            houseInfo.push(`<:dot:1030140713188479006> **No House bought**`)
        } else {
            houseInfo.push(`<:dot:1030140713188479006> **Owns a House**`)
            houseInfo.push(`<:dot:1030140713188479006> **Treasure Unlocked? ${user.storage.treasure.unlocked ? 'Yes' : 'No'}**`)

            
            
            for(let i = 0; i < 5; i++) {
                totalStorage += user.storage.treasure[String(i)];
                totalStorageValue += user.storage.treasure[String(i)] * Constants.TREAT[i].rank;
            }

            houseInfo.push(`<:dot:1030140713188479006> **Treasure Capacity: ${totalStorage}/${user.storage.treasure.capacity} (Value: ${totalStorageValue} 🪙)**`)
        }

        embed.addField({name: 'House', value: houseInfo.join('\n')});

        if(userId === this.user.id){
            const monsters = [];
            user.monsters.forEach(element => {
                 monsters.push(`${Constants.MONSTERS[element].name} <:dot:1030140713188479006> HP: ${Constants.MONSTERS[element].hp}`)
            });
            const weapons = [];
            user.weapons.forEach(element => {
                if(Constants.WEAPONS[element]) weapons.push(`${Constants.WEAPONS[element].name} <:dot:1030140713188479006> Damage: ${Constants.WEAPONS[element].damage.min} - ${Constants.WEAPONS[element].damage.max}`)
            });

           if(monsters.length) embed.addField({name: 'Monsters', value: monsters.join('\n') , inline: true});
           if(weapons.length) embed.addField({name: 'Weapons', value: weapons.join('\n'), inline: true});
        }

        embed.setDescription(`**Total Value: ${totalValue+totalStorageValue} 🪙 (${totalCandy+totalStorage} <:candy:1029069555605180518>)**`)
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069539557773394.webp')
        embed.setColor('#FFA500');
        this.reply({embeds: [embed]});
    }
}
module.exports = profile;