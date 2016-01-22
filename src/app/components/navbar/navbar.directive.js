export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
        creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class NavbarController {
  constructor (moment, appStatus) {
    'ngInject';

    // "this.creation" is avaible by directive option "bindToController: true"
    this.relativeDate = moment(this.creationDate).fromNow();
    this.appStatus = appStatus;
  }

  onDrawerButtonClicked() {
    this.appStatus.isFullScreenMode = !this.appStatus.isFullScreenMode;
  }

  forceRender() {
    this.appStatus.requiresFullRender = true;
  }
}
