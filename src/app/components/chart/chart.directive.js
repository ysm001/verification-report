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
    controller.setTitle(attrs.title);
  }

  return directive;
}

class ChartController {
  constructor ($scope, $log, $timeout, $attrs, fioJSON, kernbenchJSON, lmbenchJSON, lmbenchLineJSON, netperfJSON, netperfEachJSON, netperfTimeJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.type = 'mscolumn2d';
    this.dataFormat = 'json';
    this.dataSources = [];
    this.fioJSON = fioJSON;
    this.kernbenchJSON = kernbenchJSON;
    this.lmbenchJSON = lmbenchJSON;
    this.lmbenchLineJSON = lmbenchLineJSON;
    this.netperfJSON = netperfJSON;
    this.netperfEachJSON = netperfEachJSON;
    this.netperfTimeJSON = netperfTimeJSON;

    this.renderTargets = [];

    this.events = {
      renderComplete: this.renderComplete.bind(this)
    };

    this.activate();

    const self = this;
  }

  activate() {
    this.$log.info('Activated ' + this.category + ' Chart View');
  }

  setCategory(category) {
    this.category = category;

    this.loadDataSource(this.category);
  }

  setTitle(title) {
    this.title = title;
  }

  getJSONServices(category) {
    if (category == 'io') {
      return [this.fioJSON];
    } else if (category == 'memory') {
      return [this.kernbenchJSON];
    } else if (category == 'task') {
      return [this.lmbenchJSON, this.lmbenchLineJSON];
    } else if (category == 'network') {
      return [this.netperfTimeJSON, this.netperfJSON, this.netperfEachJSON];
    } else {
      console.log('unknown category');
    }
  }

  renderComplete() {
    if (this.renderTargets.length > 0) {
      this.renderOne();
    }
  }

  renderOne() {
    this.dataSources.push(this.renderTargets.shift());
  }

  makeDataSource(jsonServices) {
    return Promise.all(jsonServices.map((service) => {return service.getFushionFormatJSONs()}));
  }

  loadDataSource(category) {
    this.makeDataSource(this.getJSONServices(category)).then((results) => {
      // this.dataSources = Array.prototype.concat.apply([], results);
      this.renderTargets = Array.prototype.concat.apply([], results);
      this.renderOne();
    });
  }
}
