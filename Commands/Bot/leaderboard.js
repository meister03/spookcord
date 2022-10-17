const BaseCommand = require("../../Structures/BaseCommand");
const Constants = require("../../Structures/Constants");
class leaderboard extends BaseCommand {
    static name = 'leaderboard';
    static description = 'View the top 10 users with the highest amount of candy';
    static category = 'Bot';
    static slashcommand = {
        name: 'leaderboard',
        description: 'View the top 10 users with the highest amount of candy',
        options: [],
    };
    static slash = { name: "leaderboard", category: "bot" };
    constructor(data) {
        super(data)
    }
    async execute(interaction, args, Discord, client, data) {
        const users = [...client.userCache.cache.values()];

        const usersCandy = new Map();
        for(let r = 0; r < users.length; r++) {
            let totalValue = 0;
            let totalStorageValue = 0;
            let totalCandy = 0;
            let totalStorage = 0;
            for(let i = 0; i < 5; i++) {
                totalValue += users[r].storage.carrable[String(i)] * Constants.TREAT[i].rank;
                totalCandy += users[r].storage.carrable[String(i)];
                totalStorage += users[r].storage.treasure[String(i)];
                totalStorageValue += users[r].storage.treasure[String(i)] * Constants.TREAT[i].rank;
                usersCandy.set(users[r].userid, {totalCandy: totalCandy + totalStorage, totalValue: totalValue + totalStorageValue, userid: users[r].userid, username: users[r].username, useravatar: users[r].useravatar});
            }
        }
        
        const sortedUsers = [...usersCandy.entries()].sort((a, b) => b[1].totalCandy - a[1].totalCandy);
        const top10 = sortedUsers.slice(0, 10);
        const embed = new Discord.Embed();
        embed.setTitle('Leaderboard | Total Candies');
        embed.setColor('#00BFFF');
        embed.setDescription(top10.map((user, index) => `**${index + 1}. ${user[1].username} (${'`' + user[1].userid + '`'}) <:dot:1030140713188479006> ${'`' + user[1].totalValue + '`'} 🪙 <:dot:1030140713188479006> ${'`' + user[1].totalCandy + '`'} <:candy:1029069555605180518>**`).join('\n'));
        return this.reply({embeds: [embed]});
    }
}
module.exports = leaderboard;