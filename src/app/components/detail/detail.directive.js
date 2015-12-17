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
    controller.setGroup(attrs.group);
    controller.setCategory(attrs.category);
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
    this.tables = null;
    this.$timeout = $timeout;
    this.appStatus = appStatus;

    this.watchId();
    this.activate();
  }

  activate() {
    this.$log.info('Activated detail View');
  }

  loadDataSource(id, category) {
    this.getJSONService(category).getTableJSONs(id).then((tables) => {
      this.$log.info('Activated detail View');
      this.tables = this.filterTables(tables);
    });
  }

  filterTables(tables) {
    return tables.filter((table) => {
      return table.title == this.group;
    });
  }

  getJSONService(category) {
    if (category == 'io') {
      return this.fioTableJSON;
    } else if (category == 'memory') {
      return this.kernbenchTableJSON;
    } else if (category == 'task') {
      return this.lmbenchTableJSON;
    } else if (category == 'network') {
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
      if (newVal) {
        this.loadDataSource(newVal, this.category);
      }
    }, true);
  }

  setGroup(group) {
    this.group = group;
  }
}
