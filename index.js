var fs = require('fs');
var path = require('path');

console.log("Running Sigma Converter");

const destDir = "./ConvertedFiles/";

const argv = process.argv[2];
console.log({argv});
if(typeof argv === "undefined") {
	console.log("Error: No output file specified.");
	console.log("Usage:\nnpm start /path/to/sourcefile.frd\n");
	process.exit();
}

class File{
	constructor(filePath) {
		if(typeof filePath === "string") {
			this.prefix= ((filePath.startsWith(".")) ? "./" : "");
			const nameFull = path.basename(filePath);
			this.path = path.dirname(filePath);
			let splitedFile = nameFull.split('.');
			this.format = splitedFile.pop();
			this.name = splitedFile.pop();
			console.dir(this);
		} else {
			throw new Error("No path to file specified!");
		}
	}

	setFormat(newFormat) {
		if(typeof newFormat === "string") {
			//remove leading "."
			if(newFormat.startsWith(".")) this.format = newFormat.substring(1);
			else this.format = newFormat;
		} else {
			throw new Error("No format specified!");
		}
	}

	setPath(newPath) {
		if(typeof newPath !== "undefined") {
			this.path = newPath;
		} else {
			throw new Error("No path specified!");
		}
	}

	getFullPath() {
		let fullPath = this.prefix + path.join(this.path,this.name+"."+this.format);
		console.log(fullPath);
		return fullPath;
	}
}

const file = new File(argv);

let contents;
try {
	contents = fs.readFileSync(file.getFullPath(), 'utf8');
} catch(err) {
	if (err.code === 'ENOENT') {
		console.log('File not found!');
		process.exit();
	} else {
		//some other error accured?!
		throw err;
	}
}
//console.log({contents});

const header = "\"Sensitivity Excess Phase - dB SPL/watt (8 ohms, @0.50 meters) (High)\"      \"Hz\"  \"Mag (dB)\"       \"deg\""

class Column {
	//always needs frequency and magnitude, phase (deg) is optional
	contructor(frq, mag, deg="") {
		this,frq = frq;
		this.mag = mag;
		this.deg = deg;
	}

	toString() {
		//@TODO test correct spacer, example file uses spacer dependant of count of digits
		const spacer = ",   ";
		return "	"+this.frq+spacer+this.mag+spacer+this.deg;
	}
}


file.setPath("./ConvertedFiles/");
file.setFormat("txt");
fs.writeFile(file.getFullPath(), header, (err) => {
    // In case of a error throw err.
    if (err) throw err
    else {
        console.log("File is written!");
    }
});
