module.exports = (client) => {
    setTimeout(() => {
        const owners = new Set([...client.guilds.cache.values()].map(x => x.ownerId))
        const dupl = [];
        [...client.guilds.cache.values()].map(x => {
            if (owners.has(x.ownerId)) owners.delete(x.ownerId);
            else dupl.push(x)
        });
        console.log(dupl.length, "Dup owners");
    }, 10000);
}