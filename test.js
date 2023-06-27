const gTTS = require('gtts')
	
const speech = 'hoi hoi'
const gtts = new gTTS(speech, 'en');

gtts.save('Voice.mp3', function (err){
	if(err) { throw new Error(err); }
});
