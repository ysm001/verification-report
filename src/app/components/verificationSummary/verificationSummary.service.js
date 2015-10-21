export class VerificationSummaryService {
  constructor ($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = '';
  }

  getCategories() {
    return this.$http.get(this.apiHost + '/data/categories.json')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getCategories.\n' + angular.toJson(error.data, true));
      });
  }

  getSummaries() {
    return this.$http.get(this.apiHost + '/data/summaries.json')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getSummaries.\n' + angular.toJson(error.data, true));
      });
  }

  getSummaryDetail() {
  }
}
