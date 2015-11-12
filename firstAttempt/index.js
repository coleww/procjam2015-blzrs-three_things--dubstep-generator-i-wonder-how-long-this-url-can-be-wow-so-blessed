var createInstruments = require('./instruments');
var pick = require('pick-random')
function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(data){
  var ac = new (window.AudioContext || window.webkitAudioContext)();
  this.ac = ac
  this.bpm = data.bpm;
  this.instruments = createInstruments(ac, data.instruments);
  this.interval = null;
  this.key = data.key;
  this.section = "verse"//data.section || "verse"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]

  this.nextSections = {
    "intro": ["intro", "verse"],
    "verse": ["verse", "verse", "chorus"],
    "chorus": ["chorus", "chorus", "verse", "bridge", "outro"],
    "bridge": ["bridge", "chorus", "outro"],
    "outro": ["outro", false]
  }


  this.position = 0;
  this.steps = data.steps;
};

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.interval = window.setInterval(function(){
    that.instruments.forEach(function(instrument){
      if (instrument.name == 'solo' ) {
        if (that.section == 'bridge') instrument.play(that.position, that.ac, that.key, that.section, tick)
      } else {
        instrument.play(that.position, that.ac, that.key, that.section);
      }
    })
    that.position++;

    if(that.position >= that.steps) {
      that.instruments.forEach(function(instrument){
        instrument.current = 0;
      });
      that.position = 0;

      // RIGHT HERE DO THAT MAGIC!
      // MAKE THE SECTIONS THE MAGIC!
      that.section = pick(that.nextSections[that.section])[0]

      if(!that.section) {
        that.stop()
        that.instruments.forEach(function(i){
          if(i.type !== 'drum') {
            i.player.frequency.value = 500
            i.player.stop(0)
          }
        })
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};


module.exports = Sequencer;