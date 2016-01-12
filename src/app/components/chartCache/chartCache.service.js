export class ChartCacheService {
  constructor ($log, $http, $resource) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.$resource = $resource;
    this.apiRemoteHost = 'http://localhost:4000';
  }

  set(id, svg, source) {
    this.saveToServer(id, svg, source).success((result) => {
      console.log(result);
    }).error((err) => {
      console.log(err);
    });
  }

  saveToServer(id, svg, source) {
    const query = `${this.apiRemoteHost}/svgs/cache`;
    const data = {
      id: id,
      svg: svg,
      source: JSON.stringify(source)
    };

    return this.$http({
      method: 'POST',
      url: query,
      data: data
    });
  }

  fetchFromServer(id, source) {
    const query = `${this.apiRemoteHost}/svgs/cache`;
    const data = {
      id: id
    };

    return this.$resource(query).get(data).$promise.then((response) => {
      const isValidCache = response.svg != null && response.source == JSON.stringify(source);
      return isValidCache ? response.svg : null;
    });
  }

  get(id, source) {
    return this.fetchFromServer(id, source);
  }

  generateKey(dataSource) {
    return JSON.stringify(dataSource);
  }
}
