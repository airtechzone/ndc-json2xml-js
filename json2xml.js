#!/usr/bin/node

var fs = require('fs');

var json = {};
var xml = '';
var sequences = {};
var debug = false; // display debug messages for sequences

if (process.argv.length != 4) {
	printUsage();
	return -1;
}
var args = process.argv.slice(2);

// read sequences file
fs.readFile('./sequences/sequences-172.json', 'utf8', function (err, data) {
	if (err) {
		console.error('Error reading sequences.json\n' + err);
		return -1;
	}	else {
		sequences = JSON.parse(data);
	}
});

// read input (JSON file)
fs.readFile(args[0], 'utf8', function (err, data) {
	if (err) {
		console.error('Invalid input file');
		return -1;
	}
	try {
		json = JSON.parse(data);
	} catch (err) {
		console.error('Invalid JSON input\n' + err);
		return -1;
	}
	// only one key/value pair in element (root)
	key = Object.keys(json)[0];
	parse(json[key], key, '');
	fs.writeFile(args[1], xml, function(err) {
		if (err) {
			console.error('Error writing to output file\n' + err);
			return -1;
		}
	});
});


function parse(obj, key, xpath) {
	// loop over array values
	if (Array.isArray(obj)) {
		for (var el of obj) {
			sub_parse(key, el, xpath+key+'/');
		}
	} else {
		sub_parse(key, obj, xpath+key+'/');
	}
}


function sub_parse(key, el, xpath) {
	// opening el
	for (var i=0 ; i < (xpath.match(/\//g) || []).length -1 ; i++) {
		xml += '\t';
	}
	xml += '<' + key;
	// attributes
	if ('$' in el) {
		for (var attr in el.$) {
			xml += ' ' + attr + '="' + el.$[attr] + '"';
		}
	}
	xml += '>';
	// value
	if ('_' in el) {
		xml += el._
			.replace(/\\n/g, '\n')
			.replace(/\\t/g, '\t')
			.replace(/\\"/g, '"');
	}	else { // children
		xml += '\n';
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
				if (debug) console.log('Sequence incomplete for ' + xpath);
				keys = unorderedKeys; // keep all keys, still unordered
			}
		}
		catch (err) { // no sequence for xpath
			if (debug) console.log('No sequence found for ' + xpath);
			keys = unorderedKeys;
		}
		// KEYS SORTED
		for (var k of keys) {
			// do not process attributes and value
			if (k != '$' && k != '_') {
				parse(el[k], k, xpath);
			}
		}
		for (var i=0 ; i < (xpath.match(/\//g) || []).length -1 ; i++) {
			xml += '\t';
		}
	}
	// closing element
	xml += '</' + key + '>\n';
}


function printUsage() {
		console.log('Usage: node json2xml.js inputFile.json outputFile.xml');
}
