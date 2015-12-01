export class VerificationService {
  constructor ($log, $resource, $q) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.apiHost = '';
    this.cache = {};
  }

  makeQuery(category) {
    return `/data/details/${category}.json`;
  }

  getDetail(category) {
    const query = this.makeQuery(category);

    if (query in this.cache) {
      return this.$q((resolve) => {
        resolve(this.cache[query]);
      });
    }

    return this.$resource(this.apiHost + query).get((response) => {
      this.cache[query] = response;
      return response;
    });
  }
}
