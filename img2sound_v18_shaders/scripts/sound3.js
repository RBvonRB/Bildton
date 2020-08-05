var pitch3;;
var midiNote3;

var vol3tone = new Tone.Volume(volMin);
vol3tone.mute = true;
synth3 = new Tone.MonoSynth({
  oscillator: {
    type: 'sine'
  }, envelope: {
    attack: 0.04,
    decay: 0.1,
    sustain: 0.4,
    release: 0.4
  }
}).chain(vol3tone, Tone.Master);


var loop3 = new Tone.Sequence(function (time) {
  samples3.forEach((element, index) => {
    let t = time + Tone.Time("16n") * index;
    midiNote3 = element.note;
    synth3.triggerAttackRelease(Tone.Frequency.mtof(midiNote3), "16n", t);
  })
}, "4n").start(0);





function asel3_1Evt(val) {
  synth3.set({ oscillator: { type: val } });
}


function vol3Evt(val) {
  vol3 = map(val, 0, 127, volMin, 0);
  vol3tone.set("volume", vol3);
  if (vol3 <= volMin) {
    vol3tone.mute = true;
  } else {
    vol3tone.mute = false;
  }
}