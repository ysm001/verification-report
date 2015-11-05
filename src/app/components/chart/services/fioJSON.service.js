export class FioJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
  }

  getJSON() {
    return this.$resource('/data/details/io.json').get();
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

    const nested_throughputs = rawJson.map(function(val) {return val.throughputs});
    const throughputs = Array.prototype.concat.apply([], nested_throughputs);

    const dataSet = self.makeDataset(throughputs);
    const categories = self.makeCategories(throughputs);

    style.caption = operation;
    style.xAxisName = '';
    style.yAxisName = 'Throughput (MB/ms)';

    return {
      chart: style,
      categories: categories,
      dataset: dataSet
    };
  }

  makeDataset(throughputs) {
    return [this.makeSeries(throughputs, 'old'), this.makeSeries(throughputs, 'new')]
  }

  makeCategories(throughputs) {
    return [{
      category: throughputs.map(function(t) {return {label: t.block_size + 'K'}})
    }]
  }

  makeSeries(throughputs, key) {
    return  {
      seriesname: key,
      data: throughputs.map(function(t) {return {value: t[key]}})
    }
  }
}
