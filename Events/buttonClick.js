const Knock = require('../Modules/action/knock.js');
const Thanks = require('../Modules/action/thanks.js');
const Attack  = require('../Modules/action/attack.js');
const Shop = require('../Modules/action/shop.js');
module.exports = async (client, interaction) => {
    interaction = client.interactions.forge(interaction);
    if(interaction.data.customId.includes('knock|')){
        const knock = new Knock(client);
        knock.execute(interaction);
    } else if(interaction.data.customId.includes('thank|')){
        const thanks = new Thanks(client);
        thanks.execute(interaction);
    } else if (interaction.data.customId.includes('attack|')){
        const attack = new Attack(client);
        attack.execute(interaction);
    } else if (interaction.data.customId.includes('shop|treasure|unlock')){
        const shop = new Shop(client);
        shop.shopTreasureUnlock(interaction);
    } else if(interaction.data.customId.includes('shop|treasure|capacity')){
        const shop = new Shop(client);
        shop.upgradeTreasureCapacity(interaction);
    } else if (interaction.data.customId.includes('shop|house|unlock')) {
        const shop = new Shop(client);
        shop.unlockHouse(interaction);
    } else if(interaction.data.customId.includes('monster|buy')){
        const shop = new Shop(client);
        shop.purchaseMonster(interaction);
    }else if(interaction.data.customId.includes('help|candy')){
        client.messageCreator.helpCandyEmbed(interaction);
    }  else if(interaction.data.customId.includes('help|knock')){
        client.messageCreator.helpKnockEmbed(interaction);
    } else if(interaction.data.customId.includes('help|attack')){
        client.messageCreator.helpAttackEmbed(interaction);
    } 

}