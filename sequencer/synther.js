var Sampler = require('./sampler');


module.exports = function (ac) {
  var samples = {
    bell: new Sampler(ac, 'samples/bellc.wav'),
    clar: new Sampler(ac, 'samples/clarine.wav'),
    b: new Sampler(ac, 'samples/guitarc1.wav'),
    a: new Sampler(ac, 'samples/guitarc2.wav')
  }
  return {
    audioNodes: samples,
    start: function (when, arg, shift) {
      arg.forEach(function (arg) {

        samples[arg].pitchBend.setValueAtTime(shift, when)
        samples[arg].start(when)
      })
    },
    connect: function (destination) {
      Object.keys(samples).forEach(function (k) {
        samples[k].connect(destination)
      })
    }
  }

}