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
  };

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

    this.watchUpdateFlag();
    this.activate();
  }

  activate() {
    return this.fetchAndUpdate().then((summaries) => {
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
}
