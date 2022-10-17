module.exports = async (client, interaction) => {
    interaction = client.interactions.forge(interaction);
    if (interaction.isButton() && !interaction.data.values) {
        return client.eventListener.allEvents.buttonClick(client, interaction);
    } else if (interaction.isSelectMenu() && interaction.data.values) {
        return client.eventListener.allEvents.selectMenu(client, interaction);
    }

    if (!interaction.isCommand() && !interaction.isContextMenu()) return;
    return client.commands.onInteraction(interaction);
}