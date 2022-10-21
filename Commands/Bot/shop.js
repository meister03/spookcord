const BaseCommand = require("../../Structures/BaseCommand");
const Constants = require("../../Structures/Constants");

class shop extends BaseCommand {
    static name = 'shop';
    static description = 'Buy new items or upgrade existing items with your candies';
    static category = 'Bot';
    static slashcommand = {
        name: 'shop',
        description: 'Buy new items or upgrade existing items with your candies',
        options: [],
    };
    static slash = { name: "shop", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            return this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);

        const items = [];
        const shopItems = [];

        shopItems.push('**<:dot:1030140713188479006> Weapons**')
        shopItems.push('**<:dot:1030140713188479006> Dedicated House**')
        shopItems.push('**<:dot:1030140713188479006> Treasure Storage (Upgradable)**')
        shopItems.push('**<:dot:1030140713188479006> Monsters**')


        let totalCandy = 0;
        let totalTreasureCandy = 0;
        let totalCandyValue = 0;
        let totalTreasureCandyValue = 0;

        for (let i = 0; i < 5; i++) {
            totalCandy += user.storage.carrable[String(i)];
            totalTreasureCandy += user.storage.treasure[String(i)];
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[String(i)].rank;
            totalTreasureCandyValue += user.storage.treasure[String(i)] * Constants.TREAT[String(i)].rank;
        }
        items.push(`**__Balance:__  ${'`' + totalCandyValue + '`'} 🪙 (${'`' + totalCandy + '`'} <:candy:1029069555605180518>)**`);
        items.push(`**__Withdrawable Balance:__ ${'`' + totalTreasureCandyValue + '`'} 🪙 (${'`' + totalTreasureCandy + '`'} <:candy:1029069555605180518>)**`);

        const embed = new Discord.Embed()
            .setTitle('Shop')
            .setDescription(items.join('\n'))
            .addField({ name: 'Items', value: shopItems.join('\n') })
            .setColor('#FFA500')
            .setThumbnail('https://cdn.discordapp.com/emojis/1029069537250902027.webp')

        const select = new Discord.Component({ type: 'SELECT_MENU' })
            .setCustomId('shop|' + this.user.id)
            .setPlaceholder('Select an item to see more info')
            .setMaxValues(1)
            .setOptions([
                {
                    label: 'Weapons', value: 'weapons', emoji: '<:knive:1029069547153661982>',
                    description: 'Buy new weapons to defeat monsters'
                },
                {
                    label: 'Dedicated House', value: 'house', emoji: '<:house:1029069570075537428>',
                    description: 'Own a dedicated house to store your candies'
                },
                {
                    label: 'Treasure Storage', value: 'treasure', emoji: '<:storage:1029069553864560741>',
                    description: 'Upgrade your treasure storage to store more candies'
                },
                {
                    label: 'Monsters', value: 'monsters', emoji: '<:monster:1029069568070647828>',
                    description: 'Buy new monsters to protect your house from attacks'
                },
            ])

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(select).toJSON();

        return this.reply({ embeds: [embed], components: [row] }).catch(console.log)
    }
}
module.exports = shop;