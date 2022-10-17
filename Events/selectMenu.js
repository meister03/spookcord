const Shop = require('../Modules/action/shop.js');
module.exports = async (client, interaction) => {
    interaction = client.interactions.forge(interaction);
    if (interaction.data.customId.includes('shop|')){
        const shop = new Shop(client);
        shop.execute(interaction);
    } else if(interaction.data.customId.includes('weapon|select')){
        const shop = new Shop(client);
        shop.weaponSelect(interaction);
    } else if(interaction.data.customId.includes('monster|select')){
        const shop = new Shop(client);
        shop.monsterSelect(interaction);
    }
}