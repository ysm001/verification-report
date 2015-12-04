import { TableJSONService } from './tableJSON.service';

export class KernbenchTableJSONService extends TableJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'memory');
  }

  makeHeaders(rawJson) {
    const sample = rawJson[0];
    const header = rawJson.map((t) => { return {text: `${t.thread_num} Thread`} } );
    return [[''].concat(header)];
  }

  makeRecords(rawJson) {
    return [this.makeRow(rawJson, 'old'), this.makeRow(rawJson, 'new'), this.makeRow(rawJson, 'ratio')];
  }

  makeRow(rawJson, key) {
    const round = (val, digit) => {
      const powedDigit = Math.pow(10, digit);
      return Math.round( val * powedDigit ) / powedDigit
    };

    const isRatioRow = key == 'ratio';
    const digit = isRatioRow ? 3 : 1;
    const postFix = isRatioRow ? '[%]' : '[s]';
    const threshold = 10;

    const row = rawJson.map((t) => {
      const cls = isRatioRow ? this.getRatioClass(t[key]) : '';
      return {text: round(t[key], digit), class: cls}
    });

    return {cols: [{text: `${key} ${postFix}`}].concat(Array.prototype.concat.apply([], row))};
  }
}
