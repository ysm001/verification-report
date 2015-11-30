import { ChartJSONService } from '../chartJSON.service';

export class NetperfTimeJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'network-time');
  }

  formatJSONs(rawJsons) {
    return rawJsons;
  }

  formatJson(rawJson) {
    return Array.prototype.concat.apply([], rawJson);
  }

  getStyle(operation) {
    return {
      caption: operation,
      yAxisName: 'Throughput (Mbps)',
      formatNumberScale: 0
    };
  }

  getType(operation) {
    return 'mscolumn2d';
  }

  getKeys(rawJson) {
    return Object.keys(rawJson).sort((a, b) => {
      return a.length == b.length ? (a < b ? -1 : 1) : (a.length < b.length ? -1 : 1);
    });
  }

  makeDataset(operation, rawJson) {
    return [this.makeSeries(rawJson, 'old'), this.makeSeries(rawJson, 'new')]
  }

  makeCategories(operation, rawJson) {
    return [{
      category: this.getKeys(rawJson).map(function(k) {return {label: k}})
    }]
  }

  makeSeries(rawJson, key) {
    return  {
      seriesname: key,
      data: this.getKeys(rawJson).map(function(k) {return {value: rawJson[k][key]}})
    }
  }
}
