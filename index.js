const { Client, GatewayIntentBits } = require('discord.js');
const gTTS = require('gtts');
const dotenv = require('dotenv')

const fs = require("fs")

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus } = require('@discordjs/voice');


dotenv.config("./.env")

const tts = (text) => {
  let speech = text;
  const gtts = new gTTS(speech, 'en');

  gtts.save('speech.mp3', function (err) {
    if (err) { throw new Error(err); }
  });
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

async function sendVoiceRecording(channel, audioFilePath) {
  try {
    await channel.send('Here is your voice recording:');
    await channel.send({
      files: [{
        attachment: audioFilePath,
        name: 'recording.mp3',
      }],
    });
  } catch (error) {
    console.error('Error sending voice recording:', error);
  } finally {
    fs.unlinkSync(audioFilePath); // Delete the temporary audio file
  }
}

client.on('messageCreate', async (msg) => {

  if (msg.author.bot) {
    return
  }

  console.log("user:", msg.content)
  try {

    tts(msg.content)
  } catch (err) {
    console.log(err)
  }

  const channel = msg.member.voice.channel;
  if (!channel) {
    msg.reply({ content: "You are not in a voice channel." });
    return;
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })

  // const player = createAudioPlayer();
  // const resource = createAudioResource("./speech.mp3");

  // player.play(resource);

  // player.once(AudioPlayerStatus.Idle, () => {
  //   connection.destroy();
  // });

  // player.on('error', (error) => {
  //   console.error(error)
  //   connection.destroy()
  // });

  // const subscription = connection.subscribe(player)
  // if (subscription) {
  //   setTimeout(() => {
  //     subscription.unsubscribe();
  //     connection.destroy();
  //   }, 15000);
  // }

  sendVoiceRecording(msg.channel, "./speech.mp3")

  // return msg.reply({ content: msg.content })
})

client.login(process.env.TOKEN);
