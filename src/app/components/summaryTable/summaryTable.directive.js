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

    this.$log = $log;
    this.summaries = [];
    this.appStatus = appStatus;

    this.activate(verification);
  }

  activate(verification) {
    return this.getSummaries(verification).then((summaries) => {
      if (summaries.length > 0) {
        this.appStatus.currentId = summaries[0]._id;
      }

      this.$log.info('Activated Summaries View');
    });
  }

  getSummaries(verification) {
    return verification.getSummary().then((data) => {
      this.summaries = data;

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
