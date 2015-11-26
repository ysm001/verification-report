export class NetperfJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
  }

  getJSON() {
    return this.$resource('/data/details/network.json').get();
  }

  getFushionFormatJSONs() {
    const self = this;

    const stylePromise = this.$resource('/data/templates/style.json').get().$promise;
    const rawJsonPromise = self.getJSON().$promise;

    return this.$q.all([stylePromise, rawJsonPromise]).then((values) => {
      const rawJsons = values[1].toJSON();

      return Object.keys(rawJsons).map((key) => {
        return self.getFushionFormatJSON(key, rawJsons[key], values[0].toJSON());
      });
    })
  }

  getFushionFormatJSON(operation, rawJson, style) {
    const self = this;

    const dataSet = self.makeDataset(operation, rawJson);
    const categories = self.makeCategories(operation, rawJson);
    console.log(dataSet);

    style.caption = operation;
    style.xAxisName = '';
    style.showValues = 0;

    return {
      type: 'msstackedcolumn2d',
      chart: style,
      dataset: dataSet,
      categories: categories
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

  // makeDataset(operation, rawJson) {
  //   if (rawJson == null) return;

  //   return [{dataset: this.makeSeries(rawJson, 'old')}];
  // }

  // makeCategories(operation, rawJson) {
  //   if (rawJson == null || !('old' in rawJson.each)) return;

  //   return [{
  //     category: Object.keys(rawJson.each.old['TCP_RR']).map(function(k) {return {label: k }})
  //   }];
  // }

  // makeSeries(rawJson, key) {
  //   if (!(key in rawJson.each)) {
  //     return [];
  //   }

  //   const items = this.getItems();
  //   const all = rawJson.each[key];

  //   return this.getItems().map((item) => {
  //     const data = Object.keys(all).map((k) => {
  //       const values = all[k];

  //       if (values == null) return [];
  //       return Object.keys(values).map((v) => {return {value: values[v]}});
  //     });

  //     return {
  //       seriesname: item,
  //       data: data
  //     }
  //   });
  // }

  makeDataset(operation, rawJson) {
    if (rawJson == null) return;

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
