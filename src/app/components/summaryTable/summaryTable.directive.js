export function SummaryTableDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/summaryTable/summaryTable.html',
    scope: {
        creationDate: '='
    },
    controller: SummaryTableController,
    controllerAs: 'summaryTable',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    scope.$watch(() => {
      return controller.isActivated;
    }, (newValue) => {
      if (newValue) {
        const table = element.find('table');
        console.log('upgrade');
        table.find('th')[0].remove();
        table.removeAttr('data-upgraded');
        componentHandler.upgradeDom();
      }
    });
  }

  return directive;
}

class SummaryTableController {
  constructor ($scope, $log, verification, appStatus) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.summaries = [];
    this.appStatus = appStatus;
    this.verification = verification;
    this.isActivated = false;

    this.watchUpdateFlag();
    this.activate();
  }

  activate() {
    return this.fetchAndUpdate().then((summaries) => {
      this.isActivated = true;
      this.$log.info('Activated Summaries View');
    });
  }

  watchUpdateFlag() {
    this.$scope.$watch(() => {return this.appStatus.summaryUpdated}, (newVal, oldVal) => {
      if (newVal) {
        this.fetchAndUpdate();
        this.appStatus.summaryUpdated = false;
      }
    }, true);
  }


  fetchAndUpdate() {
    return this.getSummaries().then((summaries) => {
      this.appStatus.summaryIds = summaries.map((s) => {return s._id;});
      if (summaries.length > 0) {
        this.appStatus.currentId = summaries[0]._id;
      }
    });
  }

  getSummaries() {
    return this.verification.getSummary().then((data) => {
      this.summaries = data.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });

      return this.summaries;
    });
  }

  getClass(element) {
    return this.appStatus.currentId == element._id ? 'summary-record-active' : '';
  }

  onClick(element) {
    this.appStatus.currentId = element._id;
  }

  onRemoveButtonClicked() {
    const targets = angular.element('.summary-table tbody .is-checked');
    console.log(targets.length);
  }
}
