import {Client, Events, REST, Routes} from 'discord.js';
import {config} from "./config.js";
import {commandIndex} from "./command-index.js";

// Create a new client instance
const client = new Client({ intents: [] });
const rest = new REST({ version: '10' }).setToken(config.token);
rest.put(Routes.applicationCommands(config.clientId), { body: commandIndex.map(o => o.slashCommand) });


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on('interactionCreate', async interaction => {
    // Does nothing when no commandIndex and not from a server
    if (!interaction.isChatInputCommand()) return;
    if (config.flags.SERVER_ONLY && !interaction.guild){
        interaction.reply("This bot only supports being used from servers.");
        return;
    }

    await commandIndex.find(o => o.name === interaction.commandName).command(interaction);

})

// Log in to Discord with your client's token
client.login(config.token);



