console.log("v1.0.0")
var Sequencer = require('../sequencer')
var songData = require('../the_song');

var worker = new Worker('./recorderWorkerMP3.js')
var seq = new Sequencer(songData, worker);
seq.run()

