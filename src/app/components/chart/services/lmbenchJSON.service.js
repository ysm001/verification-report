export class LmbenchJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
  }

  getJSON() {
    return this.$resource('/data/details/task.json').get();
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

    const dataSet = self.makeDataset(rawJson);
    const categories = self.makeCategories(rawJson);

    style.caption = operation;
    style.xAxisName = '';
    style.yAxisName = '';

    return {
      chart: style,
      categories: categories,
      dataset: dataSet
    };
  }

  makeDataset(rawJson) {
    return [this.makeSeries(rawJson, 'ON'), this.makeSeries(rawJson, 'ON/ON'), this.makeSeries(rawJson, 'OFF/ON')]
  }

  makeCategories(rawJson) {
    return [{
      category: Object.keys(rawJson).map(function(k) {return {label: k }})
    }]
  }

  makeSeries(rawJson, key) {
    return  {
      seriesname: key,
      data: Object.keys(rawJson).map(function(k) {return {value: rawJson[k][key]}})
    }
  }
}
