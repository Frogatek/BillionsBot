module.exports = {
    name: 'blacklist',
    description: 'Lists the blacklist if no arguments are given, otherwise adds a minecraft account to the blacklist.',
    async execute(message, args) {
        const config = require('../config.json');
        const API_KEY = config['API_KEY'];
        const fetch = require('node-fetch');
        const Discord = require('discord.js');

		const blackList = require('quick.db');
        const subCommand = args[0];
        const userName = args[1];
        const banReason = args.slice(2).join(' ');

        if (subCommand == 'check') {
            UpdateData(message);
            return;
        } 

        else if (subCommand == 'add' && userName && banReason) {
            const resolvedUserUUID = await ReturnUUID();
            try {
                console.log(`Received blacklist request with ${args.length} args`);
                if (blackList.get(`${resolvedUserUUID}`)) {
                    message.channel.send('Looks like that user is already blacklisted.');
                }
    
                else {
                    addToBlacklist(resolvedUserUUID);
                }
            }

            catch(e) {
                console.log(e);
                message.reply('\nThere was an error.');
            }

        }

        else if (subCommand == 'find' && userName) {
            FindBlacklist(userName);
        }

        else {
            message.reply(`\nThis seems invalid, maybe you did something wrong?\nExamples: \n${config.prefix}blacklist \`check\`\n${config.prefix}blacklist \`add CurrentMCName reason\`\n${config.prefix}blacklist \`find CurrentMCName\``);
        }

        async function UpdateData() {
            try {
                const hypixelGuildResponse = await fetch(`https://api.hypixel.net/guild?name=billions&key=${API_KEY}`);
                const memberListJson = await hypixelGuildResponse.json();
                const memberList = await memberListJson.guild.members;
    
                const data = await fetch('https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json');
                const scammerList = await data.json();
    
                return RunChecks(memberList, scammerList);
            }
            catch(e) {
                console.log(e);
            }
        }

        async function FindBlacklist(giveName) {
            try {
                const findUUID = await ReturnUUID(giveName);
                const findBlacklistedUser = await blackList.get(`${findUUID}`);
                if (findBlacklistedUser) {
                    await message.reply(`\n**Blacklisted Name:** ${findBlacklistedUser.userName}\n**By:** ${findBlacklistedUser.addedBy}\n**When:** ${findBlacklistedUser.when}\n**Reason:** ${findBlacklistedUser.reason}`);
                }

                else {
                    message.reply('\nSomething went wrong, perhaps they changed their name?');
                }
            }

            catch (e) {
                console.log(e);
                message.reply('\nSomething went wrong, perhaps they changed their name?');
            }
        }
        
        async function RunChecks(memberList, scammerList) {
            console.log('Running a check!');
            let scammerFound = 0;
            const matches = [];
            let membersTotal = 0;
            let scammerFileTotal = 0;
            
            for (const member of memberList) {
                const checkedID = member.uuid;

                if (blackList.get(checkedID)) {
                    const blacklistedUser = blackList.get(checkedID);
                    message.channel.send(`\nBlacklisted user ${blacklistedUser.userName} is in the guild.\nReason: ${blacklistedUser.reason}`);
                }

                for (const key in scammerList) {
                    if (checkedID == key) {
                        scammerFound++;
                        matches.push(checkedID);
                        console.log(`${checkedID} is on the SBZ scammer list!`);
                    } 

                    /* else {
                        console.log(`Checked ${member.uuid} checked against ${key}`);
                    } */
                    scammerFileTotal++;
                }
                membersTotal++;
            }

            return SendResults(scammerFound, matches, scammerFileTotal, membersTotal);
        }

        async function SendResults(scammerFound, matches, scammerFileTotal, membersTotal) {
            message.channel.send(`\n${membersTotal} total members were checked ${scammerFileTotal} times and ${scammerFound} matches were found.`);
            if (scammerFound > 1) {
                for (const match of matches) {
                    message.channel.send(match);
                }
            }
        }

        async function ReturnUUID() {
            try {
                const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${userName}`);
                const mojangReponseJson = await mojangResponse.json();
                const returnValue = mojangReponseJson.id;
                return returnValue;
            }

            catch(e) {
                message.reply('\nThere was an error fetching their UUID, perhaps they changed their name?');
                console.log(e);
            }
        }

        async function addToBlacklist(resolvedUserUUID) {
            if (resolvedUserUUID == undefined) {
                console.log('resolved and undefined UUID');
            }

            else {
            const embed = new Discord.MessageEmbed()
            .addField('Minecraft Name', userName)
            .addField('UUID', resolvedUserUUID)
            .addField('Reason', banReason)
            .setFooter('If this was a mistake, send a DM to Rina!');
            await message.reply(embed);
            await blackList.set(`${resolvedUserUUID}`, { userName: userName, addedBy: message.author.tag, UUID: resolvedUserUUID, reason: banReason, when: Date() });
            }
        }
    },
};