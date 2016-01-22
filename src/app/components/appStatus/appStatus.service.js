export class AppStatusService {
  constructor() {
    'ngInject';

    this._isFullScreenMode = false;
    this._currentId = null;
    this._summaryUpdated = false;
    this._summaryIds = [];
    this._requiresFullRender = false;
  }

  get summaryIds() { return this._summaryIds; }
  set summaryIds(val) { this._summaryIds = val; }
  get summaryUpdated() { return this._summaryUpdated; }
  set summaryUpdated(val) { this._summaryUpdated = val; }
  get isFullScreenMode() { return this._isFullScreenMode; }
  set isFullScreenMode(val) { this._isFullScreenMode = val; }
  get currentId() { return this._currentId; }
  set currentId(val) { this._currentId = val; }
  get currentId() { return this._currentId; }
  set currentId(val) { this._currentId = val; }
  get requiresFullRender() { return this._requiresFullRender; }
  set requiresFullRender(val) { this._requiresFullRender = val; }
}
