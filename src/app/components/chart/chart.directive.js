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
    controller.setTitle(attrs.title);
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs, fioJSON, kernbenchJSON, lmbenchJSON, netperfJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.type = 'mscolumn2d';
    this.dataFormat = 'json';
    this.dataSources = [];
    this.fioJSON = fioJSON;
    this.kernbenchJSON = kernbenchJSON;
    this.lmbenchJSON = lmbenchJSON;
    this.netperfJSON = netperfJSON;

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

  setTitle(title) {
    this.title = title;
  }

  getJSONService(category) {
    if (category == 'io') {
      return this.fioJSON;
    } else if (category == 'memory') {
      return this.kernbenchJSON;
    } else if (category == 'task') {
      return this.lmbenchJSON;
    } else if (category == 'network') {
      return this.netperfJSON;
    } else {
      console.log('unknown category');
    }
  }

  loadDataSource(category) {
    this.getJSONService(category).getFushionFormatJSONs().then((res) => {
      this.$timeout(() => {
        if (this.category != 'task') return;
        this.dataSources = res;
        this.$scope.$apply();
      }, 0);
    });
  }
}
