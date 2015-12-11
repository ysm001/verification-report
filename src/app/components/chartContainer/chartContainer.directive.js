export function ChartContainerDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/chartContainer/chartContainer.html',
    scope: {
        creationDate: '='
    },
    controller: ChartContainerController,
    controllerAs: 'chartContainer',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    controller.setCategory(attrs.category);
    controller.setTitle(attrs.title);
  }

  return directive;
}

class ChartContainerController {
  constructor ($scope, $log, $timeout, $attrs, fioJSON, kernbenchJSON, lmbenchJSON, lmbenchLineJSON, netperfJSON, netperfEachJSON, netperfTimeJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.type = 'mscolumn2d';
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
      return [this.lmbenchJSON];
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
    return Promise.all(jsonServices.map((service) => {return service.getFushionFormatJSONs()})).then((results) => {
      const nestedDataSource = Array.prototype.concat.apply([], results);
      return nestedDataSource.reduce((result, dataSource) => {
        Object.keys(dataSource).forEach((key) => {
          if (key in result) {
            result[`${key}_`] = dataSource[key];
          } else {
            result[key] = dataSource[key];
          }
        });
        return result;
      }, {});
    });
  }

  loadDataSource(category) {
    this.makeDataSource(this.getJSONServices(category)).then((results) => {
      // this.dataSources = results;
    });
  }
}
