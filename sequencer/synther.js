var Sampler = require('./sampler');


module.exports = function (ac) {
  var samples = {
    bell: new Sampler(ac, 'samples/bellc.wav'),
    clar: new Sampler(ac, 'samples/clarine.wav')
  }
  return {
    audioNodes: samples,
    start: function (when, arg, shift) {
      // console.log(arg, shift)
        samples[arg].pitchBend.setValueAtTime(shift, when)
        samples[arg].start(when)
    },
    connect: function (destination) {
      Object.keys(samples).forEach(function (k) {

        var g = ac.createGain()
        g.gain.value = 0.53

        samples[k].connect(g)
        g.connect(destination)
      })
    }
  }

}