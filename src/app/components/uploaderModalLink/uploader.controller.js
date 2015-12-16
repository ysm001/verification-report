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
    this.message = '';
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

  validate() {
    if (this.uploader.oldVersion == '' || this.uploader.newVersion == '') {
      return 'Version field is empty.'
    }

    if (this.uploader.archive == null) {
      return 'Log file is not selected.'
    }

    return this.uploader.archive.validate();
  }

  onUploadButtonClicked() {
    this.clearMessage();

    const error = this.validate();
    if (error) {
      this.setErrorMessage(error);
      return;
    }

    this.setStatus('uploading');

    this.verification.upload(this.uploader.archive).success((data, status, headers, config) => {;
      this.setStatus('idle');

      if (data.result) {
        this.setSuccessMessage('Successfully uploaded.');
      } else {
        this.setErrorMessage(data.error.message);
      }
    }).error((data, status, headers, config) => {
      this.setStatus('idle');

      this.setErrorMessage(`${status} Error: ${data}`);
    });
  }

  setStatus(status) {
    this.status = status;
    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
      this.$scope.$apply();
    }
  }

  setErrorMessage(message) {
    this.message = message;
    this.messageType = 'error';
    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
      this.$scope.$apply();
    }
  }

  setSuccessMessage(message) {
    this.message = message;
    this.messageType = 'success';
    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
      this.$scope.$apply();
    }
  }

  clearMessage() {
    this.message = '';
    this.messageType = '';
  }

  hasErrorMessage() {
    return this.messageType == 'error';
  }

  hasSuccessMessage() {
    return this.messageType == 'success';
  }

  isUploading() {
    return this.status == 'uploading';
  }
}
