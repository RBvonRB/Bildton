var capture;
var mode = 1;
var webcam = false;
var startVid = 'wolken';
var videos = [
    'webcam',
    'autos',
    'autos2',
    'baustelle',
    'blaetter',
    'fahne',
    'fahrt1',
    'fahrt2',
    'gras',
    'hammer',
    'liege',
    'stadt',
    'sunset',
    'tauben',
    'voegel',
    'voegel2',
    'wasser',
    'wasser2',
    'wolken'
];

var w = 640;
var h = 360;
var fps = 30;
var mouseOnCanv = false;
var mouseOnTime = false;
var mouseOnLoop = false;
var szDot = 15;
var szDotBig = 30;
var scDot = 1.5;
var strokeW = 10;
var strokeWthin = 4;
var strokeUI = 2;
var dotC, dotC2, colW, colW2, colB, colB2, colMain;
var dropzone;
var thumbs = true;
var sourceW = 640;
var sourceH = 360;
var sc;
var minW = 640;
var wRatio = 1;
var showSource = true;
var showLayer = true;
var cell = 25;
var spd = 1;
var intro = true;
var introEl, uiEl, dropEl;
var thumbnails = [];
var mXin, mYin, mXout, mYout;
var modeMode = false;
var drawRect = false;


function windowResized() {
    if (windowWidth >= minW) {
        w = int(windowWidth * wRatio);
        h = int(w / 16 * 9);
        resizeCanvas(w, windowHeight);
        resizeUI(sc);
        resize1(sc);
        resize2(sc);
        resize3(sc);
        resize4(sc);
    }
}

function preload() {

    capture = createVideo(['../assets/videos/' + startVid + '.mp4'], vidLoad);
    capture.size(sourceW, sourceH);
    capture.speed(spd);
    capture.hide();

    preload1();

}

function setup() {
    cnv = createCanvas(w, windowHeight);
    cnv.mousePressed(cnvPressed);
    background(0);
    w = int(windowWidth * wRatio);
    h = int(w / 16 * 9);
    frameRate(fps);
    pixelDensity(1);
    sc = width / sourceW;

    introEl = document.getElementById("intro");
    uiEl = document.getElementById("UI");
    dropEl = document.getElementById("dropzone");


    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(videoDropped, unhighlight);


    setupOSCscript();

    setupUI();
    setup1();
    setup2();
    setup3();
    setup4();

    modeChange(1);
    windowResized();


    colorMode(HSB, 360, 100, 100, 100);
    dotC = color(157, 78, 100);
    colW = color(255);
    colW2 = color(220);
    colB = color(0);
    colB2 = color(50);
}

function draw() {


    if (intro || thumbs) {
        modeMode = false;
    }
    clear();
    sc = width / sourceW;
    mode1();
    mode2();
    mode3();
    mode4();
    if (modeMode) {
        if (mode == 1) {
            if (showSource)
                image(img1, 0, 0);
            if (showLayer)
                image(layer1, 0, 0);
        } else if (mode == 2) {
            if (showSource)
                image(img2, 0, 0);
            if (showLayer)
                image(layer2, 0, 0);
        } else if (mode == 3) {
            if (showSource)
                image(img3, 0, 0);
            if (showLayer)
                image(layer3, 0, 0);
        } else if (mode == 4) {
            if (showSource)
                image(img4, 0, 0);
            if (showLayer)
                image(layer4, 0, 0);
        }

        drawTime();
        image(rectLayer, 0, 0);



        if (capture.time() / capture.duration() > looperOut)
            capture.time(looperIn * capture.duration());
    }


    stroke(255);
    strokeWeight(1);
    textSize(20);
    fill(0);
    text(floor(nf(frameRate()), 2, 0) + " fps", 30, 30);
    text(frameCount, 30, 80);


}

function playEvent() {
    pause = !pause;
    if (!webcam) {
        if (pause) {
            capture.pause();
        } else {
            capture.loop();
        }
    }
}


function spdEvt(val) {
    spd = map(val, 0, 127, 0, 5);
    capture.speed(spd);
}



function sourceEvent(val) {
    showSource = val;
}

function layerEvent(val) {
    showLayer = val;
}

function thumbEvt(val) {
    thumbs = true;
    showThumbnail();

}


function modeChange(val) {

    mode = val;
    if (mode == 1) {
        ui1Show();
    } else {
        ui1Hide();
    }
    if (mode == 2) {
        ui2Show();
    } else {
        ui2Hide();
    }
    if (mode == 3) {
        ui3Show();
    } else {
        ui3Hide();
    }
    if (mode == 4) {
        ui4Show();
    } else {
        ui4Hide();
    }

}


