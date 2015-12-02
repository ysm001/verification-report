import { LmbenchJSONService } from './lmbenchJSON.service';

export class LmbenchLineJSONService extends LmbenchJSONService {
  getFushionFormatJSONResult(type, chart, categories, data) {
    return {
      type: type,
      chart: chart,
      data: data,
      trendlines: this.makeBorders()
    };
  }

  getType(operation) {
    return 'line';
  }

  getStyle(operation, rawJson) {
    return {
      caption: operation,
      xAxisName: '',
      yAxisName: 'Performance Ratio (%)',
      numDivLines: 6,
      yAxisMaxValue: Math.max(115, Math.floor(this.getMaxValue(rawJson))),
      yAxisMinValue: Math.min(85, Math.floor(this.getMinValue(rawJson)))
    };
  }

  getValues(rawJson) {
    return Object.keys(rawJson).map((k) => {return (1 + rawJson[k].ratio) * 100});
  }

  getMinValue(rawJson) {
    return Math.min.apply(null, this.getValues(rawJson));
  }

  getMaxValue(rawJson) {
    return Math.max.apply(null, this.getValues(rawJson));
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

  makeBorders() {
    const lines = [
    {value: 80, color: "#ff4081"},
    {value: 90, color: "#ff4081"},
    {value: 100, color: "#34343e"},
    {value: 110, color: "#09a274"},
    {value: 120, color: "#09a274"},
    ];

    return lines.map((line) => {
      return {
        line: [{
          startvalue: line.value,
          color: line.color,
          displayvalue: String(line.value),
          valueOnRight: 1,
          thickness: 2
        }]
      };
    });
  }
}
