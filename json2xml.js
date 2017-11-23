#!/usr/bin/node

var fs = require('fs');
var input = {};
var output = "";
var sequences = {};

fs.readFile("./sequences/sequences-162.json", "utf8", function (err, data) {
	if (err) {
		console.log("error reading sequences.json");
	}
	else {
		sequences = JSON.parse(data);
	}
});

fs.readFile('./input.json', 'utf8', function (err, data) {
	if (err) throw err;
	input = JSON.parse(data);
	// only one key/value pair in element (root)
	key = Object.keys(input)[0];
	parse(input[key], key);
	fs.writeFile("./output.xml", output, function(err) {
		if(err) {
			return console.log(err + "error writing to output file");
		}
	});
	// console.log("\n\n" + output);
});

function parse(obj, key) {
	var xpath;
	// loop over array values
	for (var el of obj) {
		// opening el
		output += "<" + key;
		// attributes
		if ("$" in el) {
			for (var attr in el.$) {
				output += " " + attr + "=\"" + el.$[attr] + "\"";
			}
		}
		output += ">";
		// value
		if ("_" in el) {
			output += el._;
		}
		else { // children
			var unorderedKeys = Object.keys(el);
			// SORTING KEYS
			var keys = [];
			var sequence = [];
			try {
				sequence = sequences[xpath];
				for (var e of sequence) {
					if (unorderedKeys.indexOf(e) > -1) {
						keys.push(e);
					}
				}
				if (unorderedKeys.length != keys.length) { // missing keys in sequence
					console.log("Sequence incomplete for " + xpath);
					keys = unorderedKeys; // keep all keys, still unordered
				}
			}
			catch (err) { // no sequence for xpath
				console.log("No sequence found for " + xpath);
				keys = unorderedKeys;
			}
			// KEYS SORTED
			for (var k of keys) {
				// do not process attributes and value
				if (k != "$" && k != "_") {
					parse(el[k], k, xpath+k+"/");
				}
			}
		}
		// closing element
		output += "</" + key + ">";
	}
}
