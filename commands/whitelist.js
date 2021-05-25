module.exports = {
    name: 'whitelist',
    description: 'Allows users to use the bot.',
    async execute(message, args) {
        const adminList = require('quick.db');

        const subCommand = args[0];
        const input = args[1];
        const config = require('../config.json');
        const prefix = config.prefix;

        if (message.author.id == '529568949436809238') {
            if (subCommand == 'add') {
                if (message.mentions.members.size > 0) {
                    message.mentions.members.every(member => {
                        try {
                            adminList.set(member.id, { addedBy: message.author.id, currentDate: new Date(), whiteListed: true });
                            message.reply(`\nAdding ${member.displayName} to the whitelist with ID ${member.id}`);
                        }
                        
                        catch (e) {
                            console.log(e);
                            message.reply('\nSomething went wrong, do you have the whitelist locked?');
                        }
                    });
                }

                else if (input.length === 18) {
                    adminList.set(input, { addedBy: message.author.id, currentDate: new Date(), whiteListed: true });
                    message.reply(`\nAdding Discord ID ${input} to the whitelist.`);
                }
            }

            else if (subCommand == 'remove') {
                if (input === 18) {
                    adminList.delete(input);
                    message.reply(`\nRemoving Discord ID ${input} to the whitelist.`);
                }
            }

            else {
                message.reply(`Didn't get that, try again? Example:\n${prefix}whitelist \`add ID\`\n${prefix}whitelist \`remove ID\``);
            }
        }

        else {
            message.reply('\nYou don\'t have permission to use that command.');
        }
    },
};