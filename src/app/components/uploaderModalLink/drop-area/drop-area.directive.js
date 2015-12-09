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

  function link(scope, element, attrs, controller) {
    const cancelEvent = (event) => {
      event.stopPropagation();
      event.preventDefault();
    }

    const onDragOverOrEnter = (event) => {
      controller.onEnter();
      cancelEvent(event);
    }

    const onDrop = (event) => {
      controller.onDrop();
      cancelEvent(event);

      controller.onDrop(event.originalEvent.dataTransfer.files);
    }

    const onDragLeave = (event) => {
      controller.onLeave();
    }

    element.bind('dragover', onDragOverOrEnter);
    element.bind('dragenter', onDragOverOrEnter);
    element.bind('drop', onDrop);
    element.bind('dragleave', onDragLeave);
  }

  return directive;
}

export class DropAreaController {
  constructor ($scope, $log) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.status = 'none';
  }

  onEnter() {
    this.setStatus('enter');
  }

  onDrop(files) {
    this.setStatus('none');
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
