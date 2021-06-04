async function getMemberSize() {
    const fetch = require('node-fetch');
    const config = require ('../config.json');
    const API_KEY = config.API_KEY;

    const hypixelResponse = await fetch(`https://api.hypixel.net/guild?name=billions&key=${API_KEY}`);
    const hypixelResponseJson = await hypixelResponse.json();
    const memberList = await hypixelResponseJson.guild.members;

    const memberCount = memberList.length;
    return memberCount;
}

exports.getMemberSize = getMemberSize;