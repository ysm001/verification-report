export function DetailDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/detail/detail.html',
    scope: {
        creationDate: '='
    },
    controller: DetailController,
    controllerAs: 'detail',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
  }

  return directive;
}

class DetailController {
  constructor ($scope, $log, $timeout, $attrs) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.opened = false;
  }

  activate() {
    this.$log.info('Activated detail View');
  }

  onClicked() {
    this.opened = !this.opened;
    console.log(this.opened);
  }

  isOpen() {
    return this.opened;
  }
}
