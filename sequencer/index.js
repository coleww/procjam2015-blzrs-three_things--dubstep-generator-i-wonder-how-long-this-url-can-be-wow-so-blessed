var createInstruments = require('./instruments');
var Recorder = require('./recorder')
function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(data){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  this.ac = new AudioContext();
  this.bpm = data.bpm;
  this.instruments = createInstruments(this.ac, data.instruments);
  this.interval = null;
  this.section = data.section || "intro"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]
  this.position = 0;
  this.steps = data.steps;
  this.vol = this.ac.createGain()
  this.vol.gain.setValueAtTime(0.151, this.ac.currentTime)
  this.recorder = new Recorder(this.vol, {workerPath: 'js/recorderjs/recorderWorkerMP3.js'})
};

Sequencer.prototype.createDownloadLink = function () {
  var that = this
  this.recorder && this.recorder.exportAudio(function(blob) {
    that.recorder.forceDownload(blob)
    var url = URL.createObjectURL(blob);
    var hf = document.createElement('a');
    hf.href = url;
    hf.download = new Date().toISOString() + '.mp3';
    hf.innerHTML = hf.download;
    document.body.appendChild(hf);
  })
}

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.recorder.record()
  this.interval = window.setInterval(function(){
    that.instruments.forEach(function(instrument){
      instrument.play(that.position, that.ac, that.section);
    })
    that.position++;


    // if (that.position == ~~(that.steps / 2)){
    //   // var msg = new SpeechSynthesisUtterance(that.savedLik);
    //   // // msg.rate = 0.75x
    //   // window.speechSynthesis.speak(msg);
    // }


    if(that.position >= that.steps) {

      // do this less often and only in modulo 2s,
      // let individual instruments update their next for that pattern

      that.position = 0;
      var old = that.section
      that.section = that.sections.shift()
      if (that.section !== old) console.log('ADVANCING', that.section)
      that.instruments.forEach(function(instrument){
        instrument.next(that.section);
      });


      if(!that.section) {
        that.stop(that.ac.currentTime)
        // that.instruments.forEach(function(i){
          // if(i.type !== 'drum') {
          //   i.player.frequency.value = 500
          //   i.player.stop(that.ac.currentTime)
          // }
        // })
        that.recorder.stop()
        that.createDownloadLink()
        throw "up"
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};

module.exports = Sequencer;