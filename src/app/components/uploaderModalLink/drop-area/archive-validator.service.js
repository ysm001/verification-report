import { MetaJsonValidator } from './validators/metajsonValidator.js';
import { FioValidator } from './validators/fioValidator.js';
import { KernbenchValidator } from './validators/kernbenchValidator.js';
import { LmbenchValidator } from './validators/lmbenchValidator.js';
import { NetperfValidator } from './validators/netperfValidator.js';

export class ArchiveValidatorService {
  constructor($rootScope, $log ,$q, zip) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$q = $q;
    this.zip = zip;
    this.metaJsonValidator = new MetaJsonValidator();
    this.fioValidator = new FioValidator();
    this.kernbenchValidator = new KernbenchValidator();
    this.lmbenchValidator = new LmbenchValidator();
    this.netperfValidator = new NetperfValidator();
  }

  validate(zipFile) {
    return this.zip.extract(zipFile).then((file) => {
      const metaJson = this.metaJsonValidator.validate(file);
      this.fioValidator.validate(file, metaJson);
      this.kernbenchValidator.validate(file, metaJson);
      this.lmbenchValidator.validate(file, metaJson);
      this.netperfValidator.validate(file, metaJson);

      return metaJson;
    });
  }

  onError(e) {
    console.log(e);
    this.$rootScope.$emit('onError', e);
  }
}
