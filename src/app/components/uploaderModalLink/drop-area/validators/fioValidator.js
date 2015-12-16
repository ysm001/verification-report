import { SecondLevelLogValidator } from './secondLevelLogValidator.js';

export class FioValidator extends SecondLevelLogValidator {
  constructor() {
    super();

    this.rootKey = 'fio';
    this.directoryPostFix = 'K';
  }
}
