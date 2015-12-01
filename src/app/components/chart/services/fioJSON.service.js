import { ChartJSONService } from './chartJSON.service';

export class FioJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'io');
  }

  getStyle(operation) {
    return {
      caption: operation,
      xAxisName: 'Block Size (KB)',
      yAxisName: 'Throughput (MB/s)'
    };
  }

  formatJSON(operation, rawJson) {
    const nested_throughputs = rawJson.map(function(val) {return val.throughputs});
    return Array.prototype.concat.apply([], nested_throughputs);
  }

  makeDataset(operation, throughputs) {
    return [this.makeSeries(throughputs, 'old'), this.makeSeries(throughputs, 'new')]
  }

  makeCategories(operation, throughputs) {
    return [{
      category: throughputs.map(function(t) {return {label: t.block_size.toString()}})
    }]
  }

  makeSeries(throughputs, key) {
    return  {
      seriesname: key,
      data: throughputs.map(function(t) {return {value: t[key]}})
    }
  }
}
