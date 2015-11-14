var Sampler = require('./sampler');
var semi = 5.946
module.exports = function (ac) {
  var player = new Sampler(ac, 'samples/'+data.name+'.wav');
  var samples = {
    bell: new Sampler(ac, 'samples/bellc.wav'),
    clar: new Sampler(ac, 'samples/clarine.wav'),
    g1: new Sampler(ac, 'samples/guitarc1.wav'),
    g2: new Sampler(ac, 'samples/guitarc2.wav')
  }
  return {
    audioNodes: samples,
    start: function (when, arg, shift) {
      arg.forEach(function (arg) {
        samples[arg].pitchBend.value = ~~shift * semi
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