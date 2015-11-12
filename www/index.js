var Sequencer = require('../sequencer')

console.log("v1.1.3")
var songData = require('../the_song');


var loadSample2Buff = require('load-sample-2-buff')
var SamplePlayer = require('openmusic-sample-player')
var seq = new Sequencer(songData);
seq.run()
