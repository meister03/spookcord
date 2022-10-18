const Discord = require('scalecord.ts');
const Constants = require('../../Structures/Constants');
class Shop {
    constructor(client) {
        this.client = client;
    }
    async execute(interaction) {
        if (!interaction.data.customId.includes('|' + interaction.user.id)) {
            return interaction.reply({ content: `**Please open your own ${this.client.commands.cache.get('shop').slash.mention} overview!**`, ephemeral: true })
        }
        const user = this.client.userCache.cache.get(interaction.user.id);

        const item = interaction.data.values[0];

        if (item === 'treasure') {
            this.treasure(interaction);
        } else if (item === 'house') {
            this.house(interaction);
        } else if (item === 'weapons') {
            this.weapons(interaction);
        } else if (item === 'monsters') {
            this.monsters(interaction);
        }
    }


    treasure(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const info = [];
        const purchase = [];

        info.push('**__Unlocked:__' + (user.storage.treasure.unlocked ? ' Yes' : ' No' + ''));
        info.push('__Capacity:__ `' + user.storage.treasure.capacity + '`**');

        purchase.push('<:dot:1030140713188479006> **Unlock Treasure Storage** - `50` 🪙');
        purchase.push('<:dot:1030140713188479006> **Increase Capacity to `100`** - `25` 🪙');
        purchase.push('<:dot:1030140713188479006> **Increase Capacity to `200`** - `50` 🪙');
        purchase.push('<:dot:1030140713188479006> **Increase Capacity to `300`** - `75` 🪙');
        purchase.push('<:dot:1030140713188479006> **Increase Capacity to `400`** - `100` 🪙');
        purchase.push('<:dot:1030140713188479006> **Increase Capacity to `500`** - `125` 🪙');

        const embed = new Discord.Embed();
        embed.setTitle(`Treasure Storage`);
        embed.setDescription(info.join('\n'));
        embed.addField({ name: 'Purchase', value: purchase.join('\n') });
        embed.setColor('#FFA500');
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069553864560741.webp');

        const button = new Discord.Component({ type: 'BUTTON' })
        button.setLabel('Unlock Treasure Storage');
        button.setCustomId('shop|treasure|unlock');
        button.setStyle('PRIMARY');
        if (user.storage.treasure.unlocked) button.setDisabled(true);

        const button2 = new Discord.Component({ type: 'BUTTON' })
        button2.setLabel('Increase Capacity');
        button2.setCustomId('shop|treasure|capacity');
        button2.setStyle('SECONDARY');
        if (user.storage.treasure.capacity === 500) button2.setDisabled(true);

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(button, button2).toJSON();

        return interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
    }

    shopTreasureUnlock(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        if (!user.house) return interaction.reply({ content: '**You need to buy a house first to unlock the treasure!**', ephemeral: true });
        if (user.storage.treasure.unlocked) return interaction.reply({ content: '**You already unlocked your treasure storage!**', ephemeral: true });

        let totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }

        if (totalCandyValue < 50) return interaction.reply({ content: '**You need at least `50` 🪙 worth of candies to unlock your treasure!**', ephemeral: true });

        user.storage.treasure.unlocked = true;
        user.storage.treasure.capacity = 50;
        this.client.userCache.update(this.subTractValue(50, user));

