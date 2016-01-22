export function DetailDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/detail/detail.html',
    scope: {
        creationDate: '='
    },
    controller: DetailController,
    controllerAs: 'detail',
    bindToController: true,
    link: postLink
  };

  function postLink(scope, element, attrs, controller) {
    controller.setDataId(attrs.dataid);
    controller.setGroup(attrs.group);
    controller.setCategory(attrs.category);
    controller.setTab(attrs.tab);

    scope.$watch(() => {
      return controller.isRenderingAsSvg;
    }, (newValue) => {
      if (newValue) {
        const container = element.find('.detail-container');
        const svg = createSVGFromElement(element, container.width(), container.height());
        controller.svgRenderComplete(svg);
        // createCanvasFromElement(element, (canvas) => {
        //   element.append(canvas);
        // });
      }
    });
  }

  function convertCSStoInnerStyle() {
    let modified = [];

    Array.prototype.slice.call(document.styleSheets).forEach((styleSheet) => {
      const rules = styleSheet.cssRules;
      if (!rules) {
        return;
      }

      Array.prototype.slice.call(rules).forEach((rule) => {
        if (rule.selectorText && (rule.selectorText.contains('detail') || rule.selectorText.contains('mdl'))) {
          angular.element(rule.selectorText).each((i, elem) => {
            elem.style.cssText += rule.style.cssText;
            modified.push({elem: elem, css: rule.style.cssText});
          });
        }
      });
    });

    return modified;
  }

  function resetInnerStyle(modified) {
    modified.forEach((m) => {
      m.elem.style.cssText -= m.css;
    });
  }

  function createSVGFromElement(element, width, height) {
    const modified = convertCSStoInnerStyle();
    const style = `font-family: "Helvetica","Arial",sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;`;

    const data = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' style='${style}'>
      <foreignObject width='100%' height='100%'>
      <div xmlns='http://www.w3.org/1999/xhtml'>${element.html()}</div>
      </foreignObject>
      </svg>`;

    resetInnerStyle(modified);
    return data;

    // return new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  }

  function createCanvasFromImg(img, width, height) {
    const canvas = angular.element(`<canvas width="${width}px" height="${height}px" />`)[0];
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  function createCanvasFromElement(element, callback) {
    const container = element.find('.detail-container');
    const svg = createSVGFromElement(element, container.width(), container.height());
    const img = new Image();
    const DOMURL = self.URL || self.webkitURL || self;
    const url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      const canvas = createCanvasFromImg(img, container.width(), container.height());
      DOMURL.revokeObjectURL(url);
      callback(canvas);
    };

    img.src = url;
  }

  return directive;
}

class DetailController {
  constructor ($scope, $log, $timeout, $attrs, appStatus, chartCache, kernbenchTableJSON, fioTableJSON, lmbenchTableJSON, netperfTableJSON) {
    'ngInject';

    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.kernbenchTableJSON = kernbenchTableJSON;
    this.lmbenchTableJSON = lmbenchTableJSON;
    this.fioTableJSON = fioTableJSON;
    this.netperfTableJSON = netperfTableJSON;
    this.$timeout = $timeout;
    this.appStatus = appStatus;
    this.tablesCache = null;
    this.isActive = false;
    this.isRenderingAsSvg = false;
    this.chartCache = chartCache;
    this.cached = false;

    this.watchId();
    this.watchRenderFlag();
  }

  activate() {
    this.isActive = true;
    this.$log.info('Activated detail View');
  }

  loadDataSource(id, category, tab) {
    return this.getJSONService(category).getTableJSONs(id, tab).then((tables) => {
      this.tablesCache = this.filterTables(tables);
    });
  }

  filterTables(tables) {
    return tables.filter((table) => {
      return table.title == this.group;
    });
  }

  watchRenderFlag() {
    this.$scope.$watch(() => {return this.appStatus.requiresFullRender}, (newVal, oldVal) => {
      if (!newVal || this.appStatus.currentId != this.dataId) {
        return;
      }

      if (this.dataLoaded()) {
        this.render();
        this.$timeout(this.renderAsSvg.bind(this), 1000);
      } else {
        this.loadDataSource(this.dataId, this.category, this.tab).then(() => {
          this.render();
          this.$timeout(this.renderAsSvg.bind(this), 1000);
        });
      }
    }, true);
  }

  getJSONService(category) {
    if (category == 'fio') {
      return this.fioTableJSON;
    } else if (category == 'kernbench') {
      return this.kernbenchTableJSON;
    } else if (category == 'lmbench') {
      return this.lmbenchTableJSON;
    } else if (category == 'netperf') {
      return this.netperfTableJSON;
    } else {
      console.log('unknow category');
    }
  }

  setCategory(category) {
    this.category = category;
  }

  watchId() {
    this.$scope.$watch(() => {return this.appStatus.currentId}, (newVal, oldVal) => {
      if (newVal && this.appStatus.currentId == this.dataId && !this.dataLoaded()) {
        this.loadDataSource(newVal, this.category, this.tab);
      }
    }, true);
  }

  render() {
    if (this.tables == null) {
      this.tables = this.tablesCache;
      this.activate();
    }
  }

  renderAsSvg() {
    this.isRenderingAsSvg = true;
  }

  svgRenderComplete(svg) {
    const id = `${this.category}_${this.tab}_${this.group}_table_${this.dataId}`;
    this.chartCache.set(id, svg, null).then(() => {
      this.cached = true;
    });
  }

  dataLoaded() {
    return this.tablesCache != null;
  }

  setGroup(group) {
    this.group = group;
  }

  setTab(tab) {
    this.tab = tab;
  }
  
  setDataId(dataId) {
    this.dataId = dataId;
  }
}
