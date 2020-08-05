var vol1 = 0;
var velo1 = 1;
var pitch1 = 60;
var interval1 = 5;
var reverb1 = new Tone.Reverb({
    decay: 2,
    preDelay: 0.1
});
var vol1tone = new Tone.Volume(0);
vol1tone.mute = false;
var delay1 = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.5
});

reverb1.generate();

var synth1 = new Tone.PolySynth(samples1, Tone.Synth, {
    oscillator: {
        type: "sine",
        volume: 0
    },
    envelope: {
        attack: .1,
        decay: 0.25,
        sustain: 0.4,
        release: .1
    }
}).chain(vol1tone, delay1, reverb1, Tone.Master);



function vol1Evt(val) {
    vol1 = map(val, 0, 127, volMin, 0);
    velo1 = map(val, 0, 127, 0, 1);
    vol1tone.set("volume", vol1);
    if (vol1 <= volMin) {
        vol1tone.mute = true;
    } else {
        vol1tone.mute = false;
    }
}

function asel1_1Evt(val) {
    synth1.set({ oscillator: { type: val } });
}

function asl1_1Evt(val) {
    if (midiOutput) {
        for (let i = 0; i < 127; i++) {
            midiOutput.stopNote(i, 1);
        }
    }
    pitch1 = int(map(val, 0, 127, 30, 60));
    synth1.releaseAll();
    for (let i = 0; i < samplesArr1.length; i++) {
        samplesArr1[i].isPlaying = false;
        samplesArr1[i].play();
    }
}


function asl1_2Evt(val) {
    if (midiOutput) {
        for (let i = 0; i < 127; i++) {
            midiOutput.stopNote(i, 1);
        }
    }
    interval1 = int(map(val, 0, 127, 1, 8));
    synth1.releaseAll();
    for (let i = 0; i < samplesArr1.length; i++) {
        samplesArr1[i].isPlaying = false;
        samplesArr1[i].play();
    }
}

function asl1_3Evt(val) {
    reverb1.set("wet", map(val, 0, 127, 0, 1));
}


function asl1_4Evt(val) {
    delay1.set("wet", map(val, 0, 127, 0, 1));
}
