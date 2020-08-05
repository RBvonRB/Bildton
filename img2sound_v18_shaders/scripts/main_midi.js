var midiInput, midiOutput;

function noteOn(note) {
    console.log("noteOn col: " + note.col + " row: " + note.row);
    // console.log(note);
}

function noteOff(note) {
    console.log("noteOff col: " + note.col + " row: " + note.row);
    // // console.log(note);

}


function controlChange(control) {
    console.log("cc no: " + control.controllerNumber + " channel: " + control.channel + " val: " + control.value);
    console.log(control);

}

function parseMidi(mm) {
    //print(mm);
    if (mm.note != undefined) {
        switch (mm.note.type) {
            case 'noteon':
                noteOn(mm.note);
                break;
            case 'noteoff':
                noteOff(mm.note);
                break;
        }
    } else if (mm.control != undefined) {
        controlChange(mm.control);
    }
}


WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }


    // populate midi list
    let midiInElt = document.getElementById('midiInList').options;
    WebMidi.inputs.forEach(option =>
        midiInElt.add(
            new Option(option.name)
        )
    );
    let midiOutElt = document.getElementById('midiOutList').options;
    WebMidi.outputs.forEach(option =>
        midiOutElt.add(
            new Option(option.name)
        )
    );




    if (midiInput) {
        midiInput.addListener('midimessage', 'all', function (e) {
            midiMsg = {};
            midiMsg.data = e.data;
            midiMsg.timestamp = e.timestamp;
            // parseMidi(midiMsg) // optionally send raw only
        });

        // noteOn
        midiInput.addListener('noteon', "all", function (e) {
            let note = {
                type: 'noteon'
            };
            note.col = e.channel;
            note.row = e.note.number;
            note.name = e.note.name;
            note.octave = e.note.octave;
            note.velocity = floor(127 * e.velocity);

            midiMsg.note = note;
            parseMidi(midiMsg);
        });

        //noteOff
        midiInput.addListener('noteoff', "all", function (e) {
            let note = {
                type: 'noteoff'
            };
            note.col = e.channel;
            note.row = e.note.number;
            note.name = e.note.name;
            note.octave = e.note.octave;
            note.velocity = 0;

            midiMsg.note = note;
            parseMidi(midiMsg);
        });

        // controlChange
        midiInput.addListener('controlchange', "all", function (e) {
            let control = {
                type: 'controlchange'
            };
            control.channel = e.channel;
            control.controllerNumber = e.controller.number;
            control.controllerName = e.controller.name;
            control.value = e.value
            // console.log(e.value);

            midiMsg.control = control;
            parseMidi(midiMsg);
        });
    }




});



function midiInEvt(val) {
    midiInput = WebMidi.getInputByName(val);
    console.log("MIDI In paired: " + midiInput.name);
}

function midiOutEvt(val) {
    if (midiOutput) {
        for (let i = 0; i < 127; i++) {
            midiOutput.stopNote(i);
        }
    }
    midiOutput = WebMidi.getOutputByName(val);
    console.log("MIDI Out paired: " + midiOutput.name);
}


function printMidiOut(signal, note, vel, chan) {
    console.log(signal, note, vel, chan);
}