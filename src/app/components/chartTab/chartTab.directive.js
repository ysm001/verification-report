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
        ctrl.setActiveTab((getActiveTarget(element) || {}).id);
      });
    });
  }

  function getActiveTarget(element) {
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
  constructor ($scope, $log, $location, $anchorScroll) {
    'ngInject';

    this.$log = $log;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.activeTab = angular.element('chart')[0].id;

    this.activate();
  }

  activate() {
      this.$log.info('Activated ChartTab View');
  }

  scrollTo(id) {
    this.$location.hash(id);
    this.$anchorScroll();
  }

  setActiveTab(id) {
    this.activeTab = id;
  }

  getClass(id) {
    return this.activeTab == id ? 'chart-tab-active' : '';
  }
}
