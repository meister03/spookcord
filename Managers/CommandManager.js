const Discord = require('scalecord.ts')

const fs = require('fs');
const path = require('path');
const resolveFolder = folderName => path.resolve(__dirname, ".", folderName);

class CommandManager {
  constructor(client) {
    this.client = client;
    this.cache = new Discord.Collection({ convertKey: false });
    this.aliases = new Discord.Collection({ convertKey: false });
    this.missingPermissions = new Discord.Collection({ convertKey: false });
  }

  load(options = {}) {
    const commandsFolder = resolveFolder("../Commands");
    const data = [];
    const devdata = [];

    fs.readdirSync(commandsFolder).map(async (dir) => {
      if (dir.endsWith(".txt")) return;
      if (dir.includes('[DISABLED]')) return;
      fs.readdirSync(path.join(commandsFolder, dir)).map((cmd) => {
        if (!cmd.endsWith(".js")) return;
        const commandpath = path.join(commandsFolder, dir, cmd);
        if (options.reload) delete require.cache[require.resolve(commandpath)];
        const pull = require(path.join(commandpath));
        if (pull.name) this.cache.set(pull.name, pull);
        if (pull.aliases) {
          pull.aliases.map((p) => this.aliases.set(p, pull));
        }
        if (pull.slashcommand) {
          if (pull.slashcommand?.name === 'dev') devdata.push(pull.slashcommand)
          else if (!pull.slashcommand?.ignore) data.push(pull.slashcommand);
        }
      });
    })

    this.client.applicationId = this.client.id;
    this.patchCommandIds();

    if (options.slash) {
      this.client.helpers.upsertGlobalApplicationCommands(data).catch((e) => console.log(e));
      if (devdata && options.dev) this.client.application?.commands?.set(devdata, this.client.config.server.id).catch((e) => console.log(e))
    }
    console.log(`[Loaded Commands] ${this.cache.size}`);
  }

  async patchCommandIds() {
    const rawCommands = await this.client.helpers.getGlobalApplicationCommands();
    const commands = [...rawCommands.values()];
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      let subCommand = this.cache.find(x => x.slash?.category === command.name) || this.cache.find(x => x.name === command.name);

      if (subCommand) {
        if (!subCommand.slash) subCommand.slash = { category: command.name };
        subCommand.slash.id = command.id;
        subCommand.slash.mentions = new Map();
        command.options?.forEach((sub) => {
          if (sub.type === 1 || sub.type === 2) {
            subCommand = this.cache.find(
              x =>
                x.slash?.category === command.name &&
                (Array.isArray(x.slash?.name) ? x.slash.name.includes(sub.name) : x.slash?.name === sub.name)
            ) || subCommand;
            if(!subCommand) return console.log(`[Slash] Missing Subcommand: ${sub.name} in ${command.name}`)
            if (!subCommand.slash) subCommand.slash = { category: sub.name, name: command.name };
            subCommand.slash.id = command.id;
            subCommand.slash.mentions = new Map();
          }
          if (sub.type === 2) {
            sub.options.forEach((option) => {
              if (option.type === 1) subCommand.slash.mentions.set(option.name, `</${command.name} ${sub.name} ${option.name}:${command.id}>`);
              else subCommand.slash.mentions.set(sub.name, `</${command.name} ${sub.name}:${command.id}>`);
            });
          } else if (sub.type === 1) {
            subCommand.slash.mentions.set(sub.name, `</${command.name} ${sub.name}:${command.id}>`);
          } else {
            subCommand.slash.mentions.set(sub.name, `</${command.name}:${command.id}>`);
          }
        })
        subCommand.slash.mention = `</${command.name}:${command.id}>`;
        subCommand.aliases?.map((p) => this.aliases.set(p, subCommand));
        this.cache.set(subCommand.name, subCommand);
      }
    }
  }

  async onInteraction(interaction) {
    if (!interaction.isCommand() && !interaction.isContextMenu()) return;

    const commandName = interaction.data.name;
    const subCommandGroupName = interaction.data.options?.find(x => x.name)?.name;
    let subCommandName;
    const args = [];

    interaction.data.options?.forEach(x => {
      // When options is not a sub command group
      if (x.type !== 2) {
        args.push(parseOptions(x));
      }
      subCommandName = x.name;
      if (x.name && !x.value) subCommandName = x.name;
      x.options?.forEach(y => {
        if (y.name && !y.value) subCommandName = y.name;
        if (y.type !== 2) args.push(parseOptions(y));
        y.options?.forEach(z => {
          args.push(parseOptions(z));
        })
      })
    })
    console.log(commandName, subCommandGroupName, subCommandName, args)

    let command = this.cache.get(commandName);
    if (!command?.slashcommand) {
      command = this.cache.find(cmd => cmd.slash?.name?.includes(subCommandGroupName) && cmd.slash?.category?.includes(commandName));
      if (!command) return;
    }
    const newinteraction = this.createMessagePropsOnInteraction(interaction, { commandName, subCommandGroupName, subCommandName });
    //if(interaction.isContextMenu()) newinteraction.options._hoistedOptions = new Map();
    const slashcommand = new command({ manager: this, interaction: newinteraction, args, client: this.client })
    slashcommand.execute(newinteraction, args, Discord, this.client)?.catch?.((error) => {
      console.log(error)
      this.client.errorhandler.createrr(this.client, `interaction in ${newinteraction.guild.name}(${'`' + newinteraction.guild.id + '`'})`, '/' + commandName, error)
      return slashcommand.onError((error.code ?? 'custom'))
    })
    return;
  }


  createCooldownMessage(description) {
    const tick = this.client.CONSTANTS.EMOJIS.get('COOLDOWN', this.client.data.custombot);
    const rejectembed = new Discord.Embed();
    rejectembed.setDescription(tick + description)
    rejectembed.setColor(this.client.config.embed.cooldown)
    rejectembed.toJSON();
    return { embeds: [rejectembed] };
  }

  createMessagePropsOnInteraction(interaction, options = {}) {
    if (options.commandName) interaction.commandName = options.commandName;
    if (options.subCommandGroupName) interaction.subCommandGroupName = options.subCommandGroupName;
    if (options.subCommandName) interaction.subCommandName = options.subCommandName;
    const resolved = interaction.data.resolved;
    if (resolved) {
      interaction.mentions = resolved.mentions;
      return interaction;
    }

    interaction.mentions = {};
    interaction.mentions.roles = new Discord.Collection()

    interaction.mentions.channels = new Discord.Collection()

    interaction.mentions.members = new Discord.Collection()

    interaction.mentions.users = new Discord.Collection()
    return interaction;
  }

}
module.exports = CommandManager;

function parseOptions(option) {
    return { type: option.type, name: option.name, value: option.value }
  }
  