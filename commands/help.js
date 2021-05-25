module.exports = {
    name: 'help',
    isCommand: 'true',
    description: 'Displays this help page.',
    async execute(message) {
        const Discord = require('discord.js');
        const config = require('../config.json');
        const prefix = config.prefix;

        const helpEmbed = new Discord.MessageEmbed()
        .setTitle('Bot Commands')
        .setFooter('Bot created by rina#4911')
        .setColor('#6eb1f5')
        .addField(prefix + 'blacklist', `${prefix}blacklist \`check\`\n${prefix}blacklist \`add CurrentMCName reason\`\n${prefix}blacklist \`find CurrentMCName\``)
        .addField(prefix + 'check', `${prefix}check \`CurrentMCName - Checks an MC user for current requirements, our blacklist, and the SBZ scammer list\``)
        .addField(prefix + 'whitelist', 'Only rina can use, allows users to interact with the bot.')
        .addField(prefix + 'help', 'Displays an embed with various commands and useful info.');
        
        message.reply(helpEmbed);
    },
};