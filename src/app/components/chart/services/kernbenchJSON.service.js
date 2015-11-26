export class KernbenchJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
  }

  getJSON() {
    return this.$resource('/data/details/memory.json').get();
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

    const nested_throughputs = rawJson;
    const throughputs = Array.prototype.concat.apply([], nested_throughputs);

    const dataSet = self.makeDataset(throughputs);
    const categories = self.makeCategories(throughputs);

    style.caption = operation;
    style.xAxisName = 'Number of Threads';
    style.yAxisName = 'Average Compile Time (s)';

    return {
      type: 'mscolumn2d',
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
