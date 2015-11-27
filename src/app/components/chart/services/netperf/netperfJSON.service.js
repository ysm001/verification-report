import { ChartJSONService } from '../chartJSON.service';

export class NetperfJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'network');
  }

  getType(operation) {
    return 'msstackedcolumn2d';
  }

  getStyle(operation) {
    return {
      caption: operation,
      xAxisName: '',
      showValues: 0
    };
  }

  getItems() {
    return [
      '%gnice',
      '%guest',
      '%iowait',
      '%irq',
      '%nice',
      '%soft',
      '%steal',
      '%sys',
      '%usr'
    ];
  }

  makeDataset(operation, rawJson) {
    if (rawJson == null || Object.keys(rawJson.all).length == 0) {
      return null;
    }

    return [{dataset: this.makeSeries(rawJson, 'old')}, {dataset: this.makeSeries(rawJson, 'new')}];
  }

  makeCategories(operation, rawJson) {
    if (rawJson == null) return;

    return [{
      category: Object.keys(rawJson.all).map(function(k) {return {label: k }})
    }];
  }

  makeSeries(rawJson, key) {
    const items = this.getItems();

    const all = rawJson.all;
    return this.getItems().map((item) => {
      const data = Object.keys(all).map((k) => {
        return (key in all[k]) ? {value: all[k][key][item]} : {value: 0};
      });

      return {
        seriesname: item,
        data: data
      }
    });
  }
}
