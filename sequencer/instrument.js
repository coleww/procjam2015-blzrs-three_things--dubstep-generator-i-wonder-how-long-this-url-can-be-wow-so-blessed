var pick = function (arr) {
  return arr[~~(Math.random() * arr.length)]
}

var Instrument = function(player, opts, dist, filt){
  this.player = player
  this.type = opts.type
  this.name = opts.name
  this.dist = dist
  this.filt = filt
  this.sections = opts.sections
  this.current = 0

this.shifts = [ 0, 0.8405863490609254,
  0.7489795918367348,
  0.6672727272727274,
  0.5611620795107034,
  0.4998637973304277,
  0.4203894616265751,
  0.3744897959183674,
  0.3336363636363637,
  0.2805381440146767,
  0.24993189866521384 ]//.reverse()
}
// console.log("UPTO", shifts.length)

// chagng here signgigisdgisdgidsgids
// WHAT IF//

//  the three things said 2 u depend on some factors.
// whether it is positive or negative notes
// whether it is hecka fast or only kinda fast
// whether to fux the shifts before processing? idk.
// set 3 break points,
//    and at those points,
// change the globals that get passed to all the stuff


//

Instrument.prototype.play = function(pos, ac, section, tick, dir, divis, op, gmod){
  // console.log(this.name)
  if(this.sections[section] && Math.random() < this.sections[section].probs[this.current][pos]){
    if (pos % (this.sections[section].mod * gmod) == 0){
      if(this.type !== "drum"){
        var note = (this.shifts[pick(this.sections[section].notes[this.current][pos]) || 0]) * dir// (Math.random() < 0.3) ? -1 : 1
        if (op == 'multi') {
          note *= divis
        } else {
          note /= divis
        }

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

Instrument.prototype.updateFX = function(data){
  //
}


module.exports = Instrument
