const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { Transform } = require('stream');
const { StringStream } = require("scramjet");

const File = require("./File.js");

console.log("Running Sigma Converter");

const destDir = "./ConvertedFiles/";

const argv = process.argv[2];
console.log({argv});
if(typeof argv === "undefined") {
  console.log("Error: No output file specified.");
  console.log("Usage:\nnpm start /path/to/sourcefile.frd\n");
  process.exit();
}
let file = new File(argv);


//init in/out streams
const readStream = fs.createReadStream(file.getFullPath())
//update file to output dest
file.setPath("./ConvertedFiles/");
file.setFormat("txt");
const writeStream = fs.createWriteStream(file.getFullPath())//asnyc !!!
//original Sigma Studio header
const ORIGINAL_HEADER = "\"Sensitivity Excess Phase - dB SPL/watt (8 ohms, @0.50 meters) (High)\"\r\n\t\"Hz\"\t\"Mag (dB)\"\t\"deg\"\r\n"


class Row {
  //always needs frequency and magnitude, phase (deg) is optional
  
  constructor(frq, mag, deg) {
    const EMPTY_ELEMENT = "";
    const UNDEF = "undefined";
    if(typeof frq === UNDEF || (typeof mag === UNDEF && typeof deg === UNDEF)) {
      console.log("Not enough parameter to init a new row!");
      return;
    }
    this.frq = frq;
    this.mag = mag || EMPTY_ELEMENT;
    this.deg = deg || EMPTY_ELEMENT;
    //console.dir(this);
  }

  toString() {
    //@TODO test correct spacer, example file uses spacer dependant of count of digits
    const SPACER = ",   ";
    const END_OF_LINE = "\r\n";
    const str = "  "+this.frq+SPACER+this.mag+SPACER+this.deg+END_OF_LINE;
    console.log({str});
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
		console.log({line},{lines_count});
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

//When write stream is open, start parsing
writeStream.on('open', function(fd) {
  writeStream.write(ORIGINAL_HEADER); //first write header to dest
  readStream //then pipie parsed lines to dest
    .pipe(new StringStream('utf-8'))
    .split('\r\n')
    .pipe(map(transformToMLSSA))
    //.split('\t')
    .pipe(writeStream);
});
