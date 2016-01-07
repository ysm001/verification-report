import { PromiseQueue } from '../../../lib/promise-queue';

export class ChartLoaderService {
  constructor($q, chartCache) {
    'ngInject';

    this.promiseQueue = new PromiseQueue($q);
    this.chartCache = chartCache;
    this.doneFuncs = {};

    this.promiseQueue.start();
  }

  renderComplete(eventObj, eventArgs) {
    const id = eventObj.sender.args.renderAt.id;
    const svg = eventObj.sender.getSVGString();

    this.chartCache.set(eventObj.sender.args.dataSource, svg);

    this.notify(id, svg);
  }

  cacheLoaded(chart, svg) {
    console.log('cache used');
    this.notify(chart.id, svg);
  }

  notify(id, svg) {
    const chart = this.doneFuncs[id].chart;
    const done = this.doneFuncs[id].done;

    chart.renderComplete(svg);
    done();
  }

  load(chart, dataSource) {
    const loadFunc = (done) => {
      this.doneFuncs[chart.id] = {
        chart: chart,
        done: done
      };

      this.loadChart(chart, dataSource);
    };

    this.promiseQueue.add(loadFunc, true);
  }

  loadChart(chart, dataSource) {
    const cachedSVG = this.chartCache.get(dataSource);
    if (cachedSVG == null) {
      chart.dataSource = dataSource;
    } else {
      this.cacheLoaded(chart, cachedSVG);
    }
  }
}
