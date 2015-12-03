export class TableJSONService {
  constructor ($log, $resource, $q, verification, type) {
    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.verification = verification;
    this.type = type
  }

  getJSON() {
    return this.verification.getDetail(this.type);
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
    return [];
  }

  makeRecords(rawJson) {
    return [];
  }
}