        return interaction.reply({ content: `**You unlocked your treasure storage | You can now ${this.client.commands.cache.get('deposit').slash.mention} a specific amount.**`, ephemeral: true });
    }

    upgradeTreasureCapacity(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);
        if (!user.house) return interaction.reply({ content: '**You need to buy a house first to unlock the treasure!**', ephemeral: true });
        if (!user.storage.treasure.unlocked) return interaction.reply({ content: '**You need to unlock your treasure storage first!**', ephemeral: true });

        const currentCapacity = user.storage.treasure.capacity;
        if (currentCapacity === 500) return interaction.reply({ content: '**You already reached the maximum capacity!**', ephemeral: true });

        const price = this.getTreasureCapacityPrice(currentCapacity).price;

        let totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }
        if (totalCandyValue < price) return interaction.reply({ content: `**You need at least \`${price}\` 🪙 to upgrade your treasure storage!**`, ephemeral: true });

        user.storage.treasure.capacity = this.getTreasureCapacityPrice(currentCapacity).capacity;
        this.client.userCache.update(this.subTractValue(price, user));

        return interaction.reply({ content: `**You upgraded your treasure storage capacity to \`${user.storage.treasure.capacity}\`!**`, ephemeral: true });
    }

    getTreasureCapacityPrice(currentCapacity) {
        if (currentCapacity === 50) return { capacity: 100, price: 25 };
        if (currentCapacity === 100) return { capacity: 200, price: 50 };
        if (currentCapacity === 200) return { capacity: 300, price: 75 };
        if (currentCapacity === 300) return { capacity: 400, price: 100 };
        if (currentCapacity === 400) return { capacity: 500, price: 125 };
        return { capacity: currentCapacity + 100, price: 25 };
    }

    house(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const info = [];
        const purchase = [];

        info.push('**__Unlocked:__' + (user.house ? ' Yes**' : ' No' + '**'));

        purchase.push('<:dot:1030140713188479006> **Unlock House** - `100` 🪙');

        const embed = new Discord.Embed();
        embed.setTitle(`House`);
        embed.setDescription(info.join('\n'));
        embed.addField({ name: 'Purchase', value: purchase.join('\n') });
        embed.setColor('#FFA500');
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069570075537428.webp')

        const button = new Discord.Component({ type: 'BUTTON' })
        button.setLabel('Unlock House');
        button.setCustomId('shop|house|unlock');
        button.setStyle('PRIMARY');
        if(user.house) button.setDisabled(true);

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(button).toJSON();

        return interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
    }

    async unlockHouse(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        if(user.house) return interaction.reply({content: '**You already unlocked your house!**', ephemeral: true});
        let totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }
        if (totalCandyValue < 100) return interaction.reply({ content: '**You need at least `100` 🪙 worth of candies to unlock your house!**', ephemeral: true });

        user.house = true;
        await this.client.userCache.update(this.subTractValue(100, user));

        if (this.client.configCache.cache.has(interaction.guild.id)) {
            const channelid = this.client.configCache.cache.get(interaction.guild.id);
            this.client.channels.forge(channelid).send({ content: `**<@${user.userid}> bought an House | Feel free to visit them!**` }).then((msgid) => {
                this.client.helpers.startThreadWithMessage(channelid, msgid.id,{ autoArchiveDuration: 10080, name: `${user.username}'s House` }).then(
                    thread => {
                        this.client.messageCreator.houseEmbed({ usertag: user.username, avatarurl: user.useravatar, userid: user.userid, channelid: thread.id });
                    }
                ).catch(console.error);

            })

        }

        return interaction.reply({ content: '**You unlocked your house and can now buy a treasure!**', ephemeral: true });
    }

    weapons(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const info = [];
        const purchase = [];

        info.push('**__Unlocked:__' + (user.weapons.length ? ' Yes**' : ' No' + '**'));
        user.weapons.forEach(weapon => {
            info.push(`** You own the ${Constants.WEAPONS[weapon].name} ${Constants.WEAPONS[weapon].emoji}**`);
        })

        Constants.WEAPONS.forEach(weapon => {
            if (!weapon.id) return;
            purchase.push(`<:dot:1030140713188479006> **${weapon.name}** ${weapon.emoji} - \`${weapon.price}\` 🪙`);
        })

        const embed = new Discord.Embed();
        embed.setTitle(`Weapons`);
        embed.setDescription(info.join('\n'));
        embed.addField({ name: 'Purchase', value: purchase.join('\n') });
        embed.setColor('#FFA500');
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069547153661982.webp')

        const select = new Discord.Component({ type: 'SELECT_MENU' })
        select.setCustomId('weapon|select');
        select.setPlaceholder('Select a weapon to buy');
        const options = [];
        Constants.WEAPONS.forEach(weapon => {
            if (!weapon.id) return;
            options.push({ label: weapon.name, value: weapon.id, emoji: weapon.emoji, description: `Damage: ${weapon.damage.min}-${weapon.damage.max} | Rank: ${5 - weapon.rank}` });
        });
        select.setOptions(options);
        select.setMaxValues(1);

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(select).toJSON();

        return interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
    }

    async weaponSelect(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const selected = interaction.data.values[0];
        const weapon = Constants.WEAPONS[selected];

        if (user.weapons.includes(selected)) return interaction.reply({ content: '**You already have this weapon!**', ephemeral: true });
        if (user.weapons.length === 5) return interaction.reply({ content: '**You already have the maximum amount of weapons!**', ephemeral: true });
        let totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }
        if (totalCandyValue < weapon.price) return interaction.reply({ content: `**You need at least \`${weapon.price}\` 🪙 to buy this weapon!**`, ephemeral: true });

        user.weapons.push(selected);
        await this.client.userCache.update(this.subTractValue(weapon.price, user));

        return interaction.reply({ content: `**You bought the ${weapon.name} ${weapon.emoji}!**`, ephemeral: true });
    }

    monsters(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const info = [];
        const purchase = [];
        info.push('**__Unlocked:__' + (user.monsters.length ? ' Yes**' : ' No' + '**'));
        user.monsters.forEach(monster => {
            info.push(`** You own the ${Constants.MONSTERS[monster].name}**`);
        })

        Constants.MONSTERS.forEach(monster => {
            purchase.push(`<:dot:1030140713188479006> **${monster.name}** - \`${monster.price}\` 🪙`);
        })

        const embed = new Discord.Embed();
        embed.setTitle(`Monsters`);
        embed.setDescription(info.join('\n'));
        embed.addField({ name: 'Purchase', value: purchase.join('\n') });
        embed.setColor('#FFA500');
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069568070647828.webp')

        const select = new Discord.Component({ type: 'SELECT_MENU' })
        select.setCustomId('monster|select');
        select.setPlaceholder('Select a monster to get more info about');
        const options = [];
        Constants.MONSTERS.forEach(monster => {
            options.push({ label: monster.name, value: monster.id, emoji: { url: monster.image }, description: `HP: ${monster.hp} | Rank: ${6 - monster.rank}` });
        })
        select.setOptions(options);
        select.setMaxValues(1);

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(select).toJSON();

        return interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
    }

    monsterSelect(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const selected = interaction.data.values[0];
        const monster = Constants.MONSTERS[selected];

        const embed = new Discord.Embed();
        embed.setTitle(`${monster.name}`)
            .setDescription(`**${monster.description}\n\n__Price:__ ${'`' + monster.price + '` 🪙'}\n__Strength:__ ${'`' + monster.rank + '/5`'}\n__HP:__ ${'`' + monster.hp + '`'}\n__Treat Loss of Oponent:__ ${'`' + monster.steal + '%`'}**`)
            .setImage(monster.image)
            .setColor(monster.color);

        const button = new Discord.Component({ type: 'BUTTON' })
            .setCustomId('monster|buy|' + selected)
            .setLabel('Purchase Monster')
            .setStyle('SECONDARY');

        if (user.monsters.includes(selected)) button.setDisabled(true);

        const row = new Discord.Component({ type: 'ACTION_ROW' })
            .setComponents(button).toJSON();

        return interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
    }

    async purchaseMonster(interaction) {
        const user = this.client.userCache.cache.get(interaction.user.id);

        const selected = interaction.data.customId.split('|')[2];
        const monster = Constants.MONSTERS[selected];

        if (user.monsters.includes(selected)) return interaction.reply({ content: '**You already own this monster!**', ephemeral: true });
        if (user.monsters.length === 5) return interaction.reply({ content: '**You already have the maximum amount of monsters!**', ephemeral: true });

        let totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
        }

        if (totalCandyValue < monster.price) return interaction.reply({ content: `**You need at least \`${monster.price}\` 🪙 to buy this monster!**`, ephemeral: true });

        user.monsters.push(selected);
        await this.client.userCache.update(this.subTractValue(monster.price, user));

        return interaction.reply({ content: `**You bought the ${monster.name}!**`, ephemeral: true });

    }

    subTractValue(amount, user) {
        let amountLeftToSubtract = amount;
        let totalCandyValue = 0;
        const candies = new Map();
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
            candies.set(i, user.storage.carrable[String(i)]);
        }
        for (let i = 4; i >= 0; i--) {
            const value = candies.get(i) * Constants.TREAT[i].rank;
            if (value > amountLeftToSubtract) {
                const candyValue = Math.ceil(amountLeftToSubtract / Constants.TREAT[i].rank);
                user.storage.carrable[String(i)] -= candyValue;
                amountLeftToSubtract -= candyValue * Constants.TREAT[i].rank;
            } else {
                user.storage.carrable[String(i)] = 0;
                amountLeftToSubtract -= value;
            }
        }

        if (!amountLeftToSubtract) return user;
        totalCandyValue = 0;
        for (let i = 0; i < 5; i++) {
            totalCandyValue += user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
            user.storage.carrable[String(i)] = 0;
        }
        let candyAmountLeft = totalCandyValue - amountLeftToSubtract;
        for (let i = 4; i >= 0; i--) {
            if (candyAmountLeft >= Constants.TREAT[i].rank) {
                user.storage.carrable[String(i)] = Math.floor(candyAmountLeft / Constants.TREAT[i].rank);
                candyAmountLeft -= user.storage.carrable[String(i)] * Constants.TREAT[i].rank;
            }
        }
        return user;
    }
}
module.exports = Shop;