module.exports = {
    name: 'whitelist',
    isCommand: 'true',
    description: 'Allows users to use the bot.',
    async execute(message) {
        const adminList = require('quick.db');
        if (message.author.id == '529568949436809238') {
            if (message.mentions.members.size > 0) {
                message.mentions.members.every(member => {
                    try {
                        adminList.set(member.id, { addedBy: message.author.id, currentDate: new Date(), whiteListed: true });
                        message.reply(`\nAdding ${member.displayName} to the whitelist with ID ${member.id}`);
                    }
                    
                    catch (e) {
                        console.log(e);
                        message.reply('\nSomething went wrong, do you have the blacklist locked?');
                    }
                });
            }

            else {
                message.reply('\nYou must mention users to add them to the whitelist.');
            }
        }

        else {
            message.reply('\nYou don\'t have permission to use that command.');
        }
    },
};