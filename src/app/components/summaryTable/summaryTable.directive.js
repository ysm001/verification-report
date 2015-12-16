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
  constructor ($scope, $log, verification) {
    'ngInject';

    this.$log = $log;
    this.summaries = [];
    this.activeRecord = 0;

    this.activate(verification);
  }

  activate(verification) {
    return this.getSummaries(verification).then(() => {
      this.$log.info('Activated Summaries View');
    });
  }

  getSummaries(verification) {
    return verification.getSummary().then((data) => {
      this.summaries = data;

      return this.summaries;
    });
  }

  getClass(index) {
    return this.activeRecord == index ? 'summary-record-active' : '';
  }

  onClick(index) {
    this.activeRecord = index;
  }
}
