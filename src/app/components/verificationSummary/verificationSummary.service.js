export class VerificationSummaryService {
  constructor ($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = '';
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
