export function DetailTableDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/detailTable/detailTable.html',
    scope: {
        creationDate: '='
    },
    controller: DetailTableController,
    controllerAs: 'detailTable',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    controller.setTableData(attrs.title, JSON.parse(attrs.headers), JSON.parse(attrs.records));
  }

  return directive;
}

class DetailTableController {
  constructor ($scope, $log, $timeout, $attrs) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.activate();
  }

  activate() {
    this.$log.info('Activated detailTable View');
  }

  setTableData(title, headers, records) {
    this.title = title;
    this.headers = headers;
    this.records = records;
  }
}
