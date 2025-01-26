require('dotenv').config();

const { Client, GatewayIntentBits, InteractionType, EmbedBuilder } = require('discord.js');

const token = process.env.TOKEN;

const GIF_CATALOG = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OWCdX4sTNt1frLfydK/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6BZaFXBVPBtok/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2p2ZjJjcGJuZXdrOGFxbTVvcTJwdDA2ZDgxdDlmYzgxMWUzbWNkYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IEaRGHp4mskzBeAukn/giphy.gif",
    "https://media.giphy.com/media/cl3EMK5vlECNO2UJr2/giphy.gif?cid=790b7611kjvf2cpbnewk8aqm5oq2pt06d81t9fc811e3mcdc&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/B3j9jHGiLgNFu/giphy.gif?cid=ecf05e47lcfb6df3vxnzvr4jfm850kna9obe9v40jr214mbg&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/5hvWaviAuSAl5BJvR2/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/jdrgQXu2qdL1e/giphy.gif?cid=ecf05e474k51cvxhbv9s60zblnoqnpskh4dl1jrq6ab5je5c&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media1.tenor.com/m/oOK47aHc4LQAAAAd/locked-medieval.gif",
    "https://media1.tenor.com/m/nsCPdljF1SgAAAAd/spank-bottom.gif",
    "https://media1.tenor.com/m/QPkhyYGlnCMAAAAd/assume-the-position-spanking.gif",
    "https://media1.tenor.com/m/op8x4aQhTiUAAAAd/bunny-bunny-dessert.gif",
    "https://media1.tenor.com/m/1gdTO4zudN0AAAAd/james-bond-timothy-dalton.gif"
];


const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'spank') {
        const mentionedUser = interaction.options.getUser('user');

        if (mentionedUser) {
            const randomGif = GIF_CATALOG[Math.floor(Math.random() * GIF_CATALOG.length)];
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`Here is a funny GIF for you!`)
                .setImage(randomGif);

            await interaction.reply({ content: `<@${mentionedUser.id}> gets a spank!`, ephemeral: false });

            await interaction.channel.send({
                embeds: [embed],
            });
        } else {
            await interaction.reply('Please mention a user to send a spank!');
        }
    }
});

client.login(token);
