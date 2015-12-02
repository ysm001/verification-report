import { PromiseQueue } from '../../../lib/promise-queue';

export class ChartLoaderService {
  constructor($q) {
    'ngInject';

    this.promiseQueue = new PromiseQueue($q);

    this.promiseQueue.start();
  }

  load(chart, dataSource) {
    const loadFunc = (done) => {
      chart.done = done;
      chart.dataSource = dataSource;
    };

    this.promiseQueue.add(loadFunc, true);
  }
}
