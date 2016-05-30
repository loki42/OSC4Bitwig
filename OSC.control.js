// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt
// modified for The Music Room.

loadAPI (1);
load ("framework/helper/ClassLoader.js");
load ("framework/daw/ClassLoader.js");
load ("osc/ClassLoader.js");
load ("Config.js");

host.defineController ("Chroma Coda", "The Music Room", "1.0", "2ad1432f-ace2-443f-af64-304372c2e405", "Chroma Coda");
host.defineMidiPorts (1, 0);

var model = null;
var parser = null;
var writer = null;

String.prototype.getBytes = function () 
{
	var bytes = [];
	for (var i = 0; i < this.length; i++) 
		bytes.push (this.charCodeAt(i));
	return bytes;
};

function init ()
{
	println ("Starting Init.");
    Config.init ();

    var scales = new Scales (0, 128, 128, 1);
    scales.setChromatic (true);
	model = new OSCModel (scales);
	parser = new OSCParser (model, Config.receiveHost, Config.receivePort);
    writer = new OSCWriter (model);

    scheduleTask (function ()
    {
        writer.flush (true);
    }, null, 100);

	println ("Initialized.");
}

function exit ()
{
}

function flush ()
{
    writer.flush ();
}
