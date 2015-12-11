export class ArchiveValidatorService {
  constructor($log ,$q, zip) {
    'ngInject';

    this.$q = $q;
    this.zip = zip;
  }

  validate(zipFile) {
    this.zip.extract(zipFile).then((file) => {
      console.log(file);
    });
  }
}
