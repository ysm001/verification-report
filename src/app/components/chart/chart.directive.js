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
    controller.setRenderTarget(scope.$parent.chartContainer.getDataSource(attrs.tab, attrs.group, attrs.itemid));

    scope.$watch(() => {
      return controller.svg;
    }, (newValue) => {
      if (newValue != '') {
        element.find('fusioncharts').remove();
        element.find('.fs-chart-svg-container').append(angular.element(newValue));
        controller.svgRenderComplete();
      }
    });

    scope.$watch(() => {
      return controller.fusionChartElem;
    }, (newValue) => {
      if (newValue != '') {
        element.append(newValue);
        controller.$compile(element.find('fusioncharts')[0])(scope);
      }
    });
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $compile, chartLoader) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.$compile = $compile;

    this.visible = false;

    this.dataSource = {chart: {}};
    this.dataFormat = 'json';
    this.renderTarget = null;
    this.rendering = false;
    this.chartLoader = chartLoader;
    this.id = new Date().getTime();
    this.svg = '';

    this.events = {
      renderComplete: chartLoader.renderComplete.bind(chartLoader)
    };

    this.activate();
  }

  activate() {
    this.$log.info('Activated Chart View');
  }

  render(inview, inviewPart) {
    if (!inview || this.rendering) return;

    this.rendering = true;
    this.chartLoader.load(this, this.renderTarget);
  }

  renderComplete(svg) {
    this.renderSVG(svg);
  }

  svgRenderComplete() {
    this.show();
  }

  setRenderTarget(dataSource) {
    this.renderTarget = dataSource;
  }

  renderSVG(svg) {
    this.svg = svg;
  }

  renederFusionChart(elem) {
    this.fusionChartElem = elem;
  }

  show() {
    this.$timeout(() => {
      this.visible = true;
    }, 0);
  }
}
