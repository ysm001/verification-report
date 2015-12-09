export class UploaderController {
  constructor ($scope, $log, close) {
    'ngInject';

    this.$log = $log;
    this.modalClose = close;
    this.hidden = true;
  }

  show() {
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
}
