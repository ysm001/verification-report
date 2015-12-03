export class FioTableJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.verification = verification;
  }

  getJSON() {
    return this.verification.getDetail('io');
  }

  getTableJSONs() {
    return this.getJSON().then((response) => {
      const rawJsons = response.toJSON();

      return Object.keys(rawJsons).map((key) => {
        return {
          title: key,
          headers: this.makeHeaders(rawJsons[key]),
          records: this.makeRecords(rawJsons[key])
        }
      });
    });
  }

  makeHeaders(rawJson) {
    const sample = rawJson[0].throughputs;
    const colspan = sample.length;

    const firstHeaders = rawJson.map((t) => { return {text: `${t.thread_num} Thread`, colspan: colspan} } );
    const secondHaders = rawJson.map((j) => {
      return j.throughputs.map((t) => {
        return {text: `${t.block_size} KB`}
      } )
    } );
    const empty = [''];

    return [
      empty.concat(firstHeaders),
      empty.concat(Array.prototype.concat.apply([], secondHaders))
    ];
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
    const mb = isRatioRow ? 1 : 1024;
    const digit = isRatioRow ? 3 : 1;
    const postFix = isRatioRow ? '[%]' : '[MB/s]';
    const threshold = 10;

    const row = rawJson.map((j) => {
      return j.throughputs.map((t) => {
        return {text: round(t[key] / mb, digit), bad: isRatioRow && t[key] < -threshold, good: isRatioRow && t[key] > threshold}
      })
    });

    return {cols: [{text: `${key} ${postFix}`}].concat(Array.prototype.concat.apply([], row))};
  }
}
