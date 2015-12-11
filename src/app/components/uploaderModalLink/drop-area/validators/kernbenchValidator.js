import { SecondLevelLogValidator } from './secondLevelLogValidator.js';

export class KernbenchValidator extends SecondLevelLogValidator {
  constructor() {
    super();

    this.rootKey = 'kernbench';
    this.directoryPostFix = 'CPU';
  }
}
