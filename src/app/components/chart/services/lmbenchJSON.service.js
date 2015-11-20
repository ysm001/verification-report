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
    return Object.keys(rawJsons).reduce((result, key) => {
      const target = 'File & VM system';
      if (key != target) {
        result[key] = rawJsons[key];
        return result;
      }

      const formattedData = this.formatFileVMSystemData(rawJsons, target, key);
      Object.keys(formattedData).forEach((key) => { result[key] = formattedData[key] } );

      return result;
    }, {});
  }

  formatFileVMSystemData(rawJsons, target, key) {
    const result = {};
    const mmapLatency = 'Mmap Latency';

    result[`${target} 1/2`] = {mmapLatency: rawJsons[target][mmapLatency]};
    result[`${target} 2/2`] = rawJsons[target];
    delete result[`${target} 2/2`][mmapLatency];

    return result;
  }

  formatProcessorData(rawJsons, target, key) {
    const result = {};
    const fork = 'fork proc';
    const exec = 'exec proc';
    const shell = 'sh proc';

    result[`${target} 1/2`] = {
      fork: rawJsons[target][fork],
      exec: rawJsons[target][exec],
      shell: rawJsons[target][shell]
    };

    result[`${target} 2/2`] = rawJsons[target];
    delete result[`${target} 2/2`][fork];
    delete result[`${target} 2/2`][exec];
    delete result[`${target} 2/2`][shell];

    return result;
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
    return [this.makeSeries(operation, rawJson, 'old'), this.makeSeries(operation, rawJson, 'new')];
  }

  makeCategories(operation, rawJson) {
    return [{
      category: this.getKeys(operation, rawJson).map(function(k) {return {label: k }})
    }]
  }

  makeSeries(operation, rawJson, key) {
    return  {
      seriesname: key,
      data: this.getKeys(operation, rawJson).map(function(k) {return {value: rawJson[k]['averages'][key]}})
    }
  }
}
