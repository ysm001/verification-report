export class AppStatusService {
  constructor() {
    'ngInject';

    this._isFullScreenMode = false;
  }

  get isFullScreenMode() { return this._isFullScreenMode; }
  set isFullScreenMode(mode) { this._isFullScreenMode = mode; }
}
