class Knock {
    constructor(client){
        this.client = client;
    }
    execute(interaction){
        if(!this.client.userCache.cache.has(interaction.user.id)) return interaction.reply({ content: `**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`, ephemeral: true });

        const user = this.client.userCache.cache.get(interaction.user.id);
        
        const lastKnockedAt = (user.lastKnockedAt || 0) + 60000*10;
        if(lastKnockedAt > Date.now()) return interaction.reply({ content: `**You can knock on doors again <t:${(lastKnockedAt/1000).toFixed(0)}:R>**`, ephemeral: true });

        const houseOwner = this.client.userCache.cache.get(interaction.data.customId.replace('knock|', ''));
        if(!houseOwner) return interaction.reply({ content: `**This house doesn't exist anymore**`, ephemeral: true });

        const knockCooldown = (houseOwner.lastKnockedFromAt || 0) + 60000*10;
        if(knockCooldown > Date.now()) return interaction.reply({ content: `**This house can be knocked on again <t:${(knockCooldown/1000).toFixed(0)}:R>**`, ephemeral: true });

        const treats = new Map();
        for(let i = 0; i < 5; i++){
            const amount = Math.floor(houseOwner.storage.carrable[String(i)] * 0.1);
            const randomAmount = Math.floor(Math.random()*5) || i;

            user.storage.carrable[String(i)]+= (amount || randomAmount);
            houseOwner.storage.carrable[String(i)]-= amount;
            treats.set(i, (amount || randomAmount));
        }

        user.lastKnockedAt = Date.now();
        houseOwner.lastKnockedFromAt = Date.now();

        this.client.userCache.update(user);
        this.client.userCache.update(houseOwner);

        const ehouseOwner = {
            id: houseOwner.userid,
            name: houseOwner.username, 
            avatarURL: houseOwner.avatarURL,
        };
        
        this.client.messageCreator.knockActionEmbed(interaction, ehouseOwner, treats);
    }
}
module.exports = Knock;