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
  this.key = data.key;
  this.section = data.section || "intro"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]
  this.position = 0;
  this.steps = data.steps;
  this.vol = this.ac.createGainNode()
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
      instrument.play(that.position, that.ac, that.key, that.section);
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

      that.instruments.forEach(function(instrument){
        instrument.next();
      });


      // UMMM if there isn't one then i think u should stop? i guess?
      // TODO
      // DOTHIS
      // ITS REALLY BAD

      // EXCEPT NOT ON THE INTRO OR BRIDGE, PUT SOME LIKE "OHHHHH YEAHHH WHOOOO HOOOOO AT RANDOM THERE INSTEAD!"
      if (that.section == 'bridge'){

      } else {

      }
        // console.log('.')
        // var msg = new SpeechSynthesisUtterance(lik.split("/")[0]);
        // msg.rate = 0.8
        // window.speechSynthesis.speak(msg);

      var inter
      var ii = 0
      // inter = window.setInterval(function(){

        // HMMM kill
        // console.log('.')
      //   if(ii == 16) window.clearInterval(inter)
      // }, tick / 16.0)
      // ..../ hmm set interval to updat ethe progress bar, and then wipe it on next run?


      // UMMM how to animate the singing...hmmm...there could be magic here...
      // OH SHIT A PROGRESS BAR DOES THIS EXACTLY! SET IT ON A TIMER FOR THE LENGTH OF THE THING, THEN DUMP IT.
      // FUCK YEAH FUCK YEAH SCIENCE

      if(!that.section) {
        that.stop(that.ac.currentTime)
        that.instruments.forEach(function(i){
          if(i.type !== 'drum') {
            i.player.frequency.value = 500
            i.player.stop(that.ac.currentTime)
          }
        })
        that.recorder.stop()
        that.createDownloadLink()
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};

module.exports = Sequencer;