export function VersionInputFieldDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/uploaderModalLink/versionInputField/versionInputField.html',
    scope: {
        creationDate: '='
    },
    controller: VersionInputFieldController,
    controllerAs: 'versionInputField',
    bindToController: true,
    link: {
      post: ($element) => {
        componentHandler.upgradeDom();
      }
    }
  };

  return directive;
}

class VersionInputFieldController {
  constructor ($scope, $log, ModalService, uploader) {
    'ngInject';

    this.$log = $log;
    this.ModalService = ModalService;
    this.uploader = uploader;
  }
}
