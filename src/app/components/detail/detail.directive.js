export function DetailDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/detail/detail.html',
    scope: {
        creationDate: '='
    },
    controller: DetailController,
    controllerAs: 'detail',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    controller.setDataId(attrs.dataid);
    controller.setGroup(attrs.group);
    controller.setCategory(attrs.category);
    controller.setTab(attrs.tab);
  }

  return directive;
}

class DetailController {
  constructor ($scope, $log, $timeout, $attrs, appStatus, kernbenchTableJSON, fioTableJSON, lmbenchTableJSON, netperfTableJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.kernbenchTableJSON = kernbenchTableJSON;
    this.lmbenchTableJSON = lmbenchTableJSON;
    this.fioTableJSON = fioTableJSON;
    this.netperfTableJSON = netperfTableJSON;
    this.$timeout = $timeout;
    this.appStatus = appStatus;
    this.tab = '';
    this.dataId = '';

    this.watchId();
  }

  activate() {
    this.$log.info('Activated detail View');
  }

  loadDataSource(id, category, tab) {
    this.getJSONService(category).getTableJSONs(id, tab).then((tables) => {
      this.tables = this.filterTables(tables);
      this.activate();
    });
  }

  filterTables(tables) {
    return tables.filter((table) => {
      return table.title == this.group;
    });
  }

  getJSONService(category) {
    if (category == 'fio') {
      return this.fioTableJSON;
    } else if (category == 'kernbench') {
      return this.kernbenchTableJSON;
    } else if (category == 'lmbench') {
      return this.lmbenchTableJSON;
    } else if (category == 'netperf') {
      return this.netperfTableJSON;
    } else {
      console.log('unknow category');
    }
  }

  setCategory(category) {
    this.category = category;
  }

  watchId() {
    this.$scope.$watch(() => {return this.appStatus.currentId}, (newVal, oldVal) => {
      if (newVal && this.appStatus.currentId == this.dataId && !this.dataLoaded()) {
        this.loadDataSource(newVal, this.category, this.tab);
      }
    }, true);
  }

  dataLoaded() {
    return this.tables != null;
  }

  setGroup(group) {
    this.group = group;
  }

  setTab(tab) {
    this.tab = tab;
  }
  
  setDataId(dataId) {
    this.dataId = dataId;
  }
}
