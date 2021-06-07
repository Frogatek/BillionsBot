async function receiveMessage(message, client, Discord) {
    const config = require('../config.json');
    
    if (message.author.bot) return;
    else if (message.channel.id == config.loggingID) return;
    else if (!message.content) return;

    else {
        const messageLogEmbed = await new Discord.MessageEmbed()
        .setDescription(message.member)
        .setTimestamp()
        .setFooter(`ID: ${message.author.id}`)
        .setURL(message.url)
        .setThumbnail(message.author.avatarURL())
        .setTitle('Logged Message')
        .addField('Message Content', message.content);
        await client.channels.cache.get(config.loggingID).send(messageLogEmbed);
    }
}

async function receiveMessageUpdate(oldMessage, newMessage, client, Discord) {
    const config = require('../config.json');
    
    if (oldMessage.author.bot) return;
    else if (oldMessage.channel.id == config.loggingID) return;
    else if (oldMessage.content === newMessage.content) return;

    else {
        const messageLogEmbed = await new Discord.MessageEmbed()
        .setDescription(oldMessage.member)
        .setTimestamp()
        .setFooter(`ID: ${oldMessage.author.id}`)
        .setURL(oldMessage.url)
        .setThumbnail(oldMessage.author.avatarURL())
        .setTitle('Logged Message Edit')
        .addField('Old Message Content', oldMessage.content)
        .addField('New Message Content', newMessage.content);
        await client.channels.cache.get(config.loggingID).send(messageLogEmbed);
    }
}

async function receiveMessageDeletion(message, client, Discord) {
    const config = require('../config.json');

    if (message.author.bot) return;
    else if (message.channel.id == config.loggingID) return;

    else {
        const messageLogEmbed = await new Discord.MessageEmbed()
        .setDescription(message.member)
        .setTimestamp()
        .setFooter(`ID: ${message.author.id}`)
        .setURL(message.url)
        .setThumbnail(message.author.avatarURL())
        .setTitle('Logged Message Deletion')
        .addField('Deleted Message', message.content)
        .addField('Channel', message.channel)
        .addField('**Important note for officers**', 'This only displays the deleted message.\nThe Discord API does not display who deleted it.\nCheck the audit logs (right click server) for that.');
        await client.channels.cache.get(config.loggingID).send(messageLogEmbed);
    }
}

exports.receiveMessage = receiveMessage;
exports.receiveMessageUpdate = receiveMessageUpdate;
exports.receiveMessageDeletion = receiveMessageDeletion;