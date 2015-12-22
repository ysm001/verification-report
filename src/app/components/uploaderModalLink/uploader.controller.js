export class UploaderController {
  constructor ($scope, $log, close, uploader, verification, appStatus) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.modalClose = close;
    this.hidden = true;
    this.uploader = uploader;
    this.verification = verification;
    this.status = 'idle';
    this.message = '';
    this.appStatus = appStatus;
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

    this.verification.upload(this.uploader.archive, this.uploader.oldVersion, this.uploader.newVersion).success((data, status, headers, config) => {;
      this.setStatus('idle');

      if (data.result) {
        this.setSuccessMessage('Successfully uploaded.');
        this.appStatus.summaryUpdated = true;
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
  }

  setErrorMessage(message) {
    this.message = message;
    this.messageType = 'error';
  }

  setSuccessMessage(message) {
    this.message = message;
    this.messageType = 'success';
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
