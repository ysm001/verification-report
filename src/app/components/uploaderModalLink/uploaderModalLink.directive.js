export function UploaderModalLinkDirective($window) {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/uploaderModalLink/uploaderModalLink.html',
    scope: {
        creationDate: '='
    },
    controller: UploaderModalLinkController,
    controllerAs: 'uploaderModalLink',
    bindToController: true,
    link: {
      post: () => {
        $window.componentHandler.upgradeDom();
      }
    }
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
      templateUrl: 'app/components/uploaderModalLink/uploader.template.html',
      controller: 'UploaderController',
      controllerAs: 'uploader'
    }).then(function(modal) {
      modal.controller.show();
    });
  }
}

