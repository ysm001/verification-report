import { SecondLevelLogValidator } from './secondLevelLogValidator.js';

export class NetperfValidator extends SecondLevelLogValidator {
  constructor() {
    super();

    this.rootKey = 'netperf';
    this.directoryPostFix = '';
    this.logFileExt = 'log';
  }

  validate(file, metaJson) {
    this.validateRootDirStructure(file, metaJson);
  }

  validateRootDirStructure(file, metaJson) {
    this.existsKey(file, this.rootKey, 'zip file');

    const root = file[this.rootKey].children;

    const directories = this.filterDirectory(root);
    Object.keys(directories).forEach((key) => {
      this.validateSubRootDirStructure(directories[key], metaJson);
    });
  }

  validateSubRootDirStructure(directory, metaJson) {
    const subRoot = directory.children;
    const requiredKeys = [metaJson.old, metaJson.new];
    this.existsKeys(subRoot, requiredKeys, `${this.rootKey}/`);

    this.validateCompareTargetDirStructure(subRoot[metaJson.old], subRoot[metaJson.new], metaJson);
  }

  validateCompareTargetDirStructure() {
    return;
  }
}
