const { ClusterManager } = require('discord-hybrid-sharding');

const manager = new ClusterManager(`${__dirname}/bot.js`, {
    totalShards: 1,
    mode: 'process'
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });