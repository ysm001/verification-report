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
    controller.setRenderTarget(attrs.title, JSON.parse(attrs.headers), JSON.parse(attrs.records));
  }

  return directive;
}

class DetailTableController {
  constructor ($scope, $log, $timeout, $attrs) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.activate();
  }

  activate() {
    this.$log.info('Activated detailTable View');
  }

  setTableData(title, headers, records) {
    this.title = title;
    this.headers = headers;
    this.records = records;
  }

  render(inview, inviewPart) {
    if (!inview || !this.renderTarget) return;

    this.setTableData(this.renderTarget.title, this.renderTarget.headers, this.renderTarget.records);
    this.show();
  }

  setRenderTarget(title, headers, records) {
    this.renderTarget = {
      title: title,
      headers: headers,
      records: records
    };
  }

  show() {
    this.$timeout(() => {
      this.visible = true;
    }, 0);
  }
}
