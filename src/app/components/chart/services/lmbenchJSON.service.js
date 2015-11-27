import { ChartJSONService } from './chartJSON.service';

export class LmbenchJSONService extends ChartJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    super($log, $resource, $q, 'task');
  }

  getStyle(operation) {
    return {
      caption: operation,
      xAxisName: '',
      yAxisName: this.getYAxisName(operation)
    };
  }

  formatJSONs(rawJsons) {
    const formatFuncs = {
      'File & VM system': this.formatFileVMSystemData.bind(this),
      'Processor, Processes': this.formatProcessorData.bind(this)
    };

    return Object.keys(rawJsons).reduce((result, key) => {
      if (this.isIgnored(key)) {
        return result;
      }
      
      if (key in formatFuncs) {
        const formattedData = formatFuncs[key](rawJsons, key, key);
        Object.keys(formattedData).forEach((key) => { result[key] = formattedData[key] } );
      } else {
        result[key] = rawJsons[key];
      }

      return result;
    }, {});
  }

  splitData(rawJsons, target, key, groups) {
    const result = {}
    const size = groups.length + 1;

    const firstKey = `${target} 1/${size}`;
    result[firstKey] = rawJsons[target];

    groups.forEach((group, i) => {
      const key = `${target} ${i + 2}/${size}`;
      result[key] = {};
      group.forEach((item) => {
        result[key][item] = rawJsons[target][item];
      });
    });

    Array.prototype.concat.apply([], groups).forEach((item) => {
      delete result[firstKey][item];
    });

    return result
  }

  formatFileVMSystemData(rawJsons, target, key) {
    const groups = [['Mmap Latency'], ['Prot Fault', 'Page Fault', '100fd selct']];
    return this.splitData(rawJsons, target, key, groups);
  }

  formatProcessorData(rawJsons, target, key) {
    const groups = [['fork proc', 'exec proc', 'sh proc']];
    return this.splitData(rawJsons, target, key, groups);
  }

  isIgnored(title) {
    const ignoredList = [
      '*Remote* Communication',
      'Basic double operations',
      'Basic float operations',
      'Basic uint64 operations',
      'Basic integer operations',
      'Basic system parameters'
    ];

    return ignoredList.indexOf(title) >= 0;
  }

  getYAxisName(operation) {
    return operation == 'process' ? 'Processing Time (μs)' : 'Latency (μs)';
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

class LmbenchRatioJSONService {
  constructor ($log, $resource, $q) {
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

    const data = self.makeDataset(operation, rawJson);

    style.caption = operation;
    style.xAxisName = '';
    style.yAxisMinValue = Math.min(80, Math.floor(this.getMinValue(operation, rawJson)));

    return {
      type: 'line',
      chart: style,
      data: data,
      trendlines: this.makeBorder()
    };
  }

  getMinValue(operation, rawJson) {
    const values = this.getKeys(operation, rawJson).map((k) => {return (1 + rawJson[k].ratio) * 100});
    return Math.min.apply(null, values);
  }

  isIgnored(title) {
    const ignoredList = [
      '*Remote* Communication',
      'Basic double operations',
      'Basic float operations',
      'Basic uint64 operations',
      'Basic integer operations',
      'Basic system parameters'
    ];

    return ignoredList.indexOf(title) >= 0;
  }

  formatData(rawJsons) {
    return Object.keys(rawJsons).reduce((result, key) => {
      if (this.isIgnored(key)) {
        return result;
      } else {
        result[key] = rawJsons[key];
      }

      return result;
    }, {});
  }

  getKeys(operation, rawJson) {
    return operation != 'context_switch' ? Object.keys(rawJson) :  ['2p/0K', '2p/16K', '2p/64K', '8p/16K', '8p/64K', '16p/16K', '16p/64K'];
  }

  makeDataset(operation, rawJson) {
    return this.getKeys(operation, rawJson).map((k) => {return {label: k, value: (1 + rawJson[k].ratio) * 100}});
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

  makeBorder() {
    return [{
      line: [
      {
        startvalue: '100',
        color: '#c0c0c0',
        displayvalue: '100%',
        valueOnRight : 1,
        thickness : 2
      }
      ]
    }];
  }
}
