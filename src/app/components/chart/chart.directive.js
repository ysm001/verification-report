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
    controller.setCategory(attrs.category);
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs, fioJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.type = 'mscolumn2d';
    this.dataFormat = 'json';
    this.dataSource = '{"a": "a"}';
    this.fioJSON = fioJSON;

    this.activate();

    const self = this;
  }

  activate() {
    this.$log.info('Activated ' + this.category + ' Chart View');
  }

  setCategory(category) {
    const self = this;
    this.category = category;

    this.fioJSON.getFushionFormatJSONs().then((res) => {
      self.$timeout(() => {
        self.dataSource = res[0];
        self.$scope.$apply();
      }, 0);
    });
  }
}
