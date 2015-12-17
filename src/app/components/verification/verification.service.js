export class VerificationService {
  constructor ($log, $resource, $q, $http) {
    'ngInject';

    this.$log = $log;
    this.$resource = $resource;
    this.$http = $http;
    this.$q = $q;
    this.apiHost = '';
    this.cache = {};

    this.apiRemoteHost = 'http://127.0.0.1:9001';
  }

  makeQuery(category) {
    return `/data/details/${category}.json`;
  }

  getDetail(id, category) {
    const query = `${this.apiRemoteHost}/logs/${id}/${category}.json`;

    if (query in this.cache) {
      return this.$q((resolve) => {
        resolve(this.cache[query]);
      });
    }

    console.log('load: ' + category);
    return this.$resource(this.apiHost + query).get((response) => {
      this.cache[query] = response;
      return response;
    }).$promise;
  }

  upload(logArchive, oldVersion, newVersion) {
    const query = `${this.apiRemoteHost}/logs/${logArchive.jobName}/${logArchive.buildNumber}/upload`;
    const formData = new FormData();

    formData.append('archive', logArchive.file);
    formData.append('oldVersion', oldVersion);
    formData.append('newVersion', newVersion);

    return this.$http({
      method: 'POST',
      url: query,
      data: formData,
      transformRequest: null,
      headers: {'Content-type': undefined}
    });
  }

  getSummary() {
    const query = `${this.apiRemoteHost}/logs/summary.json`;
    return this.$resource(query).query((response) => {
      return response;
    }).$promise;
  }
}
