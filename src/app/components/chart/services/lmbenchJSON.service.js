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
      if (this.isIgnored(key)) {
        return result;
      } else if (key == 'File & VM system') {
        const formattedData = this.formatFileVMSystemData(rawJsons, key, key);
        Object.keys(formattedData).forEach((key) => { result[key] = formattedData[key] } );
      } else if (key == 'Processor, Processes') {
        const formattedData = this.formatProcessorData(rawJsons, key, key);
        Object.keys(formattedData).forEach((key) => { result[key] = formattedData[key] } );
      } else {
        result[key] = rawJsons[key];
      }

      return result;
    }, {});
  }

  formatFileVMSystemData(rawJsons, target, key) {
    const result = {};
    const mmapLatency = 'Mmap Latency';
    const protectionFault = 'Prot Fault';
    const pageFault = 'Page Fault';
    const fdSelect = '100fd selct';

    result[`${target} 1/3`] = rawJsons[target];
    result[`${target} 2/3`] = {
      mmapLatency: rawJsons[target][mmapLatency]
    };
    result[`${target} 3/3`] = {
      protectionFault: rawJsons[target][protectionFault],
      pageFault: rawJsons[target][pageFault],
     fdSelect: rawJsons[target][fdSelect],
    };

    delete result[`${target} 1/3`][mmapLatency];
    delete result[`${target} 1/3`][protectionFault];
    delete result[`${target} 1/3`][pageFault];
    delete result[`${target} 1/3`][fdSelect];

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

    console.log(result);

    return result;
  }

  isIgnored(title) {
    const ignoredList = ['*Remote* Communication', 'Basic double operations', 'Basic float operations', 'Basic uint64 operations', 'Basic integer operations', 'Basic system parameters'];
    return ignoredList.indexOf(title) >= 0;
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
