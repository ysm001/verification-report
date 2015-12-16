export class UploaderController {
  constructor ($scope, $log, close, uploader, verification) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.modalClose = close;
    this.hidden = true;
    this.uploader = uploader;
    this.verification = verification;
    this.status = 'idle';
  }

  show() {
    this.uploader.init();
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }

  visible() {
    return !this.hidden;
  }

  close(result) {
    this.modalClose(result, 500);
    this.hide();
  }

  onUploadButtonClicked() {
    this.setStatus('uploading');

    console.log(`upload: ${this.uploader.archive.fileName}`);
    this.verification.upload(this.uploader.archive).success((data, status, headers, config) => {;
      this.setStatus('idle');
      console.log(data);
    }).error((data, status, headers, config) => {
      console.log(data);
    });
  }

  setStatus(status) {
    this.status = status;
    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
      this.$scope.$apply();
    }
  }

  isUploading() {
    return this.status == 'uploading';
  }
}
