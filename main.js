const Discord = require('discord.js');
const fs = require('fs');
const adminList = require('quick.db');

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

client.on('message', message => {
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (message.author.bot) return;

	else if (!message.content.startsWith(prefix) || !client.commands.has(command)) {
		console.log(`\n${message.member.nickname} in ${message.channel.name}: ${message.content}`);
	}

	else if (!adminList.get(message.author.id)) {
		if (message.author.id == '529568949436809238') {
			try {
				console.log(`Executing command by ${message.author.tag}`);
				client.commands.get(command).execute(message, args, config);	
			}

			catch (e) {
				console.log(e);
			}
		}

		else {
			console.log(`${message.author.tag} tried to use a command but was rejected.`);
			message.reply('\nSorry, this bot is for officer+ only.');
			
		}
	}

	else {
		try {
			console.log(`Executing command by ${message.author.tag}`);
			return client.commands.get(command).execute(message, args, config);
		}

		catch (e) {
			console.log(e);
		}
	}
});

client.login(config.token);