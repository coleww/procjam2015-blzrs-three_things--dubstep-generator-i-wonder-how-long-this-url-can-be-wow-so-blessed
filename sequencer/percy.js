var Sampler = require('./sampler');

module.exports = function (ac) {
  var perkys = {
    a: new Sampler(ac, 'samples/perc.wav'),
    b: new Sampler(ac, 'samples/ride.wav'),
    c: new Sampler(ac, 'samples/shake.wav'),
    d: new Sampler(ac, 'samples/lase.wav'),
    e: new Sampler(ac, 'samples/meta.wav'),
    f: new Sampler(ac, 'samples/tom.wav')
  }
  return {
    audioNodes: perkys,
    start: function (when, arg, shift) {
        perkys[arg].pitchBend.setValueAtTime(shift, when)
        perkys[arg].start(when)
    },
    connect: function (destination) {
      Object.keys(perkys).forEach(function (k) {
        perkys[k].connect(destination)
      })
    }
  }

}