#!/usr/bin/env node
//run as node app by ./streamSolution.js

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { Transform } = require('stream');
const { StringStream } = require("scramjet");

const File = require("./File.js");

console.log("Running Sigma Converter");

//console.log("Commandline arguments:",process.argv[2],process.argv[3]);

const argv_source = process.argv[2];

if(typeof argv_source === "undefined") {
  console.log("Error: No output file specified.");
  console.log("Usage:\nSigmaConverter /path/to/sourcefile.frd [path/to/outputfile.txt]\n");
  process.exit();
}

let file_source = new File(argv_source);
const argv_dest = process.argv[3];
let file_dest;
//no commandline argument for output file specified
if(typeof argv_dest === "undefined") {
  // dest will be /path/to/sourcefile_MLSSA.txt
  file_dest = new File(argv_source);
  file_dest.setName(file_source.name+"_MLSSA");
  file_dest.setFormat("txt");
  console.log("Converted output file stored as:");
  console.log(file_dest.getFullPath());
} else { //commandline argument for output file is specified
  file_dest = new File(argv_dest);
  //always use txt format for Sigma!
  if(file_dest.format !== "txt") {
    file_dest.setFormat("txt");
    console.log("Converted file must have txt format, storing output file as:");
    console.log(file_dest.getFullPath());
  }
}

//init in/out streams
const readStream = fs.createReadStream(file_source.getFullPath())
const writeStream = fs.createWriteStream(file_dest.getFullPath())//asnyc !!!

//original Sigma Studio header
const ORIGINAL_HEADER = "\"Sensitivity Excess Phase - dB SPL/watt (8 ohms, @0.50 meters) (High)\"\r\n      \"Hz\"  \"Mag (dB)\"       \"deg\"\r\n"


class Row {
  //always needs frequency and magnitude, phase (deg) is optional
  constructor(frq, mag, deg) {
    const EMPTY_ELEMENT = "";
    const UNDEF = "undefined";
    const MAX_DECIMAL_DIGITS = 4;
    if(typeof frq === UNDEF || (typeof mag === UNDEF && typeof deg === UNDEF)) {
      console.log("Not enough parameter to init a new row!");
      return;
    }
    this.frq = Number(frq).toFixed(MAX_DECIMAL_DIGITS);
    this.mag = Number(mag || EMPTY_ELEMENT).toFixed(MAX_DECIMAL_DIGITS);
    this.deg = Number(deg || EMPTY_ELEMENT).toFixed(MAX_DECIMAL_DIGITS);
    //console.dir(this);
  }

  toString() {
    //@TODO test correct spacer, example file uses spacer dependant of count of digits
    const SPACER = ",   ";
    const END_OF_LINE = "\r\n";
    const str = "  "+this.frq+SPACER+this.mag+SPACER+this.deg+END_OF_LINE;
    //console.log({str});
    return str;
  }
}
//Header is defined by "words" | "WORDS" | special characters in this list:
const regex_unallowed = /[a-zA-Z]+|[$&?@'<>^*()%!]/g;
const isHeader = function(line) {
  if(line.match(regex_unallowed) !== null) {
    console.log("header line detected!")
    return true;
  }
  return false;
}

//find all numbers in string
const regex_numbers = /[+-]?\d+(\.\d+)?/g;
let // @TODO change these indexes by header of source file to always fit order!
  INDEX_FRQ_IN_ROW = 0,
  INDEX_MAG_IN_ROW = 1,
  INDEX_DEG_IN_ROW = 2;

let lines_count = 0;
//convert text line to Sigma MLSSA Textline when possible
const transformToMLSSA = function(line) {
		lines_count++;
		//console.log({line},{lines_count});
    if(isHeader(line)) {
      //line is header, skip it!
      return "";
    }
    const arr = line.match(regex_numbers);
    if(arr === null) {
      //no matching numbers found, skip it!
      return "";
    }
    //console.log({arr});
    const row = new Row(arr[INDEX_FRQ_IN_ROW],arr[INDEX_MAG_IN_ROW],arr[INDEX_DEG_IN_ROW]);
    //console.log({row});
		return row.toString();
}
//Transformation alg. für processing pipe
const map = (fn, options = {}) => new Transform({
  // By default we are in object mode but this can be overwritten by the user
  objectMode: true,
  ...options,
  
  transform(chunk, encoding, callback) {
    let res;
    try {
      res = fn(chunk);
    } catch(e) {
      return callback(e);
    }
    callback(null, res);
  }
})

console.log("Start converting");
console.log("...");
//When write stream is open, start parsing
writeStream.on('open', function(fd) {
  writeStream.write(ORIGINAL_HEADER); //first write header to dest
  readStream //then pipie parsed lines to dest
    .pipe(new StringStream('ascii'))
    .split('\r\n')
    .pipe(map(transformToMLSSA))
    //.split('\t')
    .pipe(writeStream);
});
//display when programm has finished
writeStream.on('finish', function() {
  console.log("Finished converting!")
})
