var fs = require('fs');
const { Transform } = require('stream');
const { StringStream } = require("scramjet");

let lines_count = 0;
const transformToMLSSA = function(line) {
		lines_count++;
		if(lines_count > 600)
			process.exit();
		console.log({line},{lines_count});
		return line+"abc"
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

fs.createReadStream('./DataFiles/Online_Speaker_Data/ND25FA-4@0.frd')
	.pipe(new StringStream('utf-8'))
	.split('\r\n')
	.pipe(map(transformToMLSSA))
	.split('\t')
	.pipe(map((element)=>{console.log({element})}))
