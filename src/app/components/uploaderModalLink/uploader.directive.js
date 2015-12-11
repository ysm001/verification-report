export function UploaderModalLinkDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/uploaderModalLink/uploaderModalLink.html',
    scope: {
        creationDate: '='
    },
    controller: UploaderModalLinkController,
    controllerAs: 'uploader',
    bindToController: true,
  };

  return directive;
}

class UploaderModalLinkController {
  constructor ($scope, $log, ModalService) {
    'ngInject';

    this.$log = $log;
    this.ModalService = ModalService;
  }

  onClick() {
    this.ModalService.showModal({
      templateUrl: "app/components/uploaderModalLink/uploader.template.html",
      controller: "UploaderTestController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
      });
    });
  }
}

class UploaderTestController {
  constructor ($scope, $log, close) {
    'ngInject';

    this.$log = $log;
    this.modalClose = close;
  }

  close(result) {
    this.modalClose(result, 500);
  }
}
