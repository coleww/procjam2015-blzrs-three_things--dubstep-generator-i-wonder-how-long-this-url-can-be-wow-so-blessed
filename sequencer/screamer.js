var Sampler = require('./sampler');

var loadSample2Buff = require('load-sample-2-buff')
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
        voices[arg].pitchBend.setValueAtTime(shift, when)
        voices[arg].start(when)
    },
    connect: function (destination) {
      // var convolver = ac.createConvolver();
      // loadSample2Buff(ac, 'concert-crowd.ogg', function(buffer){
      //   convolver.buffer = buffer
      // })
      Object.keys(voices).forEach(function (k) {
        var g = ac.createGain()
        g.gain.value = 0.1

        voices[k].connect(g)
        g.connect(destination)
      })

      // convolver.connect(destination)
    }
  }

}