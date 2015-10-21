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
    controller.setDataSource(attrs.datasource);
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log) {
    'ngInject';

    this.$log = $log;
    this.type = 'mscolumn2d'
    this.dataSource = 'data/details/chart-network.json';
    this.dataFormat = 'jsonurl';

    this.activate();
  }

  activate() {
    this.$log.info('Activated NetworkChart View');
  }

  setDataSource(dataSource) {
    this.dataSource = dataSource;
  }
}
