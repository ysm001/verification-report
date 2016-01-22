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

  let cardTabs = {};

  function postLink(scope, element, attrs, ctrl) {
    ctrl.setDataId(attrs.dataid);

    const header = angular.element('.chart-tabs-container')[0];
    const offset = header.offsetTop + header.offsetHeight;

    element.bind('scroll', function() {
      scope.$apply(function() {
        const activeTab = getActiveTab(element, offset) || {};
        ctrl.setActiveTabById(activeTab.id);
        ctrl.setCardTabFixed(cardTabFixed(element , offset, activeTab));
      });
    });
  }

  function getActiveTab(element, offset) {
    const raw = element[0];

    return angular.element('chart-container').filter((idx, chart) => {
      return chart.offsetTop - offset <= raw.scrollTop;
    }).sort((a, b) => {return b.offsetTop - a.offsetTop})[0];
  }

  function cardTabFixed(element, offset, activeTab) {
    const raw = element[0];

    const cardTab = getCardTab(activeTab);
    const offsetTop = activeTab.offsetTop + raw.offsetTop - cardTab.height() - offset;

    return raw.scrollTop > offsetTop;
  }

  function getCardTab(activeTab) {
    if (!(activeTab.id in cardTabs)) {
      cardTabs[activeTab.id] = angular.element(angular.element(activeTab).find('.chart-card-tab')[0]);
    }

    return cardTabs[activeTab.id];
  }

  return directive;
}

class ChartTabController {
  constructor ($scope, $log, $location, $anchorScroll, $interval, verificationSummary, appStatus) {
    'ngInject';

    this.$log = $log;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.activeTab = 0;
    this.activeTabId = null;
    this.appStatus = appStatus;
    this.cardTabFixed = false;
    this.dataId = '';
    this.$interval = $interval;
    this.tabs = angular.element('chart-tab');

    this.categories = [];
    this.activate(verificationSummary);
    // this.$interval(this.autoScroll.bind(this), 500);
  }

  activate(verificationSummary) {
    return verificationSummary.getCategories().then((data) => {
      this.$log.info('Activated ChartTab View');

      this.categories = data;

      return this.categories;
    });
  }

  autoScroll() {
    angular.forEach(this.tabs, (tab) => {
      tab.scrollTop += 1;
      tab.scrollTop -= 1;
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

  setCardTabFixed(fixed) {
    if (this.cardTabFixed != fixed) {
      this.cardTabFixed = fixed;
    }
  }

  getClass(index) {
    return this.isActive(index) ? 'chart-tab-active' : '';
  }

  isActive(index) {
    return this.activeTab == index;
  }

  setDataId(dataId) {
    this.dataId = dataId;
  }
}
