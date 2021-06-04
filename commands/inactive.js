module.exports = {
    name: 'inactive',
    description: 'Generates a list of inactive guild members.',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const Discord = require('discord.js');
        const config = require('../config.json');
        const API_KEY = config.API_KEY;
        const inactiveLimit = 6;

        const hypixelGuildResponse = await fetch(`https://api.hypixel.net/guild?name=billions&key=${API_KEY}`);
        const memberListJson = await hypixelGuildResponse.json();
        const memberList = await memberListJson.guild.members;

        const inactiveMembers = [];

        async function checkInactives() {
            for (const member in memberList) {
                let xp = memberList[member].expHistory;
                const uuid = memberList[member].uuid;
                const rank = memberList[member].rank;
                let inactiveDays = 0;

                if (rank === 'Officer' || rank === 'Leader' || rank == 'Guild Master') {
                    continue;
                }

                xp = Object.values(xp);
                for (const value in xp) {
                    const currentIteration = xp[value];
                    if (currentIteration === 0) {
                        inactiveDays++;
                    }
                }

                if (inactiveDays > inactiveLimit) {
                    const mojangResponse = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
                    const mojangResponseJson = await mojangResponse.json();
                    const name = await mojangResponseJson.pop().name;
                    inactiveMembers.push(name);
                }
            }

            if (inactiveMembers[0]) {
                message.channel.send(inactiveMembers);
            }

            else {
                message.channel.reply('\nUnable to find any inactive members.');
            }
        }

        await checkInactives();
    },
};