export function DetailTableDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/detailTable/detailTable.html',
    scope: {
        creationDate: '='
    },
    controller: DetailTableController,
    controllerAs: 'detailTable',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
  }

  return directive;
}

class DetailTableController {
  constructor ($scope, $log, $timeout, $attrs, kernbenchTableJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;

    kernbenchTableJSON.getTableJSONs().then((tables) => {
      const table = tables[0];
      console.log(table);
      this.title = table.title;
      this.headers = table.headers;
      this.records = table.records;
    });

    // this.title = 'Kernbench';

    // this.headers = [
    //   {text: 'a'},
    //   {text: 'b'},
    //   {text: 'c'},
    //   {text: 'd'}
    // ];

    // this.records = [
    // {cols: [{text: 10}, {text: 20}, {text: 30}, {text: 40}]},
    // {cols: [{text: 10}, {text: 20}, {text: 30}, {text: 40}]},
    // {cols: [{text: 10}, {text: 20}, {text: 30}, {text: 40}]},
    // {cols: [{text: 10}, {text: 20}, {text: 30}, {text: 40}]}
    // ];

    this.activate();

    const self = this;
  }

  activate() {
    this.$log.info('Activated detailTable View');
  }
}
