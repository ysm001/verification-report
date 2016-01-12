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
    controller.setChartId(attrs.dataid, attrs.tab, attrs.group, attrs.itemid);
    controller.setRenderTarget(scope.$parent.chartContainer.getDataSource(attrs.tab, attrs.group, attrs.itemid));

    scope.$watch(() => {
      return controller.svg;
    }, (newValue) => {
      if (newValue != '') {
        createCanvasFromSVG(newValue, (canvas) => {
          element.find('.fs-chart-svg-container').append(canvas);
          controller.svgRenderComplete();
        });

        element.find('fusioncharts').remove();
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

  function createCanvasFromImg(img) {
    const canvas = angular.element('<canvas width="600px" height="400px" />')[0];
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  function createCanvasFromSVG(svg, callback) {
    const img = new Image();

    img.onload = () => {
      const canvas = createCanvasFromImg(img);
      callback(canvas);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
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

  setChartId(dataId, tab, group, itemId) {
    this.chartId = `${dataId}_${tab}_${group}_${itemId}`;
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
