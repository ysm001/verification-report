export function ChartTabDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/chartTab/chartTab.html',
    scope: {
        creationDate: '='
    },
    controller: ChartTabController,
    controllerAs: 'chartTab',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, ctrl) {
    element.bind('scroll', function() {
      scope.$apply(function() {
        ctrl.setActiveTabById((getActiveTab(element) || {}).id);
      });
    });
  }

  function getActiveTab(element) {
    var raw = element[0];
    var header = angular.element('.chart-tabs-container')[0];
    var offset = header.offsetTop + header.offsetHeight;

    return angular.element('chart').filter(function(idx, chart) {
      return chart.offsetTop - offset <= raw.scrollTop;
    }).sort(function(a, b) {return b.offsetTop - a.offsetTop})[0];
  }

  return directive;
}

class ChartTabController {
  constructor ($scope, $log, $location, $anchorScroll, verificationSummary) {
    'ngInject';

    this.$log = $log;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.activeTab = 0;

    this.categories = [];
    this.activate(verificationSummary);
  }

  activate(verificationSummary) {
    return verificationSummary.getCategories().then((data) => {
      this.$log.info('Activated ChartTab View');

      this.categories = data;

      return this.summaries;
    });
  }

  scrollTo(index) {
    var id = this.categories[index].id;

    this.$location.hash(id);
    this.$anchorScroll();

    var offset = angular.element('.chart-tabs-container')[0].offsetHeight;
    angular.element('chart-tab')[0].scrollTop -= offset;
  }

  setActiveTab(index) {
    this.activeTab = index;
  }

  setActiveTabById(id) {
    this.setActiveTab(this.categories.findIndex(function(category) {return category.id == id;}));
  }

  getClass(index) {
    return this.activeTab == index ? 'chart-tab-active' : '';
  }
}
