let ind3;
var notes3 = 4;
var poster = 16;
var samples3 = [];

var img3, layer3;

var ui3v, ui3a;

function setup3() {
    img3 = createGraphics(sourceW, sourceH);
    img3.width = w;
    img3.height = h;
    layer3 = createGraphics(w, h);
    capture.loadPixels();
    img3.image(capture, 0, 0);
    img3.filter(POSTERIZE, poster);
    img3.loadPixels();

    for (let i = 0; i < notes3; i++) {
        samples3[i] = new Sample3(random(w), random(h), i);
        samples3[i].getHue();
    }

    ui3v = document.getElementById("ui3v");
    ui3a = document.getElementById("ui3a");
}

function ui3Show() {
    ui3v.style.display = "block";
    ui3a.style.display = "block";
}

function ui3Hide() {
    ui3v.style.display = "none";
    ui3a.style.display = "none";
}

function mode3() {
    layer3.clear();
    capture.loadPixels();
    img3.image(capture, 0, 0);
    img3.filter(POSTERIZE, poster);


    for (let i = 0; i < samples3.length; i++) {
        samples3[i].getHue();
        samples3[i].show(mouseX, mouseY);
        samples3[i].play();
    }

}

class Sample3 {
    constructor(posX, posY, ind) {
        this.posX = constrain(posX, 0, w);
        this.posY = constrain(posY, 0, h);
        this.sz = szDotBig;
        this.dragging = false;
        this.rollover = false;
        this.clr;
        this.index = ind;
        this.note;
    }

    getHue() {
        this.clr = img3.get(this.posX / sc, this.posY / sc);
        this.hue = hue(this.clr);
        layer3.fill(this.clr);
        return this.hue;
    }

    show(tx, ty) {
        if (this.dragging) {
            this.posX = constrain(tx, 0, w);
            this.posY = constrain(ty, 0, h);
        }
        layer3.fill(this.clr);
        layer3.stroke(dotC);
        layer3.strokeWeight(strokeWthin);
        layer3.ellipse(this.posX, this.posY, this.sz);


        layer3.fill(255);
        layer3.textSize(24);
        layer3.noStroke();
        // layer3.text(this.note, this.posX + 5, this.posY);
    }

    play() {
        this.note = int(map(this.hue, 0, 360, 0, 127));
        if (midiOutput) {
            if (midiOutput.name != "USB MIDI Interface ") {
                midiOutput.sendControlChange(this.index, this.note, 3);
            }
        }

    }

    randomize(x, y) {
        this.posX = x;
        this.posY = y
    }


    pressed(tx, ty) {
        let d3 = dist(tx, ty, this.posX, this.posY);
        if (d3 < this.sz / 2) {
            this.dragging = true;
        }
    }

    released() {
        this.dragging = false;
    }

}

function sample3Pressed() {
    for (let i = 0; i < samples3.length; i++) {
        samples3[i].pressed(mouseX, mouseY);
    }
}

function sample3Released() {
    for (let i = 0; i < samples3.length; i++) {
        samples3[i].released();
    }
}

function resize3(sc) {
    img3.width = w;
    img3.height = h;
    layer3 = createGraphics(w, h);
}


function sl3_1Evt(val) {
    poster = map(val, 0, 127, 3, 16);
}

function but3_1Evt(val) {
    for (let i = 0; i < notes3; i++) {
        samples3[i].randomize(random(w), random(h));
    }
}