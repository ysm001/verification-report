import { LmbenchJSONService } from './lmbenchJSON.service';

export class LmbenchLineJSONService extends LmbenchJSONService {
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
