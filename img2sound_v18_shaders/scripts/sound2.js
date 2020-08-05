var filterFreq2 = 0;
var filterMin2 = 200;
var delay2 = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: .3,
  wet: 0.5
});

var filter2 = new Tone.Filter({
  frequency: 300,
  type: "lowpass",
});

var hp2 = new Tone.Filter({
  frequency: 200,
  type: "highpass",
});

var noise2 = new Tone.Noise("pink").start();

noise2.mute = true;



//connect the noise
noise2.chain(hp2, filter2, delay2, Tone.Master)




function setFilter2() {
  if (flowLength > 0) {
    filterFreq2 = map(sum2, 0, flowLength, filterMin2, 22050);
  }
  filter2.set("frequency", filterFreq2);
}



function vol2Evt(val) {
  vol2 = map(val, 0, 127, volMin, 0);
  if (vol2 == volMin)
    noise2.mute = true;
  else {
    noise2.mute = false;
    noise2.volume.value = vol2;
  }
}



function asl2_1Evt(val) {
  delay2.set("wet", map(val, 0, 127, 0, 1));
}

function asl2_2Evt(val) {
  let hp2freq = map(val, 0, 127, 0, 500);
  hp2.set("frequency", hp2freq);
}

