import { NetperfJSONService } from './netperfJSON.service.js';

export class NetperfEachJSONService extends NetperfJSONService {
  makeDataset(operation, rawJson) {
    if (rawJson == null) return;

    return [{dataset: this.makeSeries(rawJson, 'old')}];
  }

  makeCategories(operation, rawJson) {
    if (rawJson == null || !('old' in rawJson.each)) return;

    return [{
      category: Object.keys(rawJson.each.old['TCP_RR']).map(function(k) {return {label: k }})
    }];
  }

  makeSeries(rawJson, key) {
    if (!(key in rawJson.each)) {
      return [];
    }

    const items = this.getItems();
    const all = rawJson.each[key];

    return this.getItems().map((item) => {
      const data = Object.keys(all).map((k) => {
        const values = all[k];

        if (values == null) return [];
        return Object.keys(values).map((v) => {return {value: values[v]}});
      });

      return {
        seriesname: item,
        data: data
      }
    });
  }
}
