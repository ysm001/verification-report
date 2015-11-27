import { ChartJSONService } from './chartJSON.service';

class _LmbenchJSONService extends ChartJSONService {
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

  makeDataset(operation, rawJson) {
    return [this.makeSeries(operation, rawJson, 'old'), this.makeSeries(operation, rawJson, 'new')];
  }

  makeCategories(operation, rawJson) {
    return [{
      category: Object.keys(rawJson).map(function(k) {return {label: k }})
    }]
  }

  makeSeries(operation, rawJson, key) {
    return  {
      seriesname: key,
      data: Object.keys(rawJson).map(function(k) {return {value: rawJson[k]['averages'][key]}})
    }
  }
}

export class LmbenchJSONService extends _LmbenchJSONService{
  getFushionFormatJSONResult(type, chart, categories, data) {
    return {
      type: type,
      chart: chart,
      data: data,
      trendlines: this.makeBorder()
    };
  }

  getType(operation) {
    return 'line';
  }

  getStyle(operation, rawJson) {
    return {
      caption: operation,
      xAxisName: '',
      yAxisMinValue: Math.min(80, Math.floor(this.getMinValue(operation, rawJson)))
    };
  }

  getMinValue(operation, rawJson) {
    const values = Object.keys(rawJson).map((k) => {return (1 + rawJson[k].ratio) * 100});
    return Math.min.apply(null, values);
  }

  formatJSONs(rawJsons) {
    return Object.keys(rawJsons).reduce((result, key) => {
      if (this.isIgnored(key)) {
        return result;
      }

      result[key] = rawJsons[key];
      return result;
    }, {});
  }

  makeDataset(operation, rawJson) {
    return Object.keys(rawJson).map((k) => {return {label: k, value: (1 + rawJson[k].ratio) * 100}});
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
