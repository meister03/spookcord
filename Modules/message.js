const Discord = require('scalecord.ts');
const Constants = require('../Structures/Constants.js');
class MessageCreator {
    constructor(client) {
        this.client = client;
    }
    helpCandyEmbed(interaction) {
        const embed = new Discord.Embed();
        embed.setTitle('Candy Types');

        const candyTypes = [];
        const usage = [
            '<:dot:1030140713188479006> Buy items in the shop such as weapons, monsters and houses.',
            '<:dot:1030140713188479006> Upgrade your Treasure Capacity to store more candies safely.',
        ];
        
        Constants.TREAT.map( treat => {
            let coinName = 'Coin';
            if(treat.rank > 1) coinName = 'Coins';
            candyTypes.push(`<:dot:1030140713188479006> ${treat.name} ${treat.emoji} = ${treat.rank} ${coinName}`);
        })

        embed.setDescription(candyTypes.join('\n'));
        embed.setColor('#FF7300')
        embed.addField({name: 'Usage', value: usage.join('\n')});
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069539557773394.webp')
        embed.toJSON();
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    helpKnockEmbed(interaction) {
        const info = [
            '<:dot:1030140713188479006> Knocking is the friendly way earning treats.',
            '<:dot:1030140713188479006> Knocking on a house will give you 10% of the treats, which are not stored in the treasure',
            '<:dot:1030140713188479006> You can knock on a house once every 10 minutes',
            '<:dot:1030140713188479006> The Owner of the house will prompt you to thank them',
            '<:dot:1030140713188479006> Thanking 50x will unlock a badge and a huge treat',
        ];
        const embed = new Discord.Embed();
        embed.setTitle('Knock Rewards');
        embed.setDescription(info.join('\n'));
        embed.setColor('#FF7300')
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069545245245540.webp')
        embed.toJSON();
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    helpAttackEmbed(interaction) {
        const info = [
            '<:dot:1030140713188479006> Attacking is the only way getting a big amount of candies.',
            '<:dot:1030140713188479006> You can attack a house once every hour',
            '<:dot:1030140713188479006> Sometimes the House Owner owns a monster, you will need a weapon to defeat it',
            '<:dot:1030140713188479006> When you lose, you will lose 10-35% of your candies in your carriable storage',
        ]
        const embed = new Discord.Embed();
        embed.setTitle('Attack Rewards');
        embed.setDescription(info.join('\n'));
        embed.setColor('#FF7300')
        embed.setThumbnail('https://cdn.discordapp.com/emojis/1029069543437508618.webp')
        embed.toJSON();
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    houseEmbed({ usertag, avatarurl, userid, channelid , attackCooldown, interaction}) {
        const embed = new Discord.Embed();
        embed.setAuthor({ name: `House of ${usertag}`, iconUrl: avatarurl })
        embed.setImage('https://cdn.discordapp.com/attachments/992053260682809494/1029088328492003359/Untitled_design.png')
        embed.setColor('#FF7300')

        const knockButton = new Discord.Component({ type: 'BUTTON' })
            .setCustomId(`knock|${userid}`)
            .setEmoji('<:knock:1029069545245245540>')
            .setLabel('Knock')
            .setStyle('SECONDARY')
            .toJSON();

        const attackButton = new Discord.Component({ type: 'BUTTON' })
            .setCustomId(`attack|${userid}`)
            .setEmoji('<:attack:1029069543437508618>')
            .setLabel('Attack')
            .setStyle('SECONDARY')


        if(attackCooldown) attackButton.setDisabled(true);

        const actionRow = new Discord.Component({ type: 'ACTION_ROW' }).setComponents(knockButton, attackButton).toJSON()

        const messageOptions = { embeds: [embed], components: [actionRow] }
        if(interaction) return interaction.reply({...messageOptions, ephemeral: true});
        return this.client.channels.forge(channelid).send(messageOptions);
    }

    knockActionEmbed(interaction, houseOwner, treats) {
        const randomKnockMessages = [
            '{{houseowner}} is getting your Treats ready, Thanks for knocking!',
            '{{houseowner}} is getting your Treats ready, hold tight!',
            '{{houseowner}} is looking for your Treats, hold tight!',
            '{{houseowner}} will come in short and give you your Treats!',
        ]

        const embed = new Discord.Embed()
            .setAuthor({ name: randomKnockMessages[Math.floor(Math.random() * randomKnockMessages.length)].replace('{{houseowner}}', houseOwner.name), iconUrl: houseOwner.avatarURL })
            .setColor('#FF7300')
            .toJSON();
        interaction.reply({ embeds: [embed], ephemeral: true });

        setTimeout(() => {
            const treatEmbed = new Discord.Embed();
            treatEmbed.setAuthor({ name: `Here are your Treats!`, iconUrl: houseOwner.avatarURL })

            const totalTreats = [];
            [...treats.keys()].sort((a, b) => a - b).map(x => {
                const treat = treats.get(x);
                totalTreats.push(`${treat}x ${Constants.TREAT[Number(x)].name} ${Constants.TREAT[x].emoji}`)
            })
            treatEmbed.setDescription('**' + totalTreats.join('\n') + '**')
            treatEmbed.setColor('#00BFFF')

            const thankButton = new Discord.Component({ type: 'BUTTON' })
                .setCustomId(`thank|${houseOwner.id}`)
                .setEmoji('<:roseWumpusGift:920040985243820082>')
                .setLabel('Thank You')
                .setStyle('SECONDARY')
                .toJSON();

            const actionRow = new Discord.Component({ type: 'ACTION_ROW' }).setComponents(thankButton).toJSON()

            interaction.editReply({ embeds: [treatEmbed], ephemeral: true, components: [actionRow] });
        }, 3000)

    }

    thankActionEmbed(interaction) {
        const thankMessages = [
            'Thank you for the Treats!',
            'Thanks for the Treats!',
            'Thanks for the Treats, I really appreciate it!',
            'Feel free to knock on my house!'
        ]

        const embed = new Discord.Embed()
            .setAuthor({ name: thankMessages[Math.floor(Math.random() * thankMessages.length)], iconUrl: interaction.user.avatarURL() })
            .setColor('#00BFFF')
            .toJSON();

        interaction.message.embeds.push(embed);
        return interaction.update({ embeds: interaction.message.embeds, ephemeral: true, components: [] });
    }

    attackActionEmbed(interaction, houseOwner, weaponId, treats) {
        const randomAttackMessages = [
            'Preparing to attack {{houseowner}}...',
            'Getting your weapons ready to attack {{houseowner}}...',
            'Taking a power-up break before attacking {{houseowner}}...',
        ]
        const findTreatMessage = [
            'You found {{treat}} laying on the ground.',
            'You found {{treat}} hidden in the cupboard.',
            'You found {{treat}} in the fridge.',
            'You found {{treat}} on the desk.',
            'You found {{treat}} in the drawer.',
            'You found {{treat}} in the wardrobe.',
            'You found {{treat}} in the toilet.',
            'You found {{treat}} in the sink.',
            'You found {{treat}} in the bin.',
            'You found {{treat}} in the freezer.',

        ]

        const embed = new Discord.Embed()
            .setAuthor({ name: randomAttackMessages[Math.floor(Math.random() * randomAttackMessages.length)].replace('{{houseowner}}', houseOwner.name), iconUrl: interaction.user.avatarURL() })
            .setColor('#90ee90')
            .toJSON();

        interaction.reply({ embeds: [embed], ephemeral: true });
        if (houseOwner.guard?.id !== undefined) {
            const guardEmbed = new Discord.Embed()
                .setAuthor({ name: `A ${Constants.MONSTERS[houseOwner.guard.id].name} is protecting ${houseOwner.name}'s House`, iconUrl: 'https://cdn.discordapp.com/emojis/929008354624409640.webp' })
                .setDescription(`**${Constants.MONSTERS[houseOwner.guard.id].description}\n\n__Strength:__ ${'`' + Constants.MONSTERS[houseOwner.guard.id].rank + '/5`'}\n__HP:__ ${'`' + Constants.MONSTERS[houseOwner.guard.id].hp + '`'}\n__Treat Loss:__ ${'`' + Constants.MONSTERS[houseOwner.guard.id].steal + '%`'}**`)
                .setImage(Constants.MONSTERS[houseOwner.guard.id].image)
                .setFooter({ text: 'Battle is starting in 10 seconds...' })
                .setColor('#FF0000')
                .toJSON();

            setTimeout(() => {
                interaction.editReply({ embeds: [guardEmbed], ephemeral: true });
                // shuffle array
                const attackMessages = Constants.WEAPONS[weaponId].messages.sort(() => Math.random() - 0.5);
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        guardEmbed.footer.text = '';
                        setTimeout(() => {
                            const attackEmbed = new Discord.Embed()
                            attackEmbed.setTitle(`${'`' + (10 - i) + ':00`'} | ${'`' + houseOwner.guard.hp.get(i) + ' HP Left`'}| ${attackMessages[i]}`)
                            attackEmbed.setAuthor({
                                name: 'Attacking with a ' + Constants.WEAPONS[weaponId].name,
                                iconUrl: Constants.WEAPONS[weaponId].image,
                            })
                            attackEmbed.setColor('#FF0000')
                            interaction.editReply({ embeds: [guardEmbed, attackEmbed], ephemeral: true });
                        }, 3000*i)
                    }
                }, 10000)
            }, 2500)

            if (treats.lost.size) {
                setTimeout(() => {
                    const treatEmbed = new Discord.Embed();
                    treatEmbed.setAuthor({ name: `You lost the Battle`, iconUrl: 'https://cdn.discordapp.com/emojis/1029069566065791079.webp' })

                    const totalTreats = [];
                    [...treats.lost.keys()].sort((a, b) => a - b).map(x => {
                        const treat = treats.lost.get(x);
                        totalTreats.push(`-${treat}x ${Constants.TREAT[Number(x)].name} ${Constants.TREAT[x].emoji}`)
                    })
                    treatEmbed.setDescription('**' + totalTreats.join('\n') + '**')
                    treatEmbed.setColor('#808080')
                    interaction.editReply({ embeds: [treatEmbed], ephemeral: true });
                }, 45600)
            } else {
                setTimeout(() => {
                    const treatEmbed = new Discord.Embed();
                    treatEmbed.setAuthor({ name: `You won the Battle!`, iconUrl: 'https://cdn.discordapp.com/emojis/1029069548571344936.webp' })

                    const totalTreats = [];
                    [...treats.won.keys()].sort((a, b) => a - b).map(x => {
                        const treat = treats.won.get(x);
                        totalTreats.push(`${treat}x ${Constants.TREAT[Number(x)].name} ${Constants.TREAT[x].emoji}`)
                    })

                    treatEmbed.setDescription('**' + totalTreats.join('\n') + '**')
                    treatEmbed.setColor('#FFD700')
                    interaction.editReply({ embeds: [treatEmbed], ephemeral: true });
                }, 45600)
            }
        } else {
            const findMessages = findTreatMessage.sort(() => Math.random() - 0.5);
            const wonTreats = [...treats.won.keys()]
            setTimeout(() => {
                for (let i = 0; i < treats.won.size; i++) {
                    setTimeout(() => {
                        const treatAmount = treats.won.get(wonTreats[i]);
                        const treat = Constants.TREAT[wonTreats[i]];
                        const attackEmbed = new Discord.Embed()
                        attackEmbed.setTitle(`${'`' + (5 - i) + ':00`'} | ${findMessages[i].replace('{{treat}}', '`' + treatAmount + 'x` ' + treat.name + ' ' + treat.emoji)}`)
                        attackEmbed.setColor('#FF0000')
                        interaction.editReply({ embeds: [attackEmbed], ephemeral: true });
                    }, 3000*i)
                }
            }, 2500)
            setTimeout(() => {
                const treatEmbed = new Discord.Embed();
                treatEmbed.setAuthor({ name: `You got your loot, now run!`, iconUrl: 'https://cdn.discordapp.com/emojis/1029069566065791079.webp' })

                const totalTreats = [];
                [...treats.won.keys()].sort((a, b) => a - b).map(x => {
                    const treat = treats.won.get(x);
                    totalTreats.push(`${treat}x ${Constants.TREAT[Number(x)].name} ${Constants.TREAT[x].emoji}`)
                })

                treatEmbed.setDescription('**' + totalTreats.join('\n') + '**')
                treatEmbed.setColor('#FFD700')
                interaction.editReply({ embeds: [treatEmbed], ephemeral: true });
            }, treats.won.size*3000 + 3500)
        }

    }
}
module.exports = MessageCreator;