export class ZipService {
  constructor($log ,$q, $window) {
    'ngInject';

    this.$q = $q;
    this.$window = $window;
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
    reader.onload = () => {
      if (!reader.result) dfd.reject(new Error("Unknown error"));
      
      const zip = new this.$window.JSZip(reader.result);
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
    files['/'] = { name: '/', dir: true, root: true };
    Object.keys(files).forEach((key) => {
      const file = files[key];
      if (file.root) return;

      this.appendFileObject(files, file);
    });

    return files['/'].children;
  }

  appendFileObject(files, file) {
    const directory = `${this.getDirectory(file)}/`;

    if (files[directory].children == null) {
      files[directory].children = {};
    }

    files[directory].children[this.getFileName(file)] = file;
  }

  getFileName(file) {
    const pathArr = file.name.split('\\').pop().split('/');

    return file.dir ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
  }

  getDirectory(file) {
    let pathArr = file.name.split('\\').pop().split('/');

    pathArr.pop();
    if (file.dir) pathArr.pop();

    return pathArr.join('/');
  }
}
