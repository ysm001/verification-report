export function ExporterDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/exporter/exporter.html',
    scope: {
        creationDate: '='
    },
    controller: ExporterController,
    controllerAs: 'exporter',
    bindToController: true
  };

  return directive;
}

class ExporterController {
  constructor ($scope, $log, $interval, appStatus) {
    'ngInject';

    this.$log = $log;
    this.$interval = $interval;
    this.appStatus = appStatus;
  }

  forceRender() {
    this.appStatus.requiresFullRender = true;
    this.waitForRenderComplete(() => {
      console.log('render complete');
    });
  }

  waitForRenderComplete(callback) {
    const charts = angular.element('.fs-chart-svg-container').toArray();

    console.log('wait for render complete...');
    const polling = this.$interval(() => {
      const completed = charts.every((chart) => {
        return chart.getAttribute('cached') == 'true';
      });

      if (completed) {
        this.$interval.cancel(polling);
        callback();
      }
    }, 100);
  }

  onClick() {
    this.forceRender();
  }
}

