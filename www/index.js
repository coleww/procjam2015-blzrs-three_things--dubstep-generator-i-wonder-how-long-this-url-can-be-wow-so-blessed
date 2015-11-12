console.log("v1.0.0")
var Sequencer = require('../sequencer')
var songData = require('../the_song');
var seq = new Sequencer(songData);
seq.run()
