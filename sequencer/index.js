var createInstruments = require('./makeInstruments');
function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}
var shuffle = require('shuffle-array')
var bpms = shuffle([140, 110, 97, 83, 73, 127])
var speaks = ['eye got three things to tell you', 'one', 'two', 'three', 'task complete']
var steps = shuffle([12, 9, 16, 16, 8, 12])
var inter
var makeDistortionCurve = require('make-distortion-curve')
var Recorder = require('recorderjs')

var Sequencer = function(data){
  var msg = new SpeechSynthesisUtterance(speaks.shift());
  msg.rate = 0.75//s
  msg.volume = 1
  msg.pitch = 0.5
  // that.stop(that.ac.currentTime)

  window.speechSynthesis.speak(msg);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  this.direction = Math.random() < 0.5 ? -1.0 : 1.0
  this.divis = 1
  this.op = 'div'
  this.ac = new AudioContext();
  this.bpm = data.bpm;
  this.interval = null;
  this.section = data.section || "intro"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]
  this.position = 0;
  this.steps = data.steps;
  this.vol = this.ac.createGain()
  this.globalMod = 1
  this.vol.gain.setValueAtTime(0, this.ac.currentTime)
  this.recorder = new Recorder(this.vol, {workerPath: '../node_modules/recorderjs/recorderWorker.js'})
  this.recorder.record()
  this.vol.gain.setValueAtTime(0.75, this.ac.currentTime + 3)
  this.vol.connect(this.ac.destination)
  this.instruments = createInstruments(this.ac, data.instruments, this.vol);
};



Sequencer.prototype.fuxWithFx = function () {
  this.instruments.forEach(function (inst) {
    if (inst.name == 'kick') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 500) + 500)
      inst.filt.type = Math.random() < 0.5 ? 'lowpass' : 'highpass'
      inst.filt.frequency.value = (Math.random() * 1000) + 250
    } else if (inst.name == 'snare') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 750) + 250)
      inst.filt.type = Math.random() < 0.5 ? 'bandpass' : 'highpass'
      inst.filt.frequency.value = (Math.random() * 1000) + 500
    } else if (inst.name == 'pew') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 500) + 500)
      inst.filt.type = Math.random() < 0.5 ? 'peaking' : 'allpass'
      inst.filt.frequency.value = (Math.random() * 10000) + 750
    } else if (inst.type == 'guitar') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 750) + 250)
      inst.filt.type = Math.random() < 0.5 ? 'lowshelf' : 'highshelf'
      inst.filt.frequency.value = (Math.random() * 15000) + 1000
      if (Math.random() < 0.5) inst.shifts = inst.shifts.reverse()
      if (Math.random() < 0.19) inst.shifts = shuffle(inst.shifts)
    } else if (inst.name.match('hat')) {
      inst.dist.curve = makeDistortionCurve((Math.random() * 750) + 250)
      inst.filt.type = Math.random() < 0.5 ? 'lowpass' : 'highpass'
      inst.filt.frequency.value = (Math.random() * 10000) + 500
    } else if (inst.type == 'wub') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 500) + 250)
      inst.filt.type = Math.random() < 0.5 ? 'lowpass' : 'highpass'
      inst.filt.frequency.value = (Math.random() * 35000) + 1000
      if (Math.random() < 0.5) inst.shifts = inst.shifts.reverse()
      if (Math.random() < 0.19) inst.shifts = shuffle(inst.shifts)
    } else if (inst.type == 'synth') {
      inst.dist.curve = makeDistortionCurve((Math.random() * 500) + 500)
      inst.filt.type = Math.random() < 0.5 ? 'lowpass' : 'allpass'
      inst.filt.frequency.value = (Math.random() * 12000) + 1500
      if (Math.random() < 0.5) inst.shifts = inst.shifts.reverse()
      if (Math.random() < 0.19) inst.shifts = shuffle(inst.shifts)
    }
  })
}

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  // this.recorder.record()
  inter = window.setInterval(function(){
    that.instruments.forEach(function(instrument){
      instrument.play(that.position, that.ac, that.section, tick,  that.direction, that.divis, that.op, that.globalMod);
    })
    that.position++;


    // if (that.position == ~~(that.steps / 2)){

    // }


    if(that.position >= that.steps) {

      // do this less often and only in modulo 2s,
      // let individual instruments update their next for that pattern

      that.position = 0;
      var old = that.section
      that.section = that.sections.shift()

      if (that.section == 'speak') {
        // console.log("PEAKING")
          var msg = new SpeechSynthesisUtterance(speaks.shift());
          // msg.rate = 0.75//s
          that.stop(that.ac.currentTime)

          window.speechSynthesis.speak(msg);
          window.setTimeout(function () {
            // CHANGE THE GLOBAL SETTING THINGS HERE!!!!



            that.direction = Math.random() < 0.5 ? -1.0 : 1.0
            if (Math.random() < 0.5) {
              that.divis *= (Math.random() < 0.3 ? (Math.random() > 0.3 ? 1.5 : 2) : 1)
              that.op = Math.random() < 0.5 ? 'multi' : 'div'
            }
            that.bpm = bpms.pop()
            that.steps = steps.pop()
            that.fuxWithFx()

            that.globalMod = Math.random() < 0.3 ? 1 : 2
            // FUX WITH THE MODS SOMEHOW?



            // console.log("that.globalMod, that.steps, that.bpm, that.divis, that.op, that.direction", that.globalMod, that.steps, that.bpm, that.divis, that.op, that.direction)





            that.section = that.sections.shift()
            that.run()
          }, 1750) // text to speech seems to take "however dang long it pleases" to load...so
        // text to speech something...

      } else if(!that.section) {

        that.stop(that.ac.currentTime)
        that.recorder.stop()
        that.recorder.exportWAV(function (b) {
          console.log("GOT A WAV")
          that.recorder.forceDownload(b)
        })
        // alert("U REACHED THE ENDING YO!")
        // that.instruments.forEach(function(i){
          // if(i.type !== 'drum') {
          //   i.player.frequency.value = 500
          //   i.player.stop(that.ac.currentTime)
          // }
        // })

        // throw "up"
      } else {
        // if (that.section !== old) console.log('ADVANCING', that.section)
        that.instruments.forEach(function(instrument){
          instrument.next(that.section);
        });
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(inter);
};

module.exports = Sequencer;