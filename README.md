# SigmaConverter
Convert Speaker Measurement Data to Sigma Studio MLSSA datafile

Basic node.js app to convert different speaker measurements to the required format of Sigma Studio.


## Examples and Testing:
ExampleData directory contains:
* Original example file from Sigma Studio installation "/DataFiles/SigmaStudioMLSSA_ExampleFile.txt" (*.txt aka. "MLSSA")
* HBX (Hobby Box) Exported Data "/DataFiles/HBX_Export"
* CSV Data exportet from ARTA "/DataFiles/Arta_Export"
* Speaker Data files from online sound supplier "/DataFiles/Online_Speaker_Data"


## Installation
### Ubuntu (uses apt-get to install node & npm)
- Open Project directory
- Make installer executeable
```Shell
cd /SigmaConverter
```
- Make installer executeable
```Shell
sudo chmod +x INSTALL.sh
```
- run installer as root to install nodejs & npm, node_modules required by package.json and run npm link for global usage
```Shell
sudo ./INSTALL.sh
```

## Usage:
```Shell
SigmaConverter /path/to/source.* [/path/to/outputfile.txt**]
```
\* can be of different formats as long as it has columns in order: frequency magnitude [degrees (optional)]

\*\* if not already set, converter will always use txt format for Sigma Studio compability

When no outputfile is specified (optional), converted datafile will have the same name as source file but ends with "_MLSSA" and has ".txt" format equivalent to Sigma Studio MLSSA data. It will be stored in the directory of the sourcefile.


## How it works
get and set source and output file paths and names
readStream -> transformStream -> writeStream

@TODOs
* automatically check source header for frq, mag, deg order
* check if file exists or can be created in File contructor