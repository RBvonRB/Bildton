var previousPixels;
var flow;
var thresh2 = 5;
var step = 5;
var sum2 = 0;
var flowLength;

var img2, layer2;

var uMotionGraph, vMotionGraph;
var ui2v, ui2a;


function setup2() {
  // capture.elt.setAttribute('playsinline', '');
  // capture.hide();
  flow = new FlowCalculator(step);
  uMotionGraph = new Graph(100, -step / 2, +step / 2);
  vMotionGraph = new Graph(100, -step / 2, +step / 2);
  img2 = createGraphics(sourceW, sourceH);
  img2.width = w;
  img2.height = h;
  layer2 = createGraphics(w, h);
  noise2.mute = true;
  ui2v = document.getElementById("ui2v");
  ui2a = document.getElementById("ui2a");
}

function ui2Show() {
  ui2v.style.display = "block";
  ui2a.style.display = "block";
}

function ui2Hide() {
  ui2v.style.display = "none";
  ui2a.style.display = "none";
}

function copyImage(src, dst) {
  var n = src.length;
  if (!dst || dst.length != n) dst = new src.constructor(n);
  while (n--) dst[n] = src[n];
  return dst;
}

function same(a1, a2, stride, n) {
  for (var i = 0; i < n; i += stride) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

function mode2() {

  sum2 = 0;

  capture.loadPixels();
  img2.image(capture, 0, 0);


  if (capture.pixels.length > 0) {
    if (previousPixels) {

      // cheap way to ignore duplicate frames
      // if (same(previousPixels, capture.pixels, 4, width)) {
      //   return;
      // }

      flow.calculate(previousPixels, capture.pixels, capture.width, capture.height);
    }
    previousPixels = copyImage(capture.pixels, previousPixels);

    if (flow.flow && flow.flow.u != 0 && flow.flow.v != 0) {
      layer2.clear();

      uMotionGraph.addSample(flow.flow.u);
      vMotionGraph.addSample(flow.flow.v);


      flow.flow.zones.forEach(function (zone) {
        zone.x *= sc;
        zone.y *= sc;
        if (abs(zone.uv) > thresh2) {
          layer2.strokeWeight(3);
          layer2.stroke(dotC);
          layer2.fill(dotC);
          sum2++;
        } else {
          layer2.stroke(colB);
          layer2.strokeWeight(3);
          layer2.fill(colB);
        }
        layer2.noStroke();
        layer2.ellipse(zone.x, zone.y, 5 + abs((zone.u + zone.v) * 1.2));
        // layer2.line(zone.x, zone.y, zone.x + zone.u, zone.y + zone.v);
      })
      flowLength = flow.flow.zones.length;
    }
  }


  setFilter2();
  if (midiOutput) {
    if (midiOutput.name != "USB MIDI Interface ") {
      midiOutput.sendControlChange('effectcontrol1coarse', constrain(sum2, 0, 127), 2);
    }
  }
}


function resize2(sc) {
  img2.width = w;
  img2.height = h;
  layer2 = createGraphics(w, h);
}

function sl2_1Evt(val) {
  thresh2 = map(val, 0, 127, 0, 20);
}
