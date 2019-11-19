var fs = require('fs');
const { StringStream } = require("scramjet");

let lines_count = 0;
const transformToMLSSA = function(line) {
		lines_count++;
		if(lines_count > 600)
			process.exit();
		console.log({line},{lines_count});
}

const runStream = async function() {

	let readStream = fs.createReadStream('./DataFiles/Online_Speaker_Data/ND25FA-4@0.frd')
	try {
	     readStream.pipe(new StringStream('utf-8'))
	     .split('\r\n')                                          // split every line
	     .map(async (line) => line+="1")    // update the lines
	     .join('\r\n')                                           // join again
	     .pipe(fs.createWriteStream('./ConvertedFiles/myfile.txt'));
	 } catch(err) {
	 	console.log({err});
	 }
	
}

runStream();