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
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    scope.$watch(() => {
      return controller.isUpdated();
    }, (newValue) => {
      if (newValue) {
        const table = element.find('table');
        console.log('upgrade');
        table.find('th')[0].remove();
        table.removeAttr('data-upgraded');
        componentHandler.upgradeDom();
        controller.setUpdated(false);
      }
    });
  }

  return directive;
}

class SummaryTableController {
  constructor ($scope, $log, $timeout, verification, appStatus, ModalService) {
    'ngInject';

    this.$scope = $scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.summaries = [];
    this.appStatus = appStatus;
    this.verification = verification;
    this.isActivated = false;
    this.ModalService = ModalService;
    this.selectedRecords = [];
    this.messageType = '';

    this.watchUpdateFlag();
    this.activate();
  }

  activate() {
    return this.fetchAndUpdate().then((summaries) => {
      this.$log.info('Activated Summaries View');
    });
  }

  watchUpdateFlag() {
    this.$scope.$watch(() => {return this.appStatus.summaryUpdated}, (newVal, oldVal) => {
      if (newVal) {
        this.fetchAndUpdate();
        this.appStatus.summaryUpdated = false;
      }
    }, true);
  }


  fetchAndUpdate() {
    return this.getSummaries().then((summaries) => {
      this.appStatus.summaryIds = summaries.map((s) => {return s._id;});
      if (summaries.length > 0) {
        this.appStatus.currentId = summaries[0]._id;
      }

      this.$timeout(() => {
        this.updated = true;
      }, 0);
    });
  }

  getSummaries() {
    return this.verification.getSummary().then((data) => {
      this.summaries = data.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });

      return this.summaries;
    });
  }

  getClass(element) {
    return this.appStatus.currentId == element._id ? 'summary-record-active' : '';
  }

  onClick(element) {
    this.appStatus.currentId = element._id;
  }

  onRecordClicked() {
    this.$timeout(() => {
      const selectedElements = angular.element('.summary-table tbody .is-selected');
      this.selectedRecords = selectedElements.toArray().map((element) => {
        return {
          id: element.getAttribute('id'),
          name: element.getAttribute('name'),
          createdAt: element.getAttribute('created-at')
        }
      });
    }, 0);
  }

  onRemoveButtonClicked() {
    console.log(this.selectedRecords);
    this.ModalService.showModal({
      templateUrl: 'app/components/summaryTable/removeDialog/removeDialog.template.html',
      controller: RemoveDialogController,
      controllerAs: 'removeDialog'
    }).then((modal) => {
      componentHandler.upgradeDom();
      modal.controller.setTargets(this.selectedRecords);
      modal.controller.show();
    });
  }

  hasSelectedRecords() {
    return this.selectedRecords.length != 0;
  }

  isUpdated() {
    return this.updated;
  }

  setUpdated(updated) {
    this.updated = updated;
  }
}

class RemoveDialogController {
  constructor ($scope, $log, $interval, $timeout, appStatus, verification, ModalService, close) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.appStatus = appStatus;
    this.verification = verification;
    this.ModalService = ModalService;
    this.modalClose = close;
    this.hidden = false;
    this.isRemoving = false;
    this.isRemoved = false;

    this.targets = null;
  }

  remove() {
    this.isRemoving = true;

    const promises = this.targets.map((target) => {
      return this.verification.remove(target.id).then(() => {
        this.$timeout(() => {
          target.isRemoved = true;
        }, 0);
      });
    });

    Promise.all(promises).then(() => {
      this.isRemoving = false;
      this.message = 'Successfully deleted.';
      this.messageType = 'success';
      this.$timeout(() => {
        this.isRemoved = true;
        this.appStatus.summaryUpdated = true;
      }, 0);
    }).catch((error) => {
      this.appStatus.summaryUpdated = true;
      this.message = error;
      this.messageType = 'error';
      this.isRemoving = false;
    });
  }

  hasErrorMessage() {
    return this.messageType == 'error';
  }

  hasSuccessMessage() {
    return this.messageType == 'success';
  }

  show() {
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }

  visible() {
    return !this.hidden;
  }

  close(result) {
    this.modalClose(result, 500);
    this.hide();
  }

  setTargets(targets) {
    this.targets = targets;
  }
}
