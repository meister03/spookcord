const BaseCommand = require("../../Structures/BaseCommand");

class invite extends BaseCommand {
    static name = 'invite';
    static description = 'Invite the bot to your server';
    static category = 'Bot';
    static slashcommand = {
        name: 'invite',
        description: 'Invite the bot to your server',
        options: [],
    };
    static slash = { name: "invite", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        const embed = new Discord.Embed();
        embed.setTitle('Invite Me');
        embed.setDescription(`**[Click here to invite Spookie to your server](https://discord.com/api/oauth2/authorize?client_id=${client.id}&permissions=51539888128&scope=bot%20applications.commands)**`)
        embed.setColor('#FFA500');
        embed.toJSON();
        this.reply({embeds: [embed]});
    }
}
module.exports = invite;