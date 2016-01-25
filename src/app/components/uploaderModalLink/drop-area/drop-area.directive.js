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

    const onDragLeave = () => {
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
  constructor ($scope, $log, archiveValidator, uploader) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.status = 'none';
    this.archiveValidator = archiveValidator;
    this.uploader = uploader;
  }

  onEnter() {
    this.setStatus('enter');
  }

  onDrop(files) {
    this.setStatus('none');
    this.uploader.archive = new LogArchive(files[0]);
    this.$scope.$apply();
  }

  onLeave() {
    this.setStatus('none');
  }

  setStatus(status) {
    this.$scope.$apply(() => {
      this.status = status;
    });
  }

  archiveExists() {
    return this.uploader.archive != null
  }

  getDescription() {
    if (this.archiveExists()) {
      return this.uploader.archive.fileName;
    } else {
      return 'Drop zipped log file'
    }
  }

  getIcon() {
    if (this.archiveExists()) {
      return 'assignment_turned_in';
    } else {
      return 'assignment_late';
    }
  }

  getClass() {
    return {
      enter: this.status == 'enter',
      attached: this.archiveExists()
    };
  }
}
