const Discord = require('discord.js');
const fs = require('fs');
const adminList = require('quick.db');
const discLogger = require('./util/discLogger.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const config = require('./config.json');
const prefix = config.prefix;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { type: 'WATCHING', name: 'YOU' }, status: 'online' })
		.catch(console.error);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	console.log('Saw a message update');
	discLogger.receiveMessageUpdate(oldMessage, newMessage, client, Discord);
});

client.on('message', message => {
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (!message.member || message.author.bot) return;

	if (message.member.id != '529568949436809238') {
		discLogger.receiveMessage(message, client, Discord);
	}

	if (adminList.get(message.author.id) && client.commands.get(command)) {
		try {
			console.log(`Executing command by ${message.author.tag}`);
			client.commands.get(command).execute(message, args, config);	
			return;
		}

		catch (e) {
			console.log(e);
		}
	}

	else if (message.content.startsWith(prefix)) {
		console.log(`${message.author.tag} tried to use a command but was rejected.`);
		message.reply('\nSorry, this bot is for officers only.');
		return;
	}

	else {
		return;
	}
});

client.login(config.token);