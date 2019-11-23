# SigmaConverter
Convert Speaker Measurement Data to Sigma Studio MLSSA datafile

ExampleData directory contains:
* Original example file from Sigma Studio installation "/DataFiles/SigmaStudioMLSSA_ExampleFile.txt" (*.txt aka. "MLSSA")
* HBX (Hobby Box) Exported Data "/DataFiles/HBX_Export"
* CSV Data exportet from ARTA "/DataFiles/Arta_Export"
* Speaker Data files from online sound supplier "/DataFiles/Online_Speaker_Data"

Basic node.js app to convert different speaker measurements to the required format of Sigma Studio.
## Installation
### Ubuntu (uses apt-get to install node & npm)
- Open Project directory
cd /SigmaConverter
- Make installer executeable
sudo chmod +x INSTALL.sh
- run installer (install nodejs & npm, install node_modules required by package.json, npm link)
sudo ./INSTALL.sh


## Usage:
SigmaConverter /path/to/source.*
* can be of different formats as long as it has columns in order: frequency magnitude (degrees)
(optional)

The converted datafile will have the same name as source file with ".txt" file format equivalent to Sigma Studio MLSSA data. It will be stored in the "/converted_data" directory.

## How it works
readStream -> transformStream -> writeStream

@TODOs
* Outputfile name & dir arguments
* test with sigma
* make repo public