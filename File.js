const path = require('path');

module.exports = class File{
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