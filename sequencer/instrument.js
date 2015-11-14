var pick = require('pick-random')

var Instrument = function(player, opts){
  this.player = player
  this.type = opts.type
  this.sections = opts.sections
  this.current = 0
}

Instrument.prototype.play = function(pos, ac, key, section, tick){
  if(Math.random() < this.sections[section].probs[this.current][pos]){
    if(this.type !== "drum"){
      var note = pick(this.sections[section].notes[this.current][pos])[0]
      var args = pick(this.sections[section].args[this.current][pos])[0]
      this.player.start(ac.currentTime, arg, note)
    } else {
      this.player.start(ac.currentTime)
    }
  }
}

Instrument.prototype.next = function(){
  this.current = pick(this.sections[this.section].nexts)[0]
}

module.exports = Instrument
