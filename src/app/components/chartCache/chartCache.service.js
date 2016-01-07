export class ChartCacheService {
  constructor ($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = '';
  }

  set(dataSource, chart) {
    const key = this.generateKey(dataSource);
    window.localStorage.setItem(key, chart);
  }

  get(dataSource) {
    const key = this.generateKey(dataSource);
    return window.localStorage.getItem(key);
  }

  generateKey(dataSource) {
    return JSON.stringify(dataSource);
  }
}
