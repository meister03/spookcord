const BaseCommand = require('../../Structures/BaseCommand.js');

const { Component } = require('scalecord.ts');

class help extends BaseCommand {
    static name = 'help';
    static aliases = ['guide', 'cmd', 'commands', 'docs'];
    static description = 'Shows how to use the bot';
    static category = 'Bot';
    static slashcommand = {
        name: 'help',
        description: 'Shows some detailed informations, on how to use the bot',
        options: [],
    };
    static slash = { name: "help", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        const dotEmoji = '<:dot:1030140713188479006>';
        const embed = new Discord.Embed();
        embed.setTitle('Starter Guide');
        embed.setDescription('**Goal of this Game is to collect as many treats as possible. Winners will be announced at 31th October 2022.**');
        embed.addFields([{
            name: 'Earn Treats',
            value: [
                `${dotEmoji} ${this.client.commands.cache.get('daily').slash.mention} every 24 hours`,
                `${dotEmoji} Knock on random doors (${this.client.commands.cache.get('trickortreat').slash.mention}) every 10 mins`,
                `${dotEmoji} Attack other players (${this.client.commands.cache.get('trickortreat').slash.mention}) every 1h`,
                `${dotEmoji} ${this.client.commands.cache.get('work').slash.mention} for treats every 1h`,
            ].join('\n'),
        },
        {
            name: 'Entities/Shop Items',
            value: [
                `${dotEmoji} You can buy 4 different weapons to defeat monsters (different damage)`,
                `${dotEmoji} You can buy 5 different Monsters to protect your house (different Hp)`,
                `${dotEmoji} You can buy a house, to store a limited amount of candy in a treasure`,
                `${dotEmoji} You can upgrade your carreable storage and treasure storage capacity`,
            ].join('\n'),
        }
        ])
        //embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069541680095342.webp')
        embed.setColor('#FFA500');
        embed.toJSON();

        const button1 = new Component({type: 'BUTTON'}).setCustomId('help|candy').setLabel('Candy Value').setStyle('SECONDARY').setEmoji('<:candystorage:1029069537250902027>');
        const button2 = new Component({type: 'BUTTON'}).setCustomId('help|knock').setLabel('Knock Rewards').setStyle('SECONDARY').setEmoji('<:knock:1029069545245245540>');
        const button3 = new Component({type: 'BUTTON'}).setCustomId('help|attack').setLabel('Attack Rewards').setStyle('SECONDARY').setEmoji('<:attack:1029069543437508618>');

        const actionrow = new Component({type: 'ACTION_ROW'}).addComponents(button1, button2, button3).toJSON();
        return this.reply({ embeds: [embed], components: [actionrow] });
    }
}
module.exports = help;