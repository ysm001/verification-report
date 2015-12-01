import { ChartJSONService } from './chartJSON.service';

export class KernbenchJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'memory');
  }

  formatJson(rawJson) {
    return Array.prototype.concat.apply([], rawJson);
  }

  getStyle(operation) {
    return {
      caption: operation,
      xAxisName: 'Number of Threads',
      yAxisName: 'Average Compile Time (s)'
    };
  }

  getType(operation) {
    return 'mscolumn2d';
  }

  makeDataset(operation, throughputs) {
    return [this.makeSeries(throughputs, 'old'), this.makeSeries(throughputs, 'new')]
  }

  makeCategories(operation, throughputs) {
    return [{
      category: throughputs.map(function(t) {return {label: t.thread_num.toString() }})
    }]
  }

  makeSeries(throughputs, key) {
    return  {
      seriesname: key,
      data: throughputs.map(function(t) {return {value: t[key]}})
    }
  }
}
