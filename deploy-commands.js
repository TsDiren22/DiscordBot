require('dotenv').config();

const { REST, Routes, ApplicationCommandOptionType, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const GUILD_IDS = process.env.GUILD_IDS.split(',');

const commands = [
    {
        name: 'spank',
        description: 'Sends a random spank!',
        options: [
            {
                name: 'user',
                type: ApplicationCommandOptionType.User,
                description: 'The user to spank',
                required: true
            }
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        for (const guildId of GUILD_IDS) {
            await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });
        }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();