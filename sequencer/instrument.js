var pick = function (arr) {
  return arr[~~(Math.random() * arr.length)]
}

var Instrument = function(player, opts){
  this.player = player
  this.type = opts.type
  this.sections = opts.sections
  this.current = 0
}
var shifts = [ 0,
0.24993189866521384,
  0.2805381440146767,
  0.3336363636363637,
  0.3744897959183674,
  0.4203894616265751,
  0.4998637973304277,
  0.5611620795107034,
  0.6672727272727274,
  0.7489795918367348,
  0.8405863490609254 ]
console.log("UPTO", shifts.length)

Instrument.prototype.play = function(pos, ac, section, tick){
  if(Math.random() < this.sections[section].probs[this.current][pos]){
    if (pos % this.sections[section].mod == 0){
      if(this.type !== "drum"){
        var note = -(shifts[pick(this.sections[section].notes[this.current][pos]) || 0])
        var args = this.sections[section].args[this.current][pos]
        this.player.start(ac.currentTime, pick(args), note)
      } else {
        this.player.start(ac.currentTime)
      }
    }
  }
}

Instrument.prototype.next = function(section){
  this.current = pick(this.sections[section].nexts[this.current])
}

module.exports = Instrument
