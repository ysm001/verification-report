export function SummaryTableDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/summaryTable/summaryTable.html',
    scope: {
        creationDate: '='
    },
    controller: SummaryTableController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class SummaryTableController {
  constructor (moment) {
    'ngInject';

    // "this.creation" is avaible by directive option "bindToController: true"
    // this.relativeDate = moment(this.creationDate).fromNow();
  }
}
