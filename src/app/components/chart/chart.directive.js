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
    controller.setRenderTarget(JSON.parse(attrs.datasource));
    scope.$watch(() => {
      return controller.svg;
    }, (newValue) => {
      if (newValue != '') {
        element.find('fusioncharts').remove();
        element.find('.fs-chart-svg-container').append(angular.element(newValue));
        controller.svgRenderComplete();
      }
    });
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs, chartLoader) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.visible = false;

    this.dataFormat = 'json';
    this.renderTarget = null;
    this.dataSource = {"chart": {}};
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

  show() {
    this.$timeout(() => {
      this.visible = true;
    }, 0);
  }
}
