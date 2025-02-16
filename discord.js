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
    "https://media.giphy.com/media/5hvWaviAuSAl5BJvR2/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/jdrgQXu2qdL1e/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media1.tenor.com/m/oOK47aHc4LQAAAAd/locked-medieval.gif",
    "https://media1.tenor.com/m/QPkhyYGlnCMAAAAd/assume-the-position-spanking.gif",
    "https://media1.tenor.com/m/op8x4aQhTiUAAAAd/bunny-bunny-dessert.gif",
    "https://media1.tenor.com/m/1gdTO4zudN0AAAAd/james-bond-timothy-dalton.gif",
    "https://media1.tenor.com/m/NcdgzWMhZXkAAAAd/spank-playful.gif",
    "https://media1.tenor.com/m/9Q4y7LHebCAAAAAd/ailoviumailov.gif",
    "https://media1.tenor.com/m/XbJu4_F243UAAAAd/mother-secretary.gif",
    "https://media1.tenor.com/m/_4hWflSaIdoAAAAd/mad-spank.gif",
    "https://media1.tenor.com/m/t7k2qjDTCrAAAAAd/keira-knightley-michael-fassbender.gif",
    "https://media1.tenor.com/m/2F07FFzlKNMAAAAd/pokemon-nurse-joy.gif",
    "https://media1.tenor.com/m/-XoOoISi_RAAAAAd/pet-set-up.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRqaDF0dDRrczBweGpjeW4ybTJ3cnNvbzY3ZWpkaWVqdzd6NGh6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ljbfaxEdz6gN2/giphy.gif",
    "https://media1.tenor.com/m/6BylXA_KJhgAAAAd/angry-maniac.gif",
    "https://media1.tenor.com/m/so_JB7XlqfMAAAAd/foghorn-leghorn.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3Z3b3poNjY0aTgycmIxaWFrZWZ6dmlnb3pzbjB1NGY5d2psNXFmOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZezDqIMwHiqLm/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q2eHppcDhuenI2dDRnNDVkbDVyYzBteDE3bGpuYWF3Zmt0bGxybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SiJW7VcRVz7PO/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm5xMXY3cmczMm1oNHFzbzJpdHVjeXlmdHhrMGRpdnBzOWt1dmUxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gf4bOJKo777Mc/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm93ZTY2ajc5ejFhMG5tczdjYzh6NHgwZ2xhZjRnbWdmamZ5MThsdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sREBnnMORiV7OIgemr/giphy.gif",
    "https://media1.tenor.com/m/QevCcsndbqEAAAAd/hard-ass.gif",
    "https://media1.tenor.com/m/Gj0HjWN_eq8AAAAd/booty-slap.gif",
    "https://media1.tenor.com/m/en-ZsjZmlBUAAAAd/bum.gif",
    "https://media1.tenor.com/m/zUa85cmIDq8AAAAd/ketel-marte-butt.gif",
    "https://media1.tenor.com/m/1JCirJT84qsAAAAd/hyunjae-hyunjae-tbz.gif",
    "https://media1.tenor.com/m/XW_ymVr5I6sAAAAd/slap-butt.gif",
    "https://media1.tenor.com/m/Sp7yE5UzqFMAAAAd/spank-slap.gif",
    "https://media1.tenor.com/m/-nt9Dj8Ei14AAAAd/tap-that.gif",
];

const GIF_SPRAY = [
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTJ5a214bWR6YXR3ajE0enB2OTZubHprYndzcXZmbmJybDB5b2JkdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378gODdla75xN0CA/giphy.gif",
    "https://media1.tenor.com/m/gkpXfHuw8dgAAAAC/lysol-spray-spraying.gif",
    "https://media1.tenor.com/m/d2W_6JMPvXYAAAAd/spray-bad.gif",
    "https://media1.tenor.com/m/WjiCyeVOYvUAAAAC/spray-bottle-cat-spray-bottle.gif",
    "https://media.tenor.com/svZprhzDZmgAAAAi/spray-stop.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2kwNzV1aTE3OGFlbnZnNnJ3ZHZ4eHE1eHY2cjVlNXE0bTc3eXhmaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MZSBHPaa0Y7FMelPtN/giphy.gif"
];

