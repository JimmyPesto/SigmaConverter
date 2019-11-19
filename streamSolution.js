var fs = require('fs');

var rstream = fs.createReadStream('./DataFiles/Online_Speaker_Data/ND25FA-4@0.frd');
var wstream = fs.createWriteStream('./ConvertedFiles/myfile.txt');