var Sampler = require('./sampler');
var Instrument = require('./instrument');
var loadSample2Buff = require('load-sample-2-buff')
var makeDistortionCurve = require('make-distortion-curve')
var Tuna = require('tunajs')

module.exports = function createInstruments(ac, instrumentData, vol){
  var instruments = [];
  var tuna = new Tuna(ac);
  var convolver = ac.createConvolver();
  loadSample2Buff(ac, 'concert-crowd.ogg', function(buffer){
    convolver.buffer = buffer
  })

  var insts = {
    wub: require('./wobbler'),
    scream: require('./screamer'),
    synth: require('./synther'),
    guitar: require('./guitar')
  }


  instrumentData.forEach(function(data){
    var player;
    if(data.type == 'drum'){
      player = new Sampler(ac, 'samples/' + data.name + '.wav')
    } else {
      // console.log(data.type)
      player = insts[data.type](ac)
    }

    var gainNode = ac.createGain()

   var g = ~~ - 0.7
    gainNode.gain.setValueAtTime(data.gain, ac.currentTime)

    var filter = ac.createBiquadFilter()
    filter.type = data.filterType || 'lowpass'

    filter.frequency.value = data.filterFreq

    var distortion = ac.createWaveShaper()
    distortion.curve = makeDistortionCurve(data.distortion)

    player.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(distortion)
    distortion.connect(ac.destination);

    var instrument = new Instrument(player, data);
    instruments.push(instrument)
  });

  return instruments;
}