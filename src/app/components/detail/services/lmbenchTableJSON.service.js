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

    return [['', 'old ave [μs]'].concat(old_indexes).concat(['new ave [μs]']).concat(new_indexes).concat('ratio [%]').map((t) => { return {text: t} } )];
  }

  makeRecords(rawJson) {
    const round = (val, digit) => {
      const powedDigit = Math.pow(10, digit);
      return Math.round( val * powedDigit ) / powedDigit
    };

    return Object.keys(rawJson).map((k) => { 
      const digit = 3;
      const cols = rawJson[k];
      const old_cols = cols.values.map((col) => {return {text: round(col.old, digit)}})
      const new_cols = cols.values.map((col) => {return {text: round(col.new, digit)}})
      const average_cols = [{text: round(cols.averages.new, digit)}];
      const ratio_cols = [{text: round(cols.ratio, digit), class: this.getRatioClass(cols.ratio)}];

      const all_cols = [{text: k}, {text: round(cols.averages.old, digit)}]
      .concat(old_cols)
      .concat(average_cols)
      .concat(new_cols)
      .concat(ratio_cols);

      return { cols:  all_cols };
    });
  }
}
