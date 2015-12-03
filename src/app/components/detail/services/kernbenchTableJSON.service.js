import { TableJSONService } from './tableJSON.service';

export class KernbenchTableJSONService extends TableJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'memory');
  }

  makeHeaders(rawJson) {
    const sample = rawJson[0];
    return [Object.keys(sample).map((t) => { return {text: t} } )];
  }

  makeRecords(rawJson) {
    return rawJson.map((r) => { return { cols: Object.keys(r).map((key) => {return {text: r[key]}}) } } );
  }
}
