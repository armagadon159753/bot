const config = require("./config.json");
const Discord = require("discord.js");

const bot = new Discord.Client({ disableEveryone: true });

const ServerStats = {
  UsersID: "638347408354312203",
  MemberCountID: "638347864703107073",
  BotCountID: "638347962795163688"
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} est en ligne !`);
  bot.user.setStatus('Online');
    /*
  type=0 = PLAYING
  type=1 = STREAMING  
  type=2 = LISTENING
  type=3 = WATCHING
  */
  bot.user.setPresence({ game: { name: 'SoulWorker',type: "STREAMING", url: "https://www.twitch.tv/armthedev"} });
});

bot.on("guildMemberAdd", member =>{
  var role = member.guild.roles.find(role => role.name === config.grade_non_vérifié);
  member.addRole(role);
  //Update Server Stats When Someone join the server.
  bot.channels.get(ServerStats.UsersID).setName(`Total Users : ${bot.guilds.reduce((a, g) => a + g.memberCount, 0)}`);
  bot.channels.get(ServerStats.MemberCountID).setName(`Total Member : ${member.guild.members.filter(member => !member.user.bot).size}`);
  bot.channels.get(ServerStats.BotCountID).setName(`Total Bots : ${member.guild.members.filter(member => member.user.bot).size}`);
});

bot.on("guildMemberRemove", member => {
  //Update Server Stats When Someone leave the server.
  bot.channels.get(ServerStats.UsersID).setName(`Total Users : ${bot.guilds.reduce((a, g) => a + g.memberCount, 0)}`);
  bot.channels.get(ServerStats.MemberCountID).setName(`Total Member : ${member.guild.members.filter(member => !member.user.bot).size}`);
  bot.channels.get(ServerStats.BotCountID).setName(`Total Bots : ${member.guild.members.filter(member => member.user.bot).size}`);
});

  bot.on("raw", data =>{
    if(data.t === "MESSAGE_REACTION_ADD"){
      if(data.d.channel_id === "614446384040509510"){
        if(data.d.message_id === "614469392893214731"){
          if(data.d.emoji.name === "✅"){
            bot.channels.get("614446384040509510").guild.member(bot.users.get(data.d.user_id)).addRole(bot.channels.get("614446384040509510").guild.roles.find(ch => ch.name === config.grade_vérifié));
            bot.channels.get("614446384040509510").guild.member(bot.users.get(data.d.user_id)).removeRole(bot.channels.get("614446384040509510").guild.roles.find(ch => ch.name === config.grade_non_vérifié));

          }
        }
      }
    }
    else if(data.t === 'MESSAGE_REACTION_REMOVE'){
      if(data.d.channel_id === "614446384040509510"){
        if(data.d.message_id === "614469392893214731"){
          if(data.d.emoji.name === "✅"){
            bot.channels.get("614446384040509510").guild.member(bot.users.get(data.d.user_id)).removeRole(bot.channels.get("614446384040509510").guild.roles.find(ch => ch.name === config.grade_vérifié));
            bot.channels.get("614446384040509510").guild.member(bot.users.get(data.d.user_id)).addRole(bot.channels.get("614446384040509510").guild.roles.find(ch => ch.name === config.grade_non_vérifié));
          }
        }
      }
    }
  })
bot.login(process.env.TOKEN);