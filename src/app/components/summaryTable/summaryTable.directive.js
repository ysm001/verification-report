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
  constructor ($scope, $log, verificationSummary) {
    'ngInject';

    this.$log = $log;
    this.summaries = [];
    this.activeRecord = 0;

    this.activate(verificationSummary);
  }

  activate(verificationSummary) {
    return this.getSummaries(verificationSummary).then(() => {
      this.$log.info('Activated Summaries View');
    });
  }

  getSummaries(verificationSummary) {
    return verificationSummary.getSummaries().then((data) => {
      this.summaries = data;

      return this.summaries;
    });
  }

  getClass(index) {
    return this.activeRecord == index ? 'summary-record-active' : '';
  }

  onClick(index) {
    console.log(index);
    this.activeRecord = index;
  }
}
