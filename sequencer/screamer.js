var Sampler = require('./sampler');
module.exports = function (ac) {
  var voices = {
    a: new Sampler(ac, 'samples/scream1.wav'),
    b: new Sampler(ac, 'samples/scream2.wav'),
    c: new Sampler(ac, 'samples/scream3.wav'),
    d: new Sampler(ac, 'samples/scream4.wav'),
    e: new Sampler(ac, 'samples/scream5.wav'),
    f: new Sampler(ac, 'samples/scream8.wav'),
    g: new Sampler(ac, 'samples/scream9.wav'),
    h: new Sampler(ac, 'samples/scream10.wav'),
    i: new Sampler(ac, 'samples/scream11.wav')
  }
  return {
    audioNodes: voices,
    start: function (when, arg, shift) {
      arg.forEach(function (arg) {
        voices[arg].pitchBend.setValueAtTime(shift, when)
        voices[arg].start(when)
      })
    },
    connect: function (destination) {
      Object.keys(voices).forEach(function (k) {
        voices[k].connect(destination)
      })
    }
  }

}