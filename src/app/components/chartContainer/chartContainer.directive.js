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

    scope.$watch(() => {
      return element.attr('active');
    }, (newValue) => {
      controller.setActive(newValue);
    });
  }

  return directive;
}

class ChartContainerController {
  constructor ($scope, $log, $timeout, $attrs, appStatus, fioJSON, kernbenchJSON, lmbenchJSON, lmbenchLineJSON, netperfJSON, netperfEachJSON, netperfTimeJSON) {
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
    this.appStatus = appStatus;
    this.dataSourcesCache = [];
    this.isActive = false;

    this.activate();
    this.watchId();

    const self = this;
  }

  activate() {
    this.$log.info('Activated ' + this.category + ' Chart View');
  }

  setCategory(category) {
    this.category = category;
  }

  setTitle(title) {
    this.title = title;
  }

  watchId() {
    this.$scope.$watch(() => {return this.appStatus.currentId}, (newVal, oldVal) => {
      if (newVal) {
        this.loadDataSource(newVal, this.category);
      }
    }, true);
  }

  getJSONServices(category) {
    if (category == 'fio') {
      return [this.fioJSON];
    } else if (category == 'kernbench') {
      return [this.kernbenchJSON];
    } else if (category == 'lmbench') {
      return [this.lmbenchJSON];
    } else if (category == 'netperf') {
      return [this.netperfTimeJSON, this.netperfJSON, this.netperfEachJSON];
    } else {
      console.log(`unknown category: ${category}`);
    }
  }

  makeDataSource(jsonServices, id) {
    return Promise.all(jsonServices.map((service) => {return service.getFushionFormatJSONs(id)})).then((results) => {
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

  loadDataSource(id, category) {
    this.makeDataSource(this.getJSONServices(category), id).then((results) => {
      this.dataSources = [];
      this.dataSourcesCache = results;

      this.render(this.isActive);
    });
  }

  render($inview) {
    if ($inview && this.dataSources != this.dataSourcesCache) {
      console.log(`render: ${this.category}`);
      this.dataSources = this.dataSourcesCache;
    }
  }

  setActive(isActive) {
    this.isActive = isActive == 'true';
    this.render(this.isActive);
  }
}
