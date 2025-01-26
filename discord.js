require('dotenv').config();

const http = require('http');
const { Client, GatewayIntentBits, InteractionType, EmbedBuilder } = require('discord.js');
const keep_alive = require('./keep-alive.js');
const token = process.env.TOKEN;
const PORT = process.env.PORT || 3000;

const GIF_CATALOG = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OWCdX4sTNt1frLfydK/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6BZaFXBVPBtok/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IEaRGHp4mskzBeAukn/giphy.gif",
    "https://media.giphy.com/media/cl3EMK5vlECNO2UJr2/giphy.gif?cid=790b7611kjvf2cpbnewk8aqm5oq2pt06d81t9fc811e3mcdc&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/B3j9jHGiLgNFu/giphy.gif?cid=ecf05e47lcfb6df3vxnzvr4jfm850kna9obe9v40jr214mbg&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/5hvWaviAuSAl5BJvR2/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/jdrgQXu2qdL1e/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media1.tenor.com/m/oOK47aHc4LQAAAAd/locked-medieval.gif",
    "https://media1.tenor.com/m/QPkhyYGlnCMAAAAd/assume-the-position-spanking.gif",
    "https://media1.tenor.com/m/op8x4aQhTiUAAAAd/bunny-bunny-dessert.gif",
    "https://media1.tenor.com/m/1gdTO4zudN0AAAAd/james-bond-timothy-dalton.gif"
];

let lastGif = "";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('disconnect', () => {
    console.error('The bot disconnected from Discord.');
});

client.on('shardReady', shardId => {
    console.log(`Shard ${shardId} is ready!`);
});

client.on('shardResume', (shardId, replayedEvents) => {
    console.log(`Shard ${shardId} resumed, replayed ${replayedEvents} events`);
});

client.on('shardReconnecting', id => {
    console.log(`Reconnecting shard ${id}...`);
});

client.rest.on('rateLimited', info => {
    console.warn(`Rate limit hit! Route: ${info.route}, Retry After: ${info.timeout}ms`);
});

client.guilds.cache.forEach(guild => {
    console.log(`Guild Name: ${guild.name}`);
});

client.on('debug', console.debug);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'spank') {
        const mentionedUser = interaction.options.getUser('user');

        if (mentionedUser) {
            let randomGif;

            if (mentionedUser.id === process.env.OSIRIS_ID) {
                randomGif = "https://media1.tenor.com/m/nsCPdljF1SgAAAAd/spank-bottom.gif";
            } else {
                do {
                    randomGif = GIF_CATALOG[Math.floor(Math.random() * GIF_CATALOG.length)];
                } while (randomGif === lastGif && GIF_CATALOG.length > 1);
            }

            lastGif = randomGif;

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`You've been naughty!`)
                .setImage(randomGif);

            await interaction.reply({
                content: `<@${mentionedUser.id}> gets a spank!`,
                embeds: [embed],
            });
        } else {
            await interaction.reply('Please mention a user to send a spank!');
        }
    }
});

client.login(token);
