export class AppStatusService {
  constructor() {
    'ngInject';

    this._isFullScreenMode = false;
    this._currentId = null;
    this._summaryUpdated = false;
  }

  get summaryUpdated() { return this._summaryUpdated; }
  set summaryUpdated(val) { this._summaryUpdated = val; }
  get isFullScreenMode() { return this._isFullScreenMode; }
  set isFullScreenMode(val) { this._isFullScreenMode = val; }
  get currentId() { return this._currentId; }
  set currentId(val) { this._currentId = val; }
}
