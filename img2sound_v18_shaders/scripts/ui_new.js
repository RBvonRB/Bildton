var timeIndS = 30;
var loopS = timeIndS;
var timeLayer;
var pause = false;
var looperIn, looperOut;


function setupUI() {
    timeLayer = createGraphics(width - cell * 2, cell * 2);
    rectLayer = createGraphics(w, h);
}

function drawTime() {
    timeLayer.fill(colW);
    timeLayer.strokeWeight(strokeUI);
    timeLayer.stroke(colB);
    timeLayer.rect(0, 0, timeLayer.width, cell);
    timeLayer.rect(0, cell, timeLayer.width, cell * 2);


    timeLayer.fill(colB);
    let videoTransport = capture.time() / capture.duration();
    timeLayer.rect(0, cell, videoTransport * timeLayer.width, cell * 2);

    timeLayer.fill(colB);
    timeLayer.rect(looperIn * timeLayer.width, 0, looperOut * timeLayer.width - (looperIn * timeLayer.width), cell);
    image(timeLayer, cell * 2, height - cell * 2);

}


function showThumbnail() {
    let grid = 5;
    let x, y;
    let w = width / grid;
    let h = w / 16 * 9;
    for (let i = 0; i < videos.length; i++) {
        x = (i % grid) * w;
        y = floor(i / grid) * h;
        if (i == 0) {
            let constraints = {
                video: {
                    mandatory: {
                        minWidth: w,
                        minHeight: h,
                        maxWidth: w,
                        maxHeight: h
                    },
                    optional: [{ maxFrameRate: 10 }]
                },
                audio: true
            };
            thumbnails[i] = createCapture(constraints);
            // thumbnails[i].pause();
            thumbnails[i].position(0, 0);
            thumbnails[i].volume(0);
        } else {
            thumbnails[i] = createVideo(['../assets/videos/' + videos[i] + '.mp4'], function () {
            });
            thumbnails[i].size(w, h);
            thumbnails[i].volume(0);
            thumbnails[i].position(x, y);

        }
        if (thumbnails[i]) {
            thumbnails[i].mouseOver(function () {
                thumbnails[i].loop();
                document.body.style.cursor = "pointer";
            })
            thumbnails[i].mouseOut(function () {
                thumbnails[i].pause();
                document.body.style.cursor = "auto";
            })

            thumbnails[i].mouseClicked(function () {
                videoSelect(videos[i])
            });
        }


    }
    // dropzone.style.display = "block";
    uiEl.style.display = "none";
}

function hideThumbnail() {
    for (let i = 0; i < thumbnails.length; i++) {
        thumbnails[i].hide();
    }
}



function resizeUI(sc) {
    timeLayer = createGraphics(width - cell * 2, cell * 2);
    rectLayer = createGraphics(w, h);
}



function sourceEvent(val) {
    showSource = val;
}

function layerEvent(val) {
    showLayer = val;
}


