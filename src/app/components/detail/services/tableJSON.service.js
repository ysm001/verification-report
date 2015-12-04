export class TableJSONService {
  constructor ($log, $resource, $q, verification, type) {
    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.verification = verification;
    this.type = type;
    this.threthold = 10;
  }

  getJSON() {
    return this.verification.getDetail(this.type);
  }

  getTableJSONs() {
    return this.getJSON().then((response) => {
      const rawJsons = this.formatJSONs(response.toJSON());

      return Object.keys(rawJsons).map((key) => {
        return {
          title: key,
          headers: this.makeHeaders(rawJsons[key]),
          records: this.makeRecords(rawJsons[key])
        }
      });
    });
  }

  formatJSONs(jsons) {
    return jsons;
  }

  makeHeaders(rawJson) {
    return [];
  }

  makeRecords(rawJson) {
    return [];
  }

  getRatioClass(ratio) {
    if (ratio < -this.threthold) {
      return 'detail-table-col-bad';
    } else if (ratio > this.threthold) {
      return 'detail-table-col-good';
    }

    return '';
  }
}
