const BaseCommand = require("../../Structures/BaseCommand");

class deposit extends BaseCommand {
    static name = 'deposit';
    static description = 'Deposit some of your candy into your storage';
    static category = 'Bot';
    static slashcommand = {
        name: 'deposit',
        description: 'Deposit some of your candy into your treasure',
        options: [
            {
                name: 'amount',
                description: 'The amount of candy you want to deposit | -1 for max',
                type: 4,
                required: true
            }
        ]
    };
    static slash = { name: "deposit", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        if (!client.userCache.cache.get(this.user.id)) {
            this.reject(`**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`)
        }
        const user = client.userCache.cache.get(this.user.id);
        if (!user.storage.treasure.unlocked) {
            return this.reject(`**You do not own a treasure | Please purchase one with ${this.client.commands.cache.get('shop').slash.mention}**`)
        }

        let totalCandy = [];
        let totalCandyTreasure = [];
        for (let i = 0; i < 5; i++) {
            totalCandy.push(user.storage.carrable[String(i)]);
            totalCandyTreasure.push(user.storage.treasure[String(i)]);
        }
        const capacityLeft = user.storage.treasure.capacity - totalCandyTreasure.reduce((a, b) => a + b, 0);
        let candyLeftToTransfer = capacityLeft;

        if(args[0].value == -1) {
            if(totalCandy.reduce((a,b)=> a +b, 0) === 0) return this.reject(`**You do not have any candies to deposit**`)
            if(capacityLeft === 0) return this.reject(`**Your treasure capacity is full | Please upgrade your capacity with ${this.client.commands.cache.get('shop').slash.mention}**`)
            
            for(let i = 0; i < capacityLeft; i++) {
                for(let i = 4; i >= 0; i--) {
                    if(user.storage.carrable[String(i)] > 0 && candyLeftToTransfer > 0) {
                        user.storage.treasure[String(i)]++;
                        user.storage.carrable[String(i)]--;
                        candyLeftToTransfer--;
                    }
                }
            }
            client.userCache.update(user);
            return this.verify(`**Deposited a total amount of ${capacityLeft} candies into your treasure**`)
        } else {
            let amount = Number(args[0].value);
            candyLeftToTransfer = amount;
            if(amount < 1 || isNaN(amount)) return this.reject(`**Please deposit more than 1 candy**`)
            if(amount > totalCandy.reduce((a,b)=> a +b, 0)) return this.reject(`**You do not have enough candies to deposit ${'`' + amount + '`'} <:candy:1029069555605180518> | You have an amount of ${'`' + totalCandy.reduce((a,b)=> a +b, 0) + '`'} candies**`)
            if(amount > capacityLeft) return this.reject(`**You do not have enough capacity to deposit ${'`' + amount + '`'} candies | You have ${'`' + capacityLeft + '`'} <:candy:1029069555605180518> capacity in your treasure left**`)
            for(let i = 0; i < amount; i++) {
                for(let i = 4; i >= 0; i--) {
                    if(user.storage.carrable[String(i)] > 0 && candyLeftToTransfer > 0) {
                        user.storage.treasure[String(i)]++;
                        user.storage.carrable[String(i)]--;
                        candyLeftToTransfer--;
                    }
                }
            }
            client.userCache.update(user);
            return this.verify(`**Deposited a total amount of ${'`' + amount + '`'} candies into your treasure**`)
        }

    }
}
module.exports = deposit;