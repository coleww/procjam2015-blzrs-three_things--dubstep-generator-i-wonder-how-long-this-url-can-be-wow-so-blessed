var Sampler = require('./sampler');

module.exports = function (ac) {
  var wobbles = {
    a: new Sampler(ac, 'samples/wob3.wav'),
    b: new Sampler(ac, 'samples/wobac.wav'),
    c: new Sampler(ac, 'samples/wobb2.wav'),
    d: new Sampler(ac, 'samples/wobblek.wav'),
    e: new Sampler(ac, 'samples/wobblek2.wav'),
    f: new Sampler(ac, 'samples/wobbleq.wav'),
    g: new Sampler(ac, 'samples/woblip.wav'),
    h: new Sampler(ac, 'samples/wobmid.wav'),
    i: new Sampler(ac, 'samples/wobp.wav'),
    j: new Sampler(ac, 'samples/wub140.wav')
  }
  return {
    audioNodes: wobbles,
    start: function (when, arg, shift) {
        console.log("HIGH")
        wobbles[arg].pitchBend.setValueAtTime(shift, when)
        wobbles[arg].start(when)
    },
    connect: function (destination) {
      Object.keys(wobbles).forEach(function (k) {

        var g = ac.createGain()
        g.gain.value = 0.35

        wobbles[k].connect(g)
        g.connect(destination)
      })
    }
  }

}