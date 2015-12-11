export class ArchiveValidatorService {
  constructor($log ,$q) {
    'ngInject';

    this.$q = $q;
  }

  validate(zipFile) {
    this.extract(zipFile).then((file) => {
      console.log(file);
    });
  }

  extract(zipFile) {
    return this.extractAndParse(zipFile)
      .then(function (file) {
        return Promise.resolve(file);
      }, function(reason){
        return Promise.reject(reason.message);
      });
  }

  unzip (zipFile) {
    const dfd = this.$q.defer();
    const reader = new FileReader();
    
    reader.onerror = dfd.reject.bind(dfd);
    reader.onload = (e) => {
      if (!reader.result) dfd.reject(new Error("Unknown error"));
      
      const zip = new JSZip(reader.result);
      const zipObject = this.zipToObject(zip.files);

      return dfd.resolve(zipObject);
    };
    
    reader.readAsArrayBuffer(zipFile);
    
    return dfd.promise;
  }
  
  extractAndParse (zipFile) {
    return this.unzip(zipFile);
  }

  zipToObject(files) {
    let result = {};

    Object.keys(files).forEach((key) => {
      const file = files[key];
      const dirs = this.getDirectory(file.name).split("/").filter((e) => {return e != ""});
      const fileName = this.getFileName(file.name);
      const elem = this.dig(dirs, result);

      if (fileName != '' && !(fileName in elem)) {
        elem[fileName] = file.dir ? {} : file;
      }
    });

    return result;
  }

  dig(dirs, result) {
    if (dirs.length == 0) {
      return result;
    }

    const dir = dirs[0];
    if (result[dir] == null) {
      result[dir] = {};
    }

    return this.dig(dirs.slice(1, dirs.length), result[dir]);
  }

  getFileName(path) {
    return path.split('\\').pop().split('/').pop()
  }

  getDirectory(path) {
    let pathArr = path.split('\\').pop().split('/');
    pathArr.pop();
    return pathArr.join('/');
  }
}
