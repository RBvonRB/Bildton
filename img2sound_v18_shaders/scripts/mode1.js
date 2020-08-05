
var samples1 = 12;
let thresh1 = .5;
var timeInt1 = 10;
var invert1 = false;
var img1, layer1;
var samplesArr1 = [];
var sample1isPressed = false;
var ui1v, ui1a;
var shader1;

function preload1() {
  shader1 = loadShader('shaders/threshold/effect.vert', 'shaders/threshold/effect.frag', function () { console.log("shader loaded success") }, function () { console.log("shader loaded error") });
}

function setup1() {
  img1 = createGraphics(sourceW, sourceH, WEBGL);
  img1.width = w;
  img1.height = h;
  layer1 = createGraphics(w, h);
  layer1.colorMode(HSB, 360, 100, 100, 100);


  for (let i = 0; i < samples1; i++) {
    samplesArr1[i] = new Sample1(random(w), random(h), i);
  }

  ui1v = document.getElementById("ui1v");
  ui1a = document.getElementById("ui1a");
}

function ui1Show() {
  ui1v.style.display = "block";
  ui1a.style.display = "block";
}

function ui1Hide() {
  ui1v.style.display = "none";
  ui1a.style.display = "none";
}




function mode1() {

  layer1.clear();
  img1.shader(shader1);
  shader1.setUniform('tex0', capture);
  shader1.setUniform('thresh1', thresh1);
  shader1.setUniform('invert', invert1);
  img1.rect(0, 0, img1.width, img1.height);

  for (let i = 0; i < samplesArr1.length; i++) {
    samplesArr1[i].brght();
    samplesArr1[i].anim();
    samplesArr1[i].show(mouseX, mouseY);
    samplesArr1[i].wave();
    samplesArr1[i].play();
  }

}


class Sample1 {
  constructor(posX, posY, ind) {
    this.posX = posX;
    this.posY = posY;
    this.szSt = 30;
    this.sz = this.szSt;
    this.sz2 = this.sz;
    this.strk = 5;
    this.dragging = false;
    this.rollover = false;
    this.isPlaying = false;
    this.trig = false;
    this.opacity = 100;
    this.theta1 = 0;
    this.ani = 0;
    this.aniTr = false;
    this.ind = ind;

  }

  brght() {
    this.bright = brightness(img1.get(this.posX / sc, (img1.height - this.posY) / sc));
    if (this.bright > 0) {
      this.trig = true;
    } else {
      this.trig = false;
    }
  }

  anim() {
    this.aniSp = 0.35;
    if (this.trig) {
      if (this.ani < 1) {
        this.ani += this.aniSp;
      } else {
        this.ani = 1;
      }
    } else {
      if (this.ani > 0) {
        this.ani -= this.aniSp;
      } else {
        this.ani = 0;
      }
    }
  }


  show(tx, ty) {
    if (this.dragging) {
      this.posX = constrain(tx, 0, w);;
      this.posY = constrain(ty, 0, h);
    }

    layer1.colorMode(HSB, 360, 100, 100, 100);
    this.col = dotC;

    this.sz = (this.ani * this.szSt * 0.3) + this.szSt;

    layer1.stroke(hue(this.col), saturation(this.col) * this.ani, brightness(this.col));
    layer1.fill(0, 0, 100 * this.ani);
    layer1.strokeWeight(this.strk);
    layer1.ellipse(this.posX, this.posY, this.sz);

    this.sz2 = this.szSt + (this.ani * this.sz * 1.1);
    layer1.noFill();
    layer1.stroke(hue(this.col), saturation(this.col), brightness(this.col), this.ani * 100);
    // layer1.ellipse(this.posX, this.posY, this.sz2);

    layer1.fill(colW);
    layer1.textSize(24);
    layer1.noStroke();
    // layer1.text(this.ind, this.posX + 5, this.posY);

  }

  wave() {
    this.xspacing = 1; // Distance between each horizontal location
    this.w = this.sz * 0.9; // Width of entire wave
    this.amplitude = 0; // Height of wave
    this.period = this.sz / 2; // How many pixels before the wave repeats
    this.dx = (TWO_PI / this.period) * this.xspacing;; // Value for incrementing x
    this.yvalues = new Array(floor(this.w / this.xspacing));; // Using an array to store height values for the wave

    this.theta1 += 0.4;
    this.x = this.theta1;

    this.amplitude = 10 * this.ani;

    for (let i = 0; i < this.yvalues.length; i++) {
      this.yvalues[i] = sin(this.x) * this.amplitude;
      this.x += this.dx;
    }
    layer1.noStroke();
    layer1.fill(hue(this.col), saturation(this.col) * this.ani, brightness(this.col));
    for (let x = 0; x < this.yvalues.length; x++) {
      layer1.ellipse((this.posX - (this.w / 2)) + (x * this.xspacing), this.posY + this.yvalues[x], this.strk);
    }
  }


  randomize(randX1, randY1, randX2, randY2) {
    this.posX = random(randX1, randX2);
    this.posY = random(randY1, randY2);
  }

  pressed(tx, ty) {
    let d1 = dist(tx, ty, this.posX, this.posY);
    if (d1 < (this.sz / 2) + (this.strk / 2)) {
      this.opacity = 50;
      this.dragging = true;
      sample1isPressed = true;
    }
  }

  released() {
    this.dragging = false;
    sample1isPressed = false;
  }

  play() {
    this.note = constrain(pitch1 + (this.ind * interval1), 0, 127);
    this.volcaNote = constrain(this.ind, 0, 9);
    this.chan = 1;
    if (this.trig) {
      if (!this.isPlaying) {
        synth1.triggerAttack(Tone.Frequency.mtof(this.note));
        if (midiOutput) {
          if (midiOutput.name == "loopMIDI Port") {
            midiOutput.playNote(this.note, this.chan, { velocity: velo1 });
            printMidiOut("noteOn", this.note, velo1, this.chan);
          } else if (midiOutput.name == "USB MIDI Interface ") {
            if (mode == 1) {
              midiOutput.playNote(1, this.volcaNote)
              printMidiOut("noteOn", this.note, velo1, this.chan);
            }
          }
        }
        this.isPlaying = true;
      }
    } else {
      if (this.isPlaying) {
        synth1.triggerRelease(Tone.Frequency.mtof(this.note));
        if (midiOutput) {
          midiOutput.stopNote(this.note, this.chan);
        }
        this.isPlaying = false;
      }
    }
  }
}

function sample1Pressed() {
  for (let i = 0; i < samplesArr1.length; i++) {
    samplesArr1[i].pressed(mouseX, mouseY);
  }
}

function sample1Released() {
  for (let i = 0; i < samplesArr1.length; i++) {
    samplesArr1[i].released();
  }
}

function mode1Drag() {
  rectLayer.colorMode(HSB);
  rectLayer.clear();
  rectLayer.rectMode(CORNERS);
  rectLayer.noFill();
  rectLayer.stroke(dotC);
  rectLayer.strokeWeight(strokeW / 2);
  rectLayer.rect(mXin, mYin, mXout, mYout);
}

function resize1(sc) {
  img1.width = w;
  img1.height = h;
  layer1 = createGraphics(w, h);
}

function tgl1_1Evt(val) {
  invert1 = val;
}

function but1_1Evt() {
  for (let i = 0; i < samplesArr1.length; i++) {
    samplesArr1[i].randomize(0, 0, w, h);
  }
}

function sl1_1Evt(val) {
  thresh1 = map(val, 0, 127, 0, 1);
}
