async function receiveMessage(message, client, Discord) {
    const config = require('../config.json');
    
    if (message.author.bot) return;
    else if (message.channel.id == config.loggingID) return;

    else {
        const messageLogEmbed = await new Discord.MessageEmbed()
        .setAuthor(message.member.displayName)
        .setTimestamp()
        .setURL(message.url)
        .setTitle('Logged Message')
        .addField('Message Content', message.content);
        await client.channels.cache.get(config.loggingID).send(messageLogEmbed);
    }
}

async function receiveMessageUpdate(oldMessage, newMessage, client, Discord) {
    const config = require('../config.json');
    
    if (oldMessage.author.bot) return;
    else if (oldMessage.channel.id == config.loggingID) return;

    else {
        const messageLogEmbed = await new Discord.MessageEmbed()
        .setAuthor(oldMessage.member.displayName)
        .setTimestamp()
        .setURL(oldMessage.url)
        .setTitle('Logged Message Edit')
        .addField('Old Message Content', oldMessage.content)
        .addField('New Message Content', newMessage.content);
        await client.channels.cache.get(config.loggingID).send(messageLogEmbed);
    }
}

exports.receiveMessage = receiveMessage;
exports.receiveMessageUpdate = receiveMessageUpdate;