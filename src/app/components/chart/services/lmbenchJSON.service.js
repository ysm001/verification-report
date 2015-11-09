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
      const rawJsons = this.formatData(values[1].toJSON());

      return Object.keys(rawJsons).map((key) => {
        return self.getFushionFormatJSON(key, rawJsons[key], values[0].toJSON());
      });
    })
  }

  getFushionFormatJSON(operation, rawJson, style) {
    const self = this;

    const dataSet = self.makeDataset(operation, rawJson);
    const categories = self.makeCategories(operation, rawJson);

    style.caption = operation;
    style.xAxisName = '';
    style.yAxisName = this.getYAxisName(operation);

    return {
      chart: style,
      categories: categories,
      dataset: dataSet
    };
  }

  formatData(rawJsons) {
    return Object.keys(rawJsons).reduce(function(result, key) {
      if (key != 'memory') {
        result[key] = rawJsons[key];
        return result;
      }

      result.memory_mmap = {mmap: rawJsons.memory.mmap};
      result.memory = {
        protection_fault: rawJsons.memory.protection_fault,
        page_fault: rawJsons.memory.page_fault
      };

      return result;
    }, {});
  }

  getYAxisName(operation) {
    if (operation == 'process') {
      return 'Processing Time (μs)';
    } else {
      return 'Latency (μs)'
    }
  }

  getValue(operation, value) {
  }

  getKeys(operation, rawJson) {
    return operation != 'context_switch' ? Object.keys(rawJson) :  ['2p/0K', '2p/16K', '2p/64K', '8p/16K', '8p/64K', '16p/16K', '16p/64K'];
  }

  makeDataset(operation, rawJson) {
    return [this.makeSeries(operation, rawJson, 'ON'), this.makeSeries(operation, rawJson, 'ON/ON'), this.makeSeries(operation, rawJson, 'OFF/ON')]
  }

  makeCategories(operation, rawJson) {
    return [{
      category: this.getKeys(operation, rawJson).map(function(k) {return {label: k }})
    }]
  }

  makeSeries(operation, rawJson, key) {
    return  {
      seriesname: key,
      data: this.getKeys(operation, rawJson).map(function(k) {return {value: rawJson[k][key]}})
    }
  }
}
