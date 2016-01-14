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
  constructor ($scope, $log, $interval, $timeout, appStatus) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.appStatus = appStatus;
    this.initProgress();
  }

  forceRender() {
    this.initProgress().then(() => {
      this.appStatus.requiresFullRender = true;
      this.waitForRenderComplete(() => {
        this.appStatus.requiresFullRender = false;
        console.log('render complete');
      });
    });
  }

  waitForRenderComplete(callback) {
    console.log('wait for render complete...');

    const polling = this.$interval(() => {
      const charts = this.getRenderTarget();

      this.$timeout(() => {
        this.renderTargetNum = charts.length;
        this.renderCompletedNum = charts.filter((chart) => {
          return chart.getAttribute('cached') == 'true';
        }).length;
        this.progressText = `${this.renderCompletedNum} / ${this.renderTargetNum}`;

        if (this.renderTargetNum == this.renderCompletedNum) {
          this.$interval.cancel(polling);
          callback();
        }
      }, 0);
    }, 100);
  }

  initProgress() {
    return this.$timeout(() => {
      this.renderTargetNum = 0;
      this.renderCompletedNum = 0;
      this.progressText = '0/0';
    }, 0);
  }

  getRenderTarget() {
    return angular.element('.fs-chart-svg-container').toArray().filter((chart) => {
      return chart.getAttribute('dataid') == this.appStatus.currentId;
    });
  }

  isRendering() {
    return this.appStatus.requiresFullRender;
  }

  onClick() {
    this.forceRender();
  }
}

