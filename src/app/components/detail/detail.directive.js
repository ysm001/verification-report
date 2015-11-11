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
  constructor ($scope, $log, $timeout, $attrs, kernbenchTableJSON, fioTableJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.opened = false;
    this.kernbenchTableJSON = kernbenchTableJSON;
    this.fioTableJSON = fioTableJSON;

    this.activate();
  }

  activate() {
    this.fioTableJSON.getTableJSONs().then((tables) => {
      this.$log.info('Activated detail View');
      this.tables = tables;
    });
  }

  onClicked() {
    this.opened = !this.opened;
    console.log(this.opened);
  }

  isOpen() {
    return this.opened;
  }
}