const GIF_FRYING_PAN = [
    "https://media1.tenor.com/m/upg58VQYiQsAAAAC/tangled-frying-pan.gif",
    "https://media1.tenor.com/m/CjZuCUGhuvIAAAAC/rapunzel-tangled.gif",
    "https://media1.tenor.com/m/FdvaVxBVMOcAAAAC/maymay-entrata-marydale.gif",
    "https://media1.tenor.com/m/-S5sE2UUEpQAAAAC/frying-pan-nelson-cheng.gif",
    "https://media1.tenor.com/m/BH6E2yKFtEAAAAAC/y3ongi-shindong.gif",
    "https://media1.tenor.com/m/bjxy1pcj8jkAAAAd/rapunzel-frying-pan.gif",
    "https://media1.tenor.com/m/0UQsOqRlrRsAAAAd/dave-ardito.gif"
]

let lastSpankGif = "";
let lastSprayGif = "";
let lastFryingPanGif = "";

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

client.on('shardDisconnect', (event, shardId) => {
    console.warn(`Shard ${shardId} disconnected:`, event);
});

client.on('shardError', (error, shardId) => {
    console.error(`Shard ${shardId} encountered an error:`, error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
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
            let embedmessage = `<@${mentionedUser.id}> gets a spank!`;

            if (mentionedUser.id === process.env.OSIRIS_ID) {
                randomGif = "https://media1.tenor.com/m/nsCPdljF1SgAAAAd/spank-bottom.gif";

            } else if (mentionedUser.id === process.env.BEES_ID) {
                randomGif = "https://media.giphy.com/media/B3j9jHGiLgNFu/giphy.gif?cid=ecf05e47lcfb6df3vxnzvr4jfm850kna9obe9v40jr214mbg&ep=v1_gifs_search&rid=giphy.gif&ct=g";
                embedmessage = `A special spank for TinkerBee! <@${mentionedUser.id}>`
            } else {
                do {
                    randomGif = GIF_CATALOG[Math.floor(Math.random() * GIF_CATALOG.length)];
                } while (randomGif === lastSpankGif && GIF_CATALOG.length > 1);
            }

            lastSpankGif = randomGif;

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`You've been naughty!`)
                .setImage(randomGif);

            await interaction.reply({
                content: embedmessage,
                embeds: [embed],
            });
        } else {
            await interaction.reply('Please mention a user to send a spank!');
        }
    } else if (interaction.commandName === 'spray') {
        const mentionedUser = interaction.options.getUser('user');

        if (mentionedUser) {
            let randomGif;

            do {
                randomGif = GIF_SPRAY[Math.floor(Math.random() * GIF_SPRAY.length)];
            } while (randomGif === lastSprayGif && GIF_SPRAY.length > 1);

            lastSprayGif = randomGif;

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`Get your act together!`)
                .setImage(randomGif);

            await interaction.reply({
                content: `<@${mentionedUser.id}> gets sprayed!`,
                embeds: [embed],
            });
        } else {
            await interaction.reply('Please mention a user to spray someone!');
        }
    }
    else if (interaction.commandName === 'fryingpan') {
        const mentionedUser = interaction.options.getUser('user');

        if (mentionedUser) {
            let randomGif;
            let content;

            if (mentionedUser.id === interaction.user.id) {
                content = "You can't hit yourself with a frying pan... or can you? 🤔";
                randomGif = "https://media1.tenor.com/m/Y2dvFI9XnPYAAAAC/rapunzel-tangled.gif";
            } else{
                do {
                    randomGif = GIF_FRYING_PAN[Math.floor(Math.random() * GIF_FRYING_PAN.length)];
                } while (randomGif === lastFryingPanGif && GIF_FRYING_PAN.length > 1);
                lastFryingPanGif = randomGif;
                content = `<@${mentionedUser.id}> gets hit by a frying pan!`;
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`Get boinked!`)
                .setImage(randomGif);

            await interaction.reply({
                content: content,
                embeds: [embed],
            });
        }
    }
});

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Discord bot is running!');
});

server.listen(PORT, () => {
    console.log(`HTTP server is running on port ${PORT}`);
});

setInterval(() => {
    if (!client.isReady()) {
        console.log('Bot is not connected. Attempting to reconnect...');
        client.login(token).catch(console.error);
    }
}, 60000);

client.login(token);
