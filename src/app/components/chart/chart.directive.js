export function ChartDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/chart/chart.html',
    scope: {
        creationDate: '='
    },
    controller: ChartController,
    controllerAs: 'chart',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    controller.setCategory(attrs.category);
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs, fioJSON, kernbenchJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.type = 'mscolumn2d';
    this.dataFormat = 'json';
    this.dataSources = [];
    this.fioJSON = fioJSON;
    this.kernbenchJSON = kernbenchJSON;

    this.activate();

    const self = this;
  }

  activate() {
    this.$log.info('Activated ' + this.category + ' Chart View');
  }

  setCategory(category) {
    this.category = category;

    this.loadDataSource(this.category);
  }

  getJSONService(category) {
    if (category == 'io') {
      return this.fioJSON;
    } else if (category == 'memory') {
      return this.kernbenchJSON;
    } else {
      return this.kernbenchJSON;
    }
  }

  loadDataSource(category) {
    const self = this;

    this.getJSONService(category).getFushionFormatJSONs().then((res) => {
      self.$timeout(() => {
        self.dataSources = res;
        self.$scope.$apply();
      }, 0);
    });
  }
}
