
var decay4 = 0.2;
var revDecay4 = 2;
var preDel4 = 0.1;
var vol4;
var velo4 = 0;
var pitch4 = 50;
var interval4 = 4;
var reverb4 = new Tone.Reverb({
    decay: revDecay4,
    preDelay: preDel4
});

var delay4 = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.5
});
var vol4tone = new Tone.Volume(volMin);
vol4tone.mute = true;

reverb4.generate();


var synth4 = new Tone.PolySynth(numSamples4, Tone.Synth, {
    oscillator: {
        type: "sine",
        volume: -12
    },
    envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.4,
        release: 0.4
    }
}).chain(vol4tone, delay4, reverb4, Tone.Master);


function asel4_1Evt(val) {
    synth4.set({ oscillator: { type: val } });
}

function vol4Evt(val) {
    vol4 = map(val, 0, 127, volMin, 0);
    velo4 = map(val, 0, 127, 0, 1);
    vol4tone.set("volume", vol4);
    if (vol4 <= volMin) {
        vol4tone.mute = true;
    } else {
        vol4tone.mute = false;
    }
}


function asl4_1Evt(val) {
    if (midiOutput) {
        for (let i = 0; i < 127; i++) {
            midiOutput.stopNote(i, 1);
        }
    }
    pitch4 = int(map(val, 0, 127, 30, 70));
    synth4.releaseAll();
    for (let i = 0; i < sample4.length; i++) {
        sample4[i].isPlaying = false;
        sample4[i].play();
    }
}


function asl4_2Evt(val) {
    if (midiOutput) {
        for (let i = 0; i < 127; i++) {
            midiOutput.stopNote(i, 1);
        }
    }
    interval4 = int(map(val, 0, 127, 1, 12));
    synth4.releaseAll();
    for (let i = 0; i < sample4.length; i++) {
        sample4[i].isPlaying = false;
        sample4[i].play();
    }
}

function asl4_3Evt(val) {
    reverb4.set("wet", map(val, 0, 127, 0, 1));
}

function asl4_4Evt(val) {
    delay4.set("wet", map(val, 0, 127, 0, 1));
}
