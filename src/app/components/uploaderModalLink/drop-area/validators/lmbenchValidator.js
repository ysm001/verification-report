import { SecondLevelLogValidator } from './secondLevelLogValidator.js';

export class LmbenchValidator extends SecondLevelLogValidator {
  constructor() {
    super();

    this.rootKey = 'lmbench';
  }

  validateCompareTargetDirStructure(oldDir, newDir) {
    const oldDirFiles = this.filterFile(oldDir.children);
    const newDirFiles = this.filterFile(newDir.children);

    this.existsKey(oldDirFiles, 'summary.txt', oldDir.name);
    this.existsKey(newDirFiles, 'summary.txt', newDir.name);
  }
}
