export class KernbenchTableJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.verification = verification;
  }

  getJSON() {
    return this.verification.getDetail('memory');
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
    const sample = rawJson[0];
    return [Object.keys(sample).map((t) => { return {text: t} } )];
  }

  makeRecords(rawJson) {
    return rawJson.map((r) => { return { cols: Object.keys(r).map((key) => {return {text: r[key]}}) } } );
  }
}
