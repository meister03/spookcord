const Discord = require('scalecord.ts');
class BaseCommand {
     constructor(data) {
          this.message = data.message;
          this.interaction = data.interaction;
          this.user = this.message ? this.message.author : this.interaction.user;
          this.guild = this.message ? this.message.guild : this.interaction.guild;
          this.member = this.message ? this.message.member : this.interaction.member;
          this.channel = this.message ? this.message.channel : this.interaction.channel;
          this.client = data.client;
     }

    reply(messageOptions){
        return this.interaction ? this.interaction.reply(messageOptions) : this.channel.send(messageOptions);
    }

    verify(content, reason){
        const tick = '<:modtick:810573772201394207>';
        reason = reason ? " | " + reason : "";
        const rejectembed = new Discord.Embed();
        rejectembed.setDescription(tick + content + reason)
        rejectembed.setColor('#03cc7f')
        rejectembed.toJSON();
        return this.reply({ embeds: [rejectembed] })
    }

    reject(content, reason){
        const cross = '<:modcross:810573772146212874>';
        reason = reason ? " | " + reason : "";
        const rejectembed = new Discord.Embed();
        rejectembed.setDescription(cross + content + reason)
        rejectembed.setColor('#d32f2f')
        rejectembed.toJSON();
        return this.reply({ embeds: [rejectembed] })
    }
}
module.exports = BaseCommand;