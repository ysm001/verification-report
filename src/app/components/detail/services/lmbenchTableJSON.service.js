import { TableJSONService } from './tableJSON.service';

export class LmbenchTableJSONService extends TableJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'task');
  }

  makeHeaders(rawJson) {
    const sample = rawJson[Object.keys(rawJson)[0]];
    const indexes = Array.apply(null, {length: sample.values.length}).map(Number.call, Number)
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
      const old_cols = cols.values.map((col) => {return {text: round(col.old, 3)}})
      const new_cols = cols.values.map((col) => {return {text: round(col.new, 3)}})

      return { cols: [{text: k}, {text: round(cols.averages.old, 3)}].concat(old_cols).concat([{text: round(cols.averages.new, 3)}]).concat(new_cols).concat([{text: round(cols.ratio, 3)}]) }
    });
  }
}
