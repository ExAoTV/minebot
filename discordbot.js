var discord = require('discord.js');
var client = new discord.Client();

var ReactionRole_MessageID = '740563528305606677';
var ReactionRole_Emoji     = '✅';
var ReactionRole_RoleID    = '740554391735762995';

client.on('raw', packet => {
    
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

client.on('messageReactionAdd', (reaction, user) => {

    var reactionMessage = reaction.message;
    if(reactionMessage.id != ReactionRole_MessageID) {return;}
    var reactionEmoji = reaction.emoji;
    if(reactionEmoji != ReactionRole_Emoji) {return reaction.remove(user);}

    var member = reactionMessage.guild.members.get(user.id);
    member.addRole(reactionMessage.guild.roles.get(ReactionRole_RoleID));
})

client.on('messageReactionRemove', (reaction, user) => {

    var reactionMessage = reaction.message;
    if(reactionMessage.id != ReactionRole_MessageID) {return;}
    var member = reactionMessage.guild.members.get(user.id);
    member.removeRole(reactionMessage.guild.roles.get(ReactionRole_RoleID));
})

client.login("NzQwMjA2MTYwNTMxMDMwMDU2.XylotQ.pzCKX45Jam1oKZG5PNDyuG2dDD4");