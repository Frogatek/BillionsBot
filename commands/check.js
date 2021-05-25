module.exports = {
    name: 'check',
    description: 'Runs a check to see if a user meets guild requirements.',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const Discord = require('discord.js');

        if (args[0]) {
            ProcessCheck(message);
        }
        
        else {
            message.reply('\nDidn\'t find a name in your request, try again?');
            return;
        }

        async function ProcessCheck() {
            const data = await fetch('https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json');
            const scammerList = await data.json();
            const userName = args[0];
            const checkMember = await ReturnUUID(userName);
            if (!checkMember) return;
            const blackList = require('quick.db');

            await message.reply('\n⌛ Processing your request, it may take up to a few minutes ⌛')
            .then((msg) => {
                RunCheck(checkMember, scammerList, blackList, userName, msg);
            });

            return;
        }

        async function RunCheck(checkMember, scammerList, blackList, userName, msg) {
            console.log('Running a single user check!');
            let scammer = false;
            let meetsRequirements = false;
            if (blackList.get(`${checkMember}`)) {
                const blacklistedUser = await blackList.get(`${checkMember}`);
                const blackListedCheck = new Discord.MessageEmbed()
                .setTitle(`🚨 Blacklisted User - ${userName} 🚨`)
                .addField('Original Name', `${blacklistedUser.userName}`)
                .addField('Reason', `${blacklistedUser.reason}`)
                .addField('UUID', `${blacklistedUser.UUID}`)
                .addField('Added by', `${blacklistedUser.addedBy}`)
                .addField('When:', `${blacklistedUser.when}`);
                await msg.channel.send(blackListedCheck);
                await msg.edit('This user is blacklisted:');
                return;
            }

            else {
                for (const key in scammerList) {
                    if (checkMember == key) {
                        scammer = true;
                        console.log(`${checkMember} is on the SBZ scammer list!`);
                    } 
                }
                try {
                    const shiiyuResults = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${userName}`);
                    const shiiyuResultsJson = await shiiyuResults.json();
                    for (const key in shiiyuResultsJson.profiles) {
                        const profile = shiiyuResultsJson.profiles[key];
                        if (profile.data.average_level_no_progress > 15) {
                            meetsRequirements = true;
                        }
                    }   
                }
                catch (e) {
                    message.reply('\nError fetching data from Shiyyu, it could be laggy or down.');
                    console.log(e);
                }

                return await SendResults(meetsRequirements, scammer, msg);
            }
        }

        async function SendResults(meetsRequirements, scammer, msg) {
            if (meetsRequirements && !scammer) {
                msg.edit('\n✅ This user meets all of our requirements. ✅');
            }

            else if (scammer) {
                msg.edit('\n🛑 This user is on the SBZ scammer list and should not be accepted. 🛑');
            }

            else if (!meetsRequirements) {
                msg.edit('\n🛑 This user does not meet our requirements. 🛑');
            }
        }


        async function ReturnUUID(userName) {
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
    },
};