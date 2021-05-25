module.exports = {
    name: 'check',
    isCommand: 'true',
    description: 'Runs a check to see if a user meets guild requirements.',
    async execute(message, args) {
        const fetch = require('node-fetch');

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

            return RunCheck(checkMember, scammerList, blackList, userName);
        }

        async function RunCheck(checkMember, scammerList, blackList, userName) {
            console.log('Running a single user check!');
            let scammer = false;
            let meetsRequirements = true;
            if (blackList.get(`${checkMember}`)) {
                const blacklistedUser = blackList.get(`${checkMember}`);
                message.reply(`\n${blacklistedUser.userName} is blacklisted from the guild.\nReason: ${blacklistedUser.reason}\n${blacklistedUser.UUID}`);
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
                        if (profile.data.dungeons.catacombs.visited != false) {
                            if (profile.data.average_level_no_progress < 15) {
                                meetsRequirements = false;
                            }
                        }
                    }   
                }
                catch (e) {
                    message.reply('\nError fetching data from Shiyyu, it could be laggy or down.');
                    console.log(e);
                }

                return SendResults(meetsRequirements, scammer);
            }
        }

        async function SendResults(meetsRequirements, scammer) {
            if (meetsRequirements && !scammer) {
                message.reply('\nThis player meets our requirements and can be accepted.');
            }

            else {
                message.reply('\nThis user does not meet our requirements.');
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