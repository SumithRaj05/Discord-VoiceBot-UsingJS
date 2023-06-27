const gTTS = require('gtts');
	
let speech = 'Welcome to GeeksforGeeks';
const gtts = new gTTS(speech, 'en');

gtts.save('Voice.mp3', function (err){
	if(err) { throw new Error(err); }
});
