import { Validator } from './validator.js';

export class MetaJsonValidator extends Validator{
  validate(file) {
    const requiredKey = 'meta.json';
    const requiredKeys = ['old', 'new', 'jenkinsJobName', 'jenkinsBuildNumber', 'createdAt'];

    this.existsKey(file, requiredKey, 'zip file');

    const metaJson = angular.fromJson(file[requiredKey].asText());
    this.existsKeys(metaJson, requiredKeys, 'meta.json');

    return metaJson;
  }
}
