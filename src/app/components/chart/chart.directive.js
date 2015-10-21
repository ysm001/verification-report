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
    bindToController: true
  };

  return directive;
}

class ChartController {
  constructor ($scope, $log) {
    'ngInject';

    this.$log = $log;
    this.type = 'mscolumn2d'
    this.dataSource = 'data/details/network1.json';
    this.dataFormat = 'jsonurl';

    this.activate();
  }

  activate() {
    this.$log.info('Activated NetworkChart View');
  }
}
