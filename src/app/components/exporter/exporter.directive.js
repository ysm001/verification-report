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
  constructor ($scope, $log, $interval, $timeout, appStatus, verification) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.appStatus = appStatus;
    this.verification = verification;
    this.initProgress();
  }

  renderComplete() {
    console.log('render complete');
    this.appStatus.requiresFullRender = false;

    this.$timeout(() => {
      this.isRendering = false;
      this.isExporting = true;
      this.exportURL = this.verification.getExportUrl(this.appStatus.currentId);
    }, 1000);
  }

  forceRender() {
    this.initProgress().then(() => {
      this.isRendering = true;
      this.waitForRenderComplete(this.renderComplete.bind(this));

      this.$timeout(() => {
        this.appStatus.requiresFullRender = true;
      }, 1000);
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
      this.isRendering = false;
      this.isExporting = false;
      this.renderTargetNum = 0;
      this.renderCompletedNum = 0;
      this.progressText = '0/0';
      this.exportURL = '';
    }, 0);
  }

  getRenderTarget() {
    const charts = angular.element('.fs-chart-svg-container').toArray();
    const tables = angular.element('.detail-container').toArray();
    return charts.concat(tables).filter((chart) => {
      return chart.getAttribute('dataid') == this.appStatus.currentId;
    });
  }

  onClick() {
    this.forceRender();
  }

  onDownloadButtonClicked() {
    this.initProgress();
  }
}

