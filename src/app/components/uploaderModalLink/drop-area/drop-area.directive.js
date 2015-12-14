import { LogArchive } from './logArchive.model.js';

export function DropAreaDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/uploaderModalLink/drop-area/drop-area.html',
    scope: {
        creationDate: '='
    },
    controller: DropAreaController,
    controllerAs: 'dropArea',
    bindToController: true,
    link: link
  };

  function link($scope, $element, attrs, controller) {
    const cancelEvent = (event) => {
      event.stopPropagation();
      event.preventDefault();
    }

    const onDragOverOrEnter = (event) => {
      controller.onEnter();
      cancelEvent(event);
    }

    const onDrop = (event) => {
      controller.onDrop(event.originalEvent.dataTransfer.files);
      cancelEvent(event);
    }

    const onDragLeave = (event) => {
      controller.onLeave();
    }

    $element.bind('dragover', onDragOverOrEnter);
    $element.bind('dragenter', onDragOverOrEnter);
    $element.bind('drop', onDrop);
    $element.bind('dragleave', onDragLeave);
  }

  return directive;
}

class DropAreaController {
  constructor ($scope, $log, archiveValidator, verification) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.status = 'none';
    this.archiveValidator = archiveValidator;
    this.verification = verification;
  }

  onEnter() {
    this.setStatus('enter');
  }

  onDrop(files) {
    this.setStatus('none');

    const zipFile = files[0];
    const logArchive = new LogArchive(zipFile);

    this.verification.upload(logArchive).success((data, status, headers, config) => {;
      console.log(data);
    }).error((data, status, headers, config) => {
      console.log(data);
    });
  }

  onLeave() {
    this.setStatus('none');
  }

  setStatus(status) {
    this.$scope.$apply(() => {
      this.status = status;
    });
  }

  getClass() {
    return {
      enter: this.status == 'enter'
    };
  }
}
