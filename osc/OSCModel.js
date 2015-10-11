// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

OSCModel.prototype.keysTranslation = null;
OSCModel.prototype.drumsTranslation = null;

function OSCModel (scales)
{
    if (scales == null)
        return;
    
    Model.call (this, 70,      // The MIDI CC at which the user parameters start
                      scales,  // The scales object
                      8,       // The number of track to monitor (per track bank)
                      8,       // The number of scenes to monitor (per scene bank)
                      8,       // The number of sends to monitor
                      6,       // The number of filters columns in the browser to monitor
                      16,      // The number of entries in one filter column to monitor
                      16,      // The number of search results in the browser to monitor
                      false,   // Don't navigate groups, all tracks are flat
                      8,       // The number of parameter of a device to monitor
                      8,       // The number of devices to monitor
                      8,       // The number of device layers to monitor
                      16);     // The number of drum pad layers to monitor

    this.pressedKeys = initArray (0, 128);
    
    var tb = this.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        for (var i = 0; i < 128; i++)
        {
            if (this.keysTranslation[i] == note)
                this.pressedKeys[i] = pressed ? velocity : 0;
        }
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
OSCModel.prototype = new Model ();

OSCModel.prototype.updateNoteMapping = function ()
{
    this.drumsTranslation = this.scales.getDrumMatrix ();
    this.keysTranslation = this.scales.getNoteMatrix (); 
};

OSCModel.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};
