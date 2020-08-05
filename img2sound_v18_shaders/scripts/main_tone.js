
var waveshapes = ['sine', 'square', 'sawtooth', 'triangle'];
Tone.Master.mute = true;

Tone.Transport.bpm.value = 90;

var volMin = -30;

function muteEvent(val) {
  vol = map(document.getElementById("vol").value, 0, 100, volMin, 0);
  if (!val) {
    Tone.Master.mute = true;
  } else {
    Tone.Master.mute = false;
    Tone.Master.set("volume", vol);
  }
}

function volEvent(val) {
  let vol = map(val, 0, 127, volMin, 0);
  if (document.getElementById("muteCheck").checked) {
    Tone.Master.set("volume", vol);
  }

  if (vol <= volMin) {
    Tone.Master.mute = true;
  } else {
    if (document.getElementById("muteCheck").checked)
      Tone.Master.mute = false;
  }
}