function videoSelect(val) {

    capture.remove();

    if (val == 'webcam') {
        thumbnails[0].remove();
        stopLoad();
        webcam = true;
        let constraints = {
            video: {
                mandatory: {
                    minWidth: sourceW,
                    minHeight: sourceH
                },
                optional: [
                    { maxFrameRate: fps }
                ]
            },
            audio: false
        };
        capture = createCapture(constraints, function () {
            modeMode = true;
        });
        capture.hide();
    } else {
        webcam = false;
        let item = val;
        capture = createVideo(['../assets/videos/' + item + '.mp4'], vidLoad);
        capture.size(sourceW, sourceH);
        capture.speed(spd);
        capture.hide();
    }
    videoSelected();
}

function vidLoad() {
    stopLoad();
    capture.loop();
    capture.volume(0);
    capture.speed(spd);
    modeMode = true;
}

function highlight() {
    if (thumbs)
        dropEl.style.opacity = "0.7";
}

function unhighlight() {
    dropEl.style.opacity = "0";
}

function videoDropped(file) {
    capture.remove();
    webcam = false;
    capture = createVideo([file.data], vidLoad);
    capture.size(sourceW, sourceH);
    capture.hide();
    videoSelected();
}

function videoSelected() {
    thumbs = false;
    hideThumbnail();
    unhighlight();
    uiEl.style.display = "block";
}


function mousePressed() {

    if (mouseY >= (height - cell) && mouseY < height && mouseX > cell * 2 && mouseX < width) {
        mouseOnTime = true;
    }

    if (mouseY >= (height - cell * 2) && mouseY < height - cell && mouseX > cell * 2 && mouseX < width) {
        mouseOnLoop = true;
    }


    if (mouseOnLoop) {
        looperIn = constrain((mouseX - 2 * cell) / timeLayer.width, 0, 1);
    }

    if (mouseOnTime) {
        if (!webcam)
            capture.time(((mouseX - 2 * cell) / timeLayer.width) * capture.duration());
    }

    if (mouseOnCanv) {
        if (modeMode) {
            if (mode == 1) {
                sample1Pressed();
                if (!sample1isPressed) {
                    drawRect = true;
                    mXin = constrain(mouseX, 0, w);
                    mYin = constrain(mouseY, 0, h);
                }
            } else if (mode == 3) {
                sample3Pressed();
            }
        }
    }
}

function mouseReleased() {
    if (mouseOnLoop) {
        looperOut = constrain((mouseX - 2 * cell) / timeLayer.width, 0, 1);
    }


    if (looperOut < looperIn) {
        var looperInP = looperIn;
        looperIn = looperOut;
        looperOut = looperInP;
    }

    if (mode == 1) {
        sample1Released();
    } else if (mode == 3) {
        sample3Released();
    }

    if (mouseOnCanv && modeMode) {

        mXout = constrain(mouseX, 0, w);
        mYout = constrain(mouseY, 0, h);
        let dX = abs(mXin - mXout);
        let dY = abs(mYin - mYout);
        let thr = 5;
        if (dX < thr && dY < 5) {
            drawRect = false;
        }
        if (drawRect) {
            if (mode == 1) {
                for (let i = 0; i < samplesArr1.length; i++) {
                    samplesArr1[i].randomize(mXin, mYin, mXout, mYout);
                }
            }
            drawRect = false;
        }
        rectLayer.clear();


    }

    mouseOnCanv = false;
    mouseOnTime = false;
    mouseOnLoop = false;
}

function mouseDragged() {
    if (mouseOnLoop) {
        looperOut = constrain((mouseX - 2 * cell) / timeLayer.width, 0, 1);
    }
    if (!webcam && mouseOnTime) {
        capture.time(((mouseX - 2 * cell) / timeLayer.width) * capture.duration());
    }

    if (mouseOnCanv && modeMode && drawRect) {
        mXout = constrain(mouseX, 0, w);
        mYout = constrain(mouseY, 0, h);
        if (mode == 1) {
            mode1Drag();
        }
    }
}


function keyPressed() {
    if (key == ' ') {
        playEvent();
    }
}

function startEvt() {
    showThumbnail();
    Tone.start()
    Tone.Transport.start();
    // Tone.Master.mute = false;
    // volEvent(document.getElementById("vol").value);
    intro = false;
    introEl.style.display = "none";
}

function startLoad() {
    document.body.style.cursor = "progress";
}


function stopLoad() {
    document.body.style.cursor = "auto";
}

function cnvPressed() {
    mouseOnCanv = true;
}