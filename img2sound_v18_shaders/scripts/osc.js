function setupOSCscript() {
    if (typeof (io) !== 'undefined')
        setupOsc(12000, 3334);
}

function receiveOsc(address, value) {
    console.log("received OSC: " + address + ", " + value);


    let v = value * 127;

    if (address.includes('/p1/')) {
        if (address.includes('/multifader1/5')) {
            document.getElementById("vol1").value = v;
            vol1Evt(v);
        } else if (address.includes('/multifader1/4')) {
            document.getElementById("vol2").value = v;
            vol2Evt(v);
        } else if (address.includes('/multifader1/3')) {
            document.getElementById("vol3").value = v;
            vol3Evt(v);
        } else if (address.includes('/multifader1/2')) {
            document.getElementById("vol4").value = v;
            vol4Evt(v);
        } else if (address.includes('/multifader1/1')) {
            document.getElementById("vol5").value = v;
            vol5Evt(v);
        } else if (address.includes('multipush1')) {
            if (v > 0) {
                let p = 6 - address.slice(-3, -2);
                document.getElementById("modeRadio").mode.value = p;
                modeChange(p);
            }
        } else if (address.includes('/push1')) {
            if (v > 0) {
                document.getElementById("play").click();
            }
        } else if (address.includes('/toggle1')) {
            if (v > 0) {
                document.getElementById("muteCheck").checked = true;
                muteEvent(true);
            } else {
                document.getElementById("muteCheck").checked = false;
                muteEvent(false);
            }
        } else if (address.includes('/fader1')) {
            document.getElementById("vol").value = v;
            volEvent(v);
        }

        if (mode == 1) {
            if (address.includes('/toggle2')) {
                if (v > 0) {
                    document.getElementById("tgl1_1").checked = true;
                    tgl1_1Evt(true);
                } else {
                    document.getElementById("tgl1_1").checked = false;
                    tgl1_1Evt(false);
                }
            } else if (address.includes('/push2')) {
                if (v > 0) {
                    document.getElementById("but1_1").click();
                }
            } else if (address.includes('/multifader2/5')) {
                document.getElementById("sl1_1").value = v;
                sl1_1Evt(v);
            } else if (address.includes('/multifader3/5')) {
                document.getElementById("asl1_1").value = v;
                asl1_1Evt(v);
            } else if (address.includes('/multifader3/4')) {
                document.getElementById("asl1_2").value = v;
                asl1_2Evt(v);
            } else if (address.includes('/multifader3/3')) {
                document.getElementById("asl1_3").value = v;
                asl1_3Evt(v);
            }
        } else if (mode == 2) {
            if (address.includes('/multifader2/5')) {
                document.getElementById("sl2_1").value = v;
                sl2_1Evt(v);
            }
        } else if (mode == 3) {
            if (address.includes('/multifader2/5')) {
                document.getElementById("sl3_1").value = v;
                sl3_1Evt(v);
            }
        } else if (mode == 4) {
            if (address.includes('/multifader2/5')) {
                document.getElementById("sl4_1").value = v;
                sl4_1Evt(v);
            } else if (address.includes('/multifader2/4')) {
                document.getElementById("sl4_2").value = v;
                sl4_2Evt(v);
            } else if (address.includes('/multifader2/3')) {
                document.getElementById("sl4_3").value = v;
                sl4_3Evt(v);
            } else if (address.includes('/multifader2/2')) {
                document.getElementById("sl4_4").value = v;
                sl4_4Evt(v);
            } else if (address.includes('/multifader2/1')) {
                document.getElementById("sl4_5").value = v;
                sl4_5Evt(v);
            } else if (address.includes('/toggle2')) {
                if (v > 0) {
                    document.getElementById("tgl4_1").checked = true;
                    tgl4_1Evt(true);
                } else {
                    document.getElementById("tgl4_1").checked = false;
                    tgl4_1Evt(false);
                }
            }
        }
    }
}
function sendOsc(address, value) {
    socket.emit('message', [address].concat(value));
}

function setupOsc(oscPortIn, oscPortOut) {
    var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
    socket.on('connect', function () {
        socket.emit('config', {
            server: { port: oscPortIn, host: '127.0.0.1' },
            client: { port: oscPortOut, host: '127.0.0.1' }
        });
    });
    socket.on('message', function (msg) {
        if (msg[0] == '#bundle') {
            for (var i = 2; i < msg.length; i++) {
                receiveOsc(msg[i][0], msg[i].splice(1));
            }
        } else {
            receiveOsc(msg[0], msg.splice(1));
        }
    });
}
