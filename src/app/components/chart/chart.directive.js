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
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.visible = false;

    this.dataFormat = 'json';
    this.renderTarget = null;
    this.dataSource = {"chart": {}};

    this.events = {
      renderComplete: this.renderComplete.bind(this)
    };

    this.activate();
  }

  activate() {
    this.$log.info('Activated Chart View');
  }

  render(inview) {
    if (!inview) return;

    this.$timeout(() => {
      this.dataSource = this.renderTarget;
    }, 0);
  }

  renderComplete() {
    this.show();
  }

  setRenderTarget(dataSource) {
    this.renderTarget = dataSource;
  }

  show() {
    this.visible = true;
  }
}
