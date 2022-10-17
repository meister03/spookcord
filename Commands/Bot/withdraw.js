const BaseCommand = require('../../Structures/BaseCommand');
class withdraw extends BaseCommand {
    static name = 'withdraw';
    static description = 'Withdraw some of your candy from your storage';
    static category = 'Bot';
    static slashcommand = {
        name: 'withdraw',
        description: 'Withdraw some of your candy from your treasure',
        options: [
            {
                name: 'amount',
                description: 'The amount of candies you want to withdraw | -1 for max',
                type: 4,
                required: true
            }
        ]
    };
    static slash = { name: "withdraw", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);
        if (!user.storage.treasure.unlocked) {
            return this.reject(`**You do not own a treasure to withdraw from | Please purchase one with ${this.client.commands.cache.get('shop').slash.mention}**`)
        }
        let totalCandy = [];
        let totalCandyTreasure = [];
        for (let i = 0; i < 5; i++) {
            totalCandy.push(user.storage.carrable[String(i)]);
            totalCandyTreasure.push(user.storage.treasure[String(i)]);
        }
        
        let candyLeftToTransfer = totalCandyTreasure.reduce((a, b) => a + b, 0);
        
        if(args[0].value == -1) {
            if(totalCandyTreasure.reduce((a,b)=> a +b, 0) === 0) return this.reject(`**You do not have any candies to withdraw from your treasure**`)
            for(let i = 0; i < totalCandyTreasure.reduce((a,b)=> a +b, 0); i++) {
                for(let i = 4; i >= 0; i--) {
                    if(user.storage.treasure[String(i)] > 0 && candyLeftToTransfer > 0) {
                        user.storage.carrable[String(i)]++;
                        user.storage.treasure[String(i)]--;
                        candyLeftToTransfer--;
                    }
                }
            }
            client.userCache.update(user);
            return this.verify(`**Withdrew a total amount of ${'`' + totalCandyTreasure.reduce((a,b)=> a +b, 0) + '`'} candies from your treasure**`)
        } else {
            const amount = Number(args[0].value);
            if(amount < 1) return this.reject(`**You cannot withdraw a negative amount of candies**`)
            if(amount > totalCandyTreasure.reduce((a,b)=> a +b, 0)) return this.reject(`**You do not have enough candies to withdraw | You have an amount of ${'`' + totalCandyTreasure.reduce((a,b)=> a +b, 0) + '`'} candies left**`)
            for(let i = 0; i < amount; i++) {
                for(let i = 4; i >= 0; i--) {
                    if(user.storage.treasure[String(i)] > 0 && candyLeftToTransfer > 0) {
                        user.storage.carrable[String(i)]++;
                        user.storage.treasure[String(i)]--;
                        candyLeftToTransfer--;
                    }
                }
            }
            client.userCache.update(user);
            return this.verify(`**Withdrew a total amount of ${'`' + amount + '`'} candies from your treasure**`)
        }
    }
      
}
module.exports = withdraw;