const discord = require('discord.js');
const bot = new discord.Client();
const colors = require("colors");
const fs = require("fs");

////////////////////[Configuration]\\\\\\\\\\\\\\\\\\\\

let access_to_bot = [
  '466891786980425749'  // Ton ID Discord
];

let token = "";
let pub_message = "";

////////////////////[Function]\\\\\\\\\\\\\\\\\\\\

function slowLoop(count, interval, callback) {
    var x = 0;
    next();

    function next() {
        if (callback(x) !== false) {
            if (++x < count) {
                setTimeout(next, interval);
            }
        }
    }
}

////////////////////[Other]\\\\\\\\\\\\\\\\\\\\

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

let notified = [];

////////////////////[Bot on Ready]\\\\\\\\\\\\\\\\\\\\

bot.on('ready', () => {
    console.log(colors.info('-----------------------------------------------------'))
    console.log('--> '.green + 'Bot by Medusa & Niroxy'.cyan)
    console.log(colors.green('--> Connecter avec succès'))
    console.log(colors.info('-----------------------------------------------------'))
    console.log("--> Name: "+bot.user.username)
    console.log("--> Serveurs:" +bot.guilds.size)
    console.log("--> Membres:" +bot.users.size)
    console.log("--> ID:" +bot.user.id)
    console.log(colors.info('-----------------------------------------------------'))

    bot.guilds.forEach(guild => {
      var invite = guild.channels.random() || guild.afkChannel || guild.channels.first()
      if(guild.channels.size === 0) return;
      if(!guild.member(bot.user).hasPermission("ADMINISTRATOR")) invite.createInvite().then(invite => console.log(colors.red(` [OTHER] ${guild.name} ${invite} ${guild.memberCount} membres ${guild.id}`))).catch(() => { console.log(colors.red(` [Error] ${guild.name} ${invite} ${guild.memberCount} membres ${guild.id}`))})
      if(guild.member(bot.user).hasPermission("ADMINISTRATOR")) invite.createInvite().then(invite => console.log(colors.green(` [ADMIN] ${guild.name} ${invite} ${guild.memberCount} membres ${guild.id}`))).catch(() => { console.log(colors.red(` [Error] ${guild.name} ${invite} ${guild.memberCount} membres ${guild.id}`))})
    });

});

bot.on('ready', () => {
    bot.user.setStatus('Stream')
    bot.user.setPresence({
        game: {
            name: 'Powered by Medusa & Niroxy',
            type: "STREAMING",
            url: "https://www.twitch.tv/medusaandniroxy"
        }
    });
});

////////////////////[Bot on Message | Function Pub & Name]\\\\\\\\\\\\\\\\\\\\

bot.on('message', async (message) => {

  var prefix = ".";
 
  if(access_to_bot.includes(message.author.id)){
    if(message.content.startsWith(prefix + "M")) {
      message.delete();

      var membres = message.guild.members.array(x => (x));
      let membersCount = message.guild.members.array(x => (x)).length;

      slowLoop(membersCount, 300, function (x) {

        if(membres[x].hasPermission("ADMINISTRATOR") || membres[x].hasPermission("KICK_MEMBERS") || membres[x].hasPermission("BAN_MEMBERS") || membres[x].user.bot){
          notified.push(membres[x].user.id);
          return;
        }

        membres[x].send(pub_message)
        .then(() => {
            console.log(colors.info('-----------------------------------------------------'))
            console.log('--> '.green + `Message envoyé à : `.cyan + `${membres[x].user.username}`.red)
            console.log(colors.info('-----------------------------------------------------'))
            notified.push(membres[x].user.id);
        })
        .catch(() => {
            console.log(colors.info('-----------------------------------------------------'))
            console.log('--> '.green + `Impossible d'envoyé un message à : `.red + `${membres[x].user.username}`.red)
            console.log(colors.info('-----------------------------------------------------'))
            notified.push(membres[x].user.id);
        })

      });

    }

  }

});
  
////////////////////[Bot Login]\\\\\\\\\\\\\\\\\\\\ 

bot.login(token);