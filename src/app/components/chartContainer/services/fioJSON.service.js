import { ChartJSONService } from './chartJSON.service';

export class FioJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'io');
  }

  getFushionFormatJSONResult(type, chart, categories, data) {
    return {
      type: type,
      chart: chart,
      categories: categories,
      dataset: data,
      trendlines: this.makeBorders()
    };
  }

  getType() {
    return 'mscombidy2d'
  }

  getStyle(operation, rawJson) {
    return {
      caption: operation,
      formatNumberScale: 0,
      xAxisName: 'Block Size (KB)',
      pyAxisName: 'Throughput (MB/s)',
      syAxisName: 'Performance Ratio (%)',
      numDivLines: 10,
      syAxisMinValue: Math.min(50, this.getMinValue(operation, rawJson)),
      syAxisMaxValue: Math.max(150, this.getMaxValue(operation, rawJson))
    };
  }

  getValues(rawJson) {
    const values = rawJson.map((val) => {return Object.keys(val.throughputs).map((k) => {return 100 + val.throughputs[k].ratio})});
    return Array.prototype.concat.apply([], values);
  }

  getMinValue(operation, rawJson) {
    return Math.min.apply(null, this.getValues(rawJson));
  }

  getMaxValue(operation, rawJson) {
    return Math.max.apply(null, this.getValues(rawJson));
  }

  formatJSON(operation, rawJson) {
    const nested_throughputs = rawJson.map(function(val) {return val.throughputs});
    return Array.prototype.concat.apply([], nested_throughputs);
  }

  makeDataset(operation, throughputs) {
    return [this.makeSeries(throughputs, 'old'), this.makeSeries(throughputs, 'new'), this.makeSeries(throughputs, 'ratio')]
  }

  makeCategories(operation, throughputs) {
    return [{
      category: throughputs.map(function(t) {return {label: t.block_size.toString()}})
    }]
  }

  makeSeries(throughputs, key) {
    const isRatio = key == 'ratio';

    return  {
      seriesname: key,
      renderas: isRatio ? 'line' : 'mscolumn2d',
      parentyaxis: isRatio ? 's' : 'p',
      data: isRatio ? throughputs.map(function(t) {return {value: 100 + t[key]}}) : throughputs.map(function(t) {return {value: t[key]}})
    }
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
          parentyaxis: 's',
          displayvalue: String(line.value),
          valueOnRight: 1,
          thickness: 1,
        }]
      };
    });
  }

}
