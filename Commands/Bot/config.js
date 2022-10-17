const BaseCommand = require("../../Structures/BaseCommand");
class config extends BaseCommand {
    static name = "config";
    static description = "Configure the channel, where dedicated houses can be bought";
    static category = "Bot";
    static slashcommand = {
        name: "config",
        description: "Configure the channel, where dedicated houses can be bought",
        options: [
            {
                name: 'channel',
                description: 'The channel, where dedicated houses can be bought',
                type: 7,
                required: true
            }
        ],
    };
    static slash = { name: "config", category: "bot" };
    constructor(data) {
        super(data);
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);

        const guild = await this.client.guilds.fetch(this.guild.id);
        const member = await this.guild.members.fetch(this.user.id);
        const me = await this.guild.members.fetch(this.client.id)
        console.log(member)
        if (!member.permissions.has('MANAGE_CHANNELS', true)) {
            return this.reject(`**You need the "MANAGE_CHANNEL" permission to set the channel.**`)
        }

        const channelId = args[0].value;
        /**
         * @typedef channel import('scalecord.ts').Channel
         */

        const channel = await interaction.guild.channels.fetch(channelId);
        if (channel.type !== 0) return this.reject(`**You can only set a text channel as the dedicated house channel**`)

        const missingPerms = this.checkchannelpermissions(Discord, me, channel);
        if (missingPerms[0]) {
            return this.reject(`**I am missing the following permissions in the channel:\n${"```" + missingPerms[1].join('\n') + "```"}**`)
        }

        client.configCache.create({guildid: this.guild.id, channelid: channel.id})
        return this.verify(`**The channel has been set as the dedicated house channel**`)
    }


    checkchannelpermissions(Discord, me, channel) {
        let checkafter = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS", "CREATE_PUBLIC_THREADS"];
        let perm = []
        let state = false;
        for (let i = 0; i < checkafter.length; i++) {
            if (!channel.permissionsFor(me, 'member')?.has(Discord.Permissions.FLAGS[checkafter[i]])) {
                state = true;
                perm.push("- " + checkafter[i])
            }
        }
        return [state, perm]
    }

}
module.exports = config;