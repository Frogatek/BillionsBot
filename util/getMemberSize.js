async function updateMemberSize(client) {
    const fetch = require('node-fetch');
    const config = require ('../config.json');
    const API_KEY = config.API_KEY;

    const hypixelResponse = await fetch(`https://api.hypixel.net/guild?name=billions&key=${API_KEY}`);
    const hypixelResponseJson = await hypixelResponse.json();
    const memberList = await hypixelResponseJson.guild.members;
    const guildMembers = memberList.length;

    if (guildMembers) {
        client.user.setPresence({ activity: { type: 'WATCHING', name: `${guildMembers} members` }, status: 'online' })
        .catch(console.error);
        console.log(`Ran hourly check at ${Date()}`);
    }

    else {
        return console.log('Error during the hourly member refresh.');
    }
}

exports.updateMemberSize = updateMemberSize;