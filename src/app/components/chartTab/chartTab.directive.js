export function ChartTabDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/chartTab/chartTab.html',
    scope: {
        creationDate: '='
    },
    controller: ChartTabController,
    controllerAs: 'chartTab',
    bindToController: true
  };

  return directive;
}

class ChartTabController {
  constructor ($scope, $log) {
    'ngInject';

    this.$log = $log;
    this.activate();
  }

  activate() {
      this.$log.info('Activated ChartTab View');
  }

  getChartData() {
  }
}
