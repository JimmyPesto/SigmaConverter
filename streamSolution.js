var fs = require('fs');
const { Transform } = require('stream');
const { StringStream } = require("scramjet");

class Row {
  //always needs frequency and magnitude, phase (deg) is optional
  
  constructor(frq, mag, deg) {
    const EMPTY_ELEMENT = "";
    const UNDEF = "undefined";
    if(typeof frq === UNDEF || (typeof mag === UNDEF && typeof deg === UNDEF)) {
      console.log("Not enough parameter to init a new row!");
      return;
    }
    console.log("creating row!");
    this.frq = frq;
    this.mag = mag || EMPTY_ELEMENT;
    this.deg = deg || EMPTY_ELEMENT;
  }

  toString() {
    //@TODO test correct spacer, example file uses spacer dependant of count of digits
    const SPACER = ",   ";
    const END_OF_LINE = "\r\n";
    return "  "+this.frq+SPACER+this.mag+SPACER+this.deg+END_OF_LINE;
  }
}

//find all numbers in string
const regex = /[+-]?\d+(\.\d+)?/g;
let // @TODO change these indexes by header of source file to always fit order!
  INDEX_FRQ_IN_ROW = 1,
  INDEX_MAG_IN_ROW = 2,
  INDEX_DEG_IN_ROW = 3;

let lines_count = 0;
const transformToMLSSA = function(line) {
		lines_count++;
		console.log({line},{lines_count});
    const arr = line.match(regex);
    if(arr === null) {
      //no matching numbers found
      return "";
    }
    console.log({arr});
    const row = new Row(arr[INDEX_FRQ_IN_ROW],arr[INDEX_MAG_IN_ROW],arr[INDEX_DEG_IN_ROW]);
		return row.toString();
}

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

readStream = fs.createReadStream('./DataFiles/Online_Speaker_Data/ND25FA-4@0.frd')
//@TODO append to file that exists!
writeStream = fs.createWriteStream('./ConvertedFiles/test.txt')//asnyc !!!

writeStream.on('open', function(fd) {
  readStream
    .pipe(new StringStream('utf-8'))
    .split('\r\n')
    .pipe(map(transformToMLSSA))
    //.split('\t')
    .pipe(writeStream);
});
