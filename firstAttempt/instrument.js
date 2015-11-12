var int2freq = require("int2freq");

var Instrument = function(player, opts, wobble){
  this.player = player;
  this.name = opts.name;
  this.type = opts.type;
  this.sections = opts.sections
  this.current = 0;
  this.playing = false;
  this.wobble = wobble

}

Instrument.prototype.play = function(pos, ac, key, section, tick){
  console.log(section, this.sections[section], this.current, pos)
  if(Math.random() < this.sections[section].probs[this.current][pos] && (pos % this.sections[section].mod == 0)){
    if (this.type !== 'drum') {
      var noteInt = this.sections[section].notes[this.current][pos][~~(Math.random() * this.sections[section].notes[this.current][pos].length)]
      if(!noteInt) noteInt = 0;
      var freq
      try {
        freq = int2freq(~~noteInt, key);
      } catch (e) {
        if (this.name !== 'vox') console.log(e)
      }
      // TODO:
      // WRAP THIS BUSINESS?

  // HRRRM handle if it is the vox?
  // TODO: make this a function that takes a this cuse the timeout thing below for arpegiis is super absurd
      if (this.name == 'vox') {
        // play the screamy voice instrument, but pull the whatever
        // um it would be noteInt for which sample 2 play
      } else if(freq && ['sine', 'triangle', 'square', 'sawtooth'].indexOf(this.type !== -1)) {
        this.player.frequency.value = freq//, ac.currentTime);
        this.player.start(ac.currentTime);
        this.playing = true;
      } else if (freq) {
        // ITS A CUSTOM SYNTH OBJECT!!! WOOHOOO!!!!
      }
      var that = this



      if(this.name == 'solo' && Math.random() < this.sections[section].probs[this.current][pos]){
        window.setTimeout(function(){
          var noteInt2 = that.sections[section].notes[that.current][pos][~~(Math.random() * that.sections[section].notes[that.current][pos].length)]
          if(!noteInt2) noteInt2 = 0;
          var freq2 = int2freq(~~noteInt2, key);


          // TODO:
          // WRAP that BUSINESS?
          if(freq2 && ['sine', 'triangle', 'square', 'sawtooth'].indexOf(that.type !== -1)){
            that.player.frequency.setValueAtTime(freq2, ac.currentTime);
            that.player.start(ac.currentTime);
            window.setTimeout(function() {
              that.player.stop(0)
            }, tick / 2.0)
            that.playing = true;
          } else if (freq2) {
             // ITS A CUSTOM SYNTH OBJECT!!! WOOHOOO!!!!
          }
        }, tick / 2.0)
      }


      if(this.name == 'bounce'){
        var freq3 = int2freq(noteInt + 7, key) // up an 8v // unless its a pentatonic scale, in which case it'll get REAL WEIRD (cool)
        window.setTimeout(function(){
          that.wobble.lfo.frequency.value = [0.5, 1, 1.5, 2][pos % 4]
          that.player.frequency.setValueAtTime(freq3, ac.currentTime);
          // that.player.start();
          that.playing = true;
        }, tick / 2.0)
      }
    } else {
      // just a drum!
      // this.player.start(ac.currentTime);
    }
  } else {
    if(this.type !== "drum"){
      // TODO:
      // ADSR?
      if(this.playing) this.player.stop(0);
      this.playing = false
    }
  }
}

module.exports = Instrument;