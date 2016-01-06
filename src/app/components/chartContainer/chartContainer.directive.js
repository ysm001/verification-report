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
      controller.setActive(newValue == 'true');
    });

    scope.$watch(() => {
      return element.attr('tabFixed');
    }, (newValue) => {
      controller.setTabFixed(newValue === 'true');
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
    this.activeTab = "";
    this.tabFixed = false;

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

  makeTab() {
  }

  makeDataSource(jsonServices, id) {
    return Promise.all(jsonServices.map((service) => {return service.getFushionFormatJSONs(id)})).then((tabs) => {
      const nestedTabs = Array.prototype.concat.apply([], tabs);
      return nestedTabs.reduce((result, tab) => {
        result[tab.tab] = result[tab.tab] || {};
        Object.keys(tab.jsons).forEach((key) => {
          if (key in result[tab.tab]) {
            result[tab.tab][`${key}_${Date.now}`] = tab.jsons[key];
          } else {
            result[tab.tab][key] = tab.jsons[key];
          }
        });

        return result;
      }, {});
    });
  }

  loadDataSource(id, category) {
    this.makeDataSource(this.getJSONServices(category), id).then((dataSources) => {
      this.dataSources = [];
      this.tabs = Object.keys(dataSources);

      this.tabDataSourcesCache = {};
      Object.keys(dataSources).forEach((tab) => {
        this.tabDataSourcesCache[tab] = dataSources[tab];
      });

      this.setActiveTab(this.tabs[0]);
      this.render(this.isActive);
    });
  }

  render($inview) {
    if ($inview && this.tabDataSources != this.tabDataSourcesCache) {
      this.tabDataSources = this.tabDataSourcesCache;
    }
  }

  setActive(isActive) {
    this.isActive = isActive;
    this.render(this.isActive);
  }

  onChartCardTabItemClicked(tab) {
    this.setActiveTab(tab);
  }

  isActiveTab(tab) {
    return tab == this.activeTab;
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  setTabFixed(fixed) {
    console.log(fixed);
    this.tabFixed = fixed;
  }
}
