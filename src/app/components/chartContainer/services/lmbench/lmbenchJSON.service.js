import { ChartJSONService } from '../chartJSON.service';

export class LmbenchJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'task');
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
