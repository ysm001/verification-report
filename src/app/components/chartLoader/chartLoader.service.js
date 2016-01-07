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

  notify(id, svg) {
    const chart = this.doneFuncs[id].chart;
    const done = this.doneFuncs[id].done;

    chart.renderComplete(svg);
    done();
  }

  load(chart, dataSource) {
    const cachedSVG = this.chartCache.get(dataSource);
    if (cachedSVG != null) {
      chart.renderComplete(cachedSVG);
    } else {
      this.loadDataSource(chart, dataSource);
    }
  }

  loadDataSource(chart, dataSource) {
    const loadFunc = (done) => {
      this.doneFuncs[chart.id] = {
        chart: chart,
        done: done
      };

      chart.dataSource = dataSource;
      this.render(chart, dataSource);
    };

    this.promiseQueue.add(loadFunc, true);
  }

  render(chart, dataSource) {
    const elem = `
    <fusioncharts
       id="{{::chart.id}}"
       class="fs-chart fs-chart-dummy"
       ng-class="{'fs-chart-show': chart.visible}"
       in-view="chart.render($inview, $inviewpart)"
       width="600" 
       height="400"
       type={{::chart.dataSource.type}}
       dataformat={{::chart.dataFormat}}
       datasource={{chart.dataSource}}
       events="chart.events"
       >
    </fusioncharts>
    `

    chart.renederFusionChart(elem);
  }
}
