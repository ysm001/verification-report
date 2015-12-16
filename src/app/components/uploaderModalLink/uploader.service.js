export class UploaderService {
  constructor ($log) {
    'ngInject';

    this.$log = $log;

    this.init();
  }

  init() {
    this._oldVersion = '';
    this._newVersion = '';
    this._archive = null;
  }

  get oldVersion() { return this._oldVersion; }
  set oldVersion(val) { return this._oldVersion = val; }

  get newVersion() { return this._newVersion; }
  set newVersion(val) { return this._newVersion = val; }

  get archive() { return this._archive; }
  set archive(val) { return this._archive = val; }
}
