export class LmbenchTableJSONService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
  }

  getJSON() {
    return this.$resource('/data/details/task.json').get();
  }

  getTableJSONs() {
    return this.getJSON().$promise.then((response) => {
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
    const sample = rawJson[Object.keys(rawJson)[0]];
    const indexes = Array.apply(null, {length: sample.length}).map(Number.call, Number)
    const old_indexes = indexes.map((i) => { return `old ${i + 1}` } );
    const new_indexes = indexes.map((i) => { return `new ${i + 1}` } );

    return [['criteria', 'old ave [μs]'].concat(old_indexes).concat(['new ave [μs]']).concat(new_indexes).concat('ratio [%]').map((t) => { return {text: t} } )];

    return [[''].concat(Object.keys(sample).map((t) => { return {text: t} } ))];
  }

  makeRecords(rawJson) {
    const round = (val, digit) => {
      const powedDigit = Math.pow(10, digit);
      return Math.round( val * powedDigit ) / powedDigit
    };

    return Object.keys(rawJson).map((k) => { 
      const cols = rawJson[k];
      const old_average = round(cols.reduce((prev, current) => {return prev + parseFloat(current.old)}, 0) / cols.length, 3);
      const new_average = round(cols.reduce((prev, current) => {return prev + parseFloat(current.new)}, 0) / cols.length, 3);
      const ratio = round((new_average - old_average) * 100 / new_average, 3);
      const old_cols = cols.map((col) => {return {text: round(col.old, 3)}})
      const new_cols = cols.map((col) => {return {text: round(col.new, 3)}})

      return { cols: [{text: k}, {text: old_average}].concat(old_cols).concat([{text: new_average}]).concat(new_cols).concat([{text: ratio}]) }
    });
  }
}
