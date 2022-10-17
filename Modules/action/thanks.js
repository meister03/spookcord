class Thank {
    constructor(client) {
        this.client = client;
    }
    execute(interaction) {
        const houseOwner = this.client.userCache.cache.get(interaction.data.customId.replace('thank|', ''));
        if(!houseOwner) return interaction.reply({ content: `**This house doesn't exist anymore**`, ephemeral: true });

        const treats = [4,3,2,0,0];

        for(let i = 0; i < treats.length; i++) {
            houseOwner.storage.carrable[String(i)] += treats[i];
        }

        this.client.userCache.update(houseOwner);
        this.client.messageCreator.thankActionEmbed(interaction);
    }
}
module.exports = Thank;