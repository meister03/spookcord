const { generateNonce } = require("discord-hybrid-sharding");
const BaseCommand = require("../../Structures/BaseCommand");

class airdrop extends BaseCommand {
    static name = 'pinata';
    static description = 'Create a pinata to give away some candies';
    static category = 'Bot';
    static slashcommand = {
        name: 'pinata',
        description: 'Create a pinata to give away some candies',
        options: [{
            name: 'amount',
            description: 'The amount of candies to give away',
            type: 4,
            required: true
        }],
    };
    static slash = { name: "pinata", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        const user = client.userCache.cache.get(this.user.id);

        let totalCandy = [];
        for (let i = 0; i < 5; i++) {
            totalCandy.push(user.storage.carrable[String(i)]);
        }
        if (totalCandy.reduce((a, b) => a + b, 0) < args[0].value) return this.reject(`**You do not have the mentioned amount to create the Pinata | You currently have ${totalCandy.reduce((a, b) => a + b, 0)} candies**`)
        if (args[0].value < 1) return this.reject(`**You cannot create an Pinata with a negative amount of candies**`)

        let airdropAmount = args[0].value;
        let airdropCandy = new Map();
        for (let i = 0; i < args[0].value; i++) {
            for (let i = 0; i < 5; i++) {
                if (user.storage.carrable[String(i)] > 0 && airdropAmount > 0) {
                    user.storage.carrable[String(i)]--;
                    airdropAmount--;
                    if (airdropCandy.has(i)) {
                        airdropCandy.set(i, airdropCandy.get(i) + 1)
                    } else {
                        airdropCandy.set(i, 1)
                    }
                }
            }
        }

        airdropAmount = args[0].value;

        const embed = new Discord.Embed();
        embed.setAuthor({ name: `${user.username}'s Pinata`, iconUrl: user.useravatar });
        embed.setDescription(`**${user.username} has created an Pinata with ${args[0].value} candies.\nJoin breaking the Pinata with others before the time ends. (<t:${(Date.now()/1000 + 60*2).toFixed(0)}:R>)**`)
        embed.setColor('#FFA500');
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1030866946293514250.webp')
        embed.toJSON();

        const airdropCustomId = `airdrop|${generateNonce()}`;

        const button = new Discord.Component({ type: 'BUTTON' })
            .setLabel('Break the Pinata')
            .setEmoji('<:bat:1030866944246677605>')
            .setStyle('SECONDARY')
            .setCustomId(airdropCustomId)

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(button)
            .toJSON();

        this.reply({ embeds: [embed], components: [row] });
        client.userCache.update(user);
        const parcipants = new Map();

        const collector = new Discord.Collector('buttonClick', { time: 60000*2, client: this.client, filter: (i) => i.data.customId === airdropCustomId, max: airdropAmount });
        collector.on('collect', async (i) => {
            i = client.interactions.forge(i);
            if (i.data.customId === airdropCustomId) {
                if (!client.userCache.cache.has(i.user.id)) return i.reply({ content: (`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`), ephemeral: true });
                if (parcipants.has(i.user.id)) return i.deferUpdate();
                parcipants.set(i.user.id, i.user.id);
                i.reply({ content: `**You started breaking the Pinata!**`, ephemeral: true });
            }
        });
        collector.on('end', async (collected) => {
            if (parcipants.size === 0) {
                const localUser = client.userCache.cache.get(this.user.id);
                for (let i = 0; i < 5; i++) {
                    if (airdropCandy.has(i)) {
                        localUser.storage.carrable[String(i)] += airdropCandy.get(i);
                    }
                }
                client.userCache.update(localUser);
                return interaction.editReply({ embeds: [embed.setDescription(`**${localUser.username} has created an Pinata with ${args[0].value} candies.**\n\n**No one joined breaking the Pinata.**`)], components: [] })
            } else {
                const users = [...parcipants.keys()];
                for (let g = 0; g < Math.ceil(airdropAmount / users.length); g++) {
                    for (let i = 0; i < users.length; i++) {
                        const localUser = client.userCache.cache.get(users[i]);
                        for (let r = 4; r >= 0; r--) {
                            if (airdropCandy.has(r)) {
                                let amount = airdropCandy.get(r);
                                localUser.storage.carrable[r] += 1;
                                await client.userCache.update(localUser);
                                amount--;
                                if (amount === 0) {
                                    airdropCandy.delete(r);
                                } else {
                                    airdropCandy.set(r, amount);
                                }
                                break;
                            }
                        }
                    }
                }

                const embed = new Discord.Embed();
                embed.setAuthor({ name: `${user.username}'s Pinata`, iconUrl: user.useravatar });
                embed.setDescription(`**${user.username} has created an Pinata with ${args[0].value} candies.**\n\n**${parcipants.size} people broke the pinata and got ~ ${Math.ceil(airdropAmount / users.length)} <:candy:1029069555605180518>**`)
                embed.setThumbnail('https://cdn.discordapp.com/emojis/1030866946293514250.webp')
                embed.setColor('#FFA500');
                interaction.editReply({ embeds: [embed], components: [] });
            }
        });
    }
}
module.exports = airdrop;