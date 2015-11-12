var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');

var makeDistortionCurve = require('make-distortion-curve')

var make_drone = require('drone-e-o-synth')
var make_wobble = require('wobbler')
var make_tri = require('tri-tri')
var makeVox = require('./screamy')
var makeambpad = require('./ambpad')
var Tuna = require('tunajs')


module.exports = function createInstruments(ac, instrumentData){
  var instruments = [];
  var tuna = new Tuna(ac);
  instrumentData.forEach(function(data){
    var player;
    switch(data.type) {
        case 'drum':
          player = new Sampler(ac, 'samples/'+data.name+'.wav');
          break;
        case 'vox':
          player = makeVox(ac)
          break;
        case 'droney':
          player = make_drone(ac)
          break;
        case 'tritri':
          player = make_tri(ac)
          break;
        case 'ambpad':
          player = makeambpad(ac)
          break;
        case '':
          break;
        default:
          // player = Oscillator(ac);
          // player.type = data.type;
          // player.frequency.value = 440
          // player.connect(ac.destination)
          // player.start(ac.currentTime)
          player = make_drone(ac)
          // break;
    }

//     var gainNode = ac.createGain();

//     gainNode.gain.value = 0.2

//     var filter = ac.createBiquadFilter();
//     filter.type = 'lowpass';
//     filter.frequency.value = 800;

//     filter.frequency.value = data.filterFreq



//     var distortion = ac.createWaveShaper()
//     distortion.curve = makeDistortionCurve(data.distortion)

//     player.connect(gainNode);
//     gainNode.connect(filter);
//     filter.connect(distortion)
//     var wobble
//     if (data.name == 'bounce') {
//       // var overdrive = new tuna.Overdrive({
//       //   outputGain:  Math.random() < 0.5 ? 0.5 : 0.35,         //0 to 1+
//       //   drive:  Math.random() < 0.5 ? 0.7 : 0.5,              //0 to 1
//       //   curveAmount: Math.random(),          //0 to 1
//       //   algorithmIndex: ~~(Math.random() * 6),       //0 to 5, selects one of our drive algorithms
//       //   bypass: 0
//       // });
//       wobble = make_wobble(ac)
//       distortion.connect(wobble.input())
//       wobble.connect(ac.destination)
//       wobble.start()
//     } else if (data.name == 'solo') {

//       var wahwah = new tuna.WahWah({
//         automode: true,                //true/false
//         baseFrequency: 0.5,            //0 to 1
//         excursionOctaves: 2,           //1 to 6
//         sweep: 0.2,                    //0 to 1
//         resonance: 10,                 //1 to 100
//         sensitivity: 0.5,              //-1 to 1
//         bypass: 0
//       });
//       distortion.connect(wahwah)
//       wahwah.connect(ac.destination)

//     }  else {

//       distortion.connect(ac.destination);
//     }
// player.start()
    var instrument = new Instrument(player, data)//, wobble);
    instruments.push(instrument)
  });

  return instruments;
}