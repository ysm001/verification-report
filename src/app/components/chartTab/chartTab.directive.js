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
    // element.bind('scroll', function() {
    //   scope.$apply(function() {
    //     ctrl.setActiveTabById((getActiveTab(element) || {}).id);
    //   });
    // });
  }

  function getActiveTab(element) {
    const raw = element[0];
    const header = angular.element('.chart-tabs-container')[0];
    const offset = header.offsetTop + header.offsetHeight;

    return angular.element('chart-container').filter(function(idx, chart) {
      return chart.offsetTop - offset <= raw.scrollTop;
    }).sort(function(a, b) {return b.offsetTop - a.offsetTop})[0];
  }

  return directive;
}

class ChartTabController {
  constructor ($scope, $log, $location, $anchorScroll, verificationSummary, appStatus) {
    'ngInject';

    this.$log = $log;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.activeTab = 0;
    this.activeTabId = null;
    this.appStatus = appStatus;

    this.categories = [];
    this.activate(verificationSummary);
  }

  activate(verificationSummary) {
    return verificationSummary.getCategories().then((data) => {
      this.$log.info('Activated ChartTab View');

      this.categories = data;

      return this.categories;
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
    if (id == this.activeTabId) return;

    this.activeTabId = id;
    this.setActiveTab(this.categories.findIndex(function(category) {return category.id == id;}));
  }

  getClass(index) {
    return this.activeTab == index ? 'chart-tab-active' : '';
  }
}
