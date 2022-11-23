const Constants = require('../../Structures/Constants.js');
class Attack {
    constructor(client){
        this.client = client;
    }
    execute(interaction){
        if(!this.client.userCache.cache.has(interaction.user.id)) return interaction.reply({ content: `**Please create a profile by running ${this.client.commands.cache.get('start').slash.mention}**`, ephemeral: true });

        const user = this.client.userCache.cache.get(interaction.user.id);
        
        const lastKnockedAt = (user.lastKnockedAt || 0) + 60000*10;
        if(lastKnockedAt > Date.now()) return interaction.reply({ content: `**You can knock on doors again <t:${(lastKnockedAt/1000).toFixed(0)}:R>**`, ephemeral: true });

        const lastAttackedAt = (user.lastAttackedAt || 0) + 60000*60;
        if(lastAttackedAt > Date.now()) return interaction.reply({ content: `**You can attack houses again <t:${(lastAttackedAt/1000).toFixed(0)}:R>**`, ephemeral: true });

        
        const houseOwner = this.client.userCache.cache.get(interaction.data.customId.replace('attack|', ''));
        if(!houseOwner) return interaction.reply({ content: `**This house doesn't exist anymore**`, ephemeral: true });

        const attackCooldown = (houseOwner.lastAttackedFromAt || 0) + 60000*60;
        if(attackCooldown > Date.now()) return interaction.reply({ content: `**This house can be attacked again <t:${(attackCooldown/1000).toFixed(0)}:R>**`, ephemeral: true });

        const knockCooldown = (houseOwner.lastKnockedFromAt || 0) + 60000*10;
        if(knockCooldown > Date.now()) return interaction.reply({ content: `**This house can be knocked on again <t:${(knockCooldown/1000).toFixed(0)}:R>**`, ephemeral: true });


        let candyLossAttacker = new Map();
        let candyLossDefender = new Map();

        let candyValueAttacker = 0;
        let candyValueDefender = 0;

        for(let i = 0; i < 5; i++){
            candyValueAttacker+= user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
            candyValueDefender+= houseOwner.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }

        const winAttackAmount = Math.ceil(candyValueDefender*0.1);
        let guardInfo = {};

        const guard = houseOwner.monsters.sort((a, b) => b - a)?.[0];
        let loseAttackAmount = guard ? candyValueAttacker*Constants.MONSTERS[guard].steal : 0;

        let weapon = user.weapons.sort((a, b) => b - a)?.[0] || 0;
        if(guard){
            const hpHistory = new Map();
            
            for(let i = 0; i < 10; i++){
                let previousHp = hpHistory.get(i-1) ?? Constants.MONSTERS[guard].hp;
                
                // Weapon Damage Range
                const damage = Constants.WEAPONS[weapon].damage;
                // Random Monster Damage with weapon {mix, max}
                const monsterDamage = Math.floor(Math.random() * (damage.max - damage.min + 1) + damage.min);
                const diff = previousHp - monsterDamage;
                if(diff <= 0) hpHistory.set(i, 0);
                else hpHistory.set(i, diff);
            }
            
            guardInfo = {id: guard, hp: hpHistory}
            if(hpHistory.get(9) === 0) loseAttackAmount = 0;
        }

        const treats = {won: new Map(), lost: new Map()};
        if(loseAttackAmount){
            for(let i = 0; i < 5; i++){
                const amount = Math.floor(user.storage.carrable[String(i)] * Constants.MONSTERS[guard].steal);
                user.storage.carrable[String(i)]-= amount;
                houseOwner.storage.carrable[String(i)]+= amount;
                candyLossAttacker.set(i, amount);
                treats.lost.set(i, amount);
            }
        } else {
            for(let i = 0; i < 5; i++){
                const amount = Math.floor(houseOwner.storage.carrable[String(i)] * 0.1);
                const randomAmount = Math.floor(Math.random()*5) || i;
                user.storage.carrable[String(i)]+= (amount || randomAmount);
                houseOwner.storage.carrable[String(i)]-= amount;
                candyLossDefender.set(i, amount);
                treats.won.set(i, (amount || randomAmount));
            }
        }
        
        user.lastAttackedAt = Date.now();
        houseOwner.lastAttackedFromAt = Date.now();

        user.lastKnockedAt = Date.now();
        houseOwner.lastKnockedFromAt = Date.now();

        this.client.userCache.update(user);
        this.client.userCache.update(houseOwner);

        const ehouseOwner = {
            id: houseOwner.userid,
            name: houseOwner.username, 
            avatarURL: houseOwner.useravatar,
            guard: guardInfo
        };


        this.client.messageCreator.attackActionEmbed(interaction, ehouseOwner, weapon, treats);
    }
}
module.exports = Attack;