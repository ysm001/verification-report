import { ChartJSONService } from '../chartJSON.service';

export class NetperfJSONService extends ChartJSONService {
  constructor ($log, $resource, $q, verification) {
    'ngInject';

    super($log, $resource, $q, verification, 'network');
  }

  getType(operation) {
    return 'msstackedcolumn2d';
  }

  getStyle(operation) {
    return {
      caption: operation,
      xAxisName: '',
      showValues: 0
    };
  }

  getItems() {
    return [
      '%gnice',
      '%guest',
      '%iowait',
      '%irq',
      '%nice',
      '%soft',
      '%steal',
      '%sys',
      '%usr'
    ];
  }

  formatJSONs(rawJsons) {
    const targetName = this.getTarget();

    return Object.keys(rawJsons)
      .filter((sender_receiver) => {return rawJsons[sender_receiver] != null && rawJsons[sender_receiver][targetName] != null})
      .reduce((formattedJSON, sender_receiver) => {
        const target = rawJsons[sender_receiver][targetName];
        Object.keys(target)
          .filter((item) => {return target[item] != null;})
          .forEach((item) => {
            formattedJSON[`${item} [${sender_receiver}]`] = target[item];
          });

        return formattedJSON;
      }, {});
  }

  getTarget() {
    return 'all';
  }

  makeDataset(operation, rawJson) {
    return [{dataset: this.makeSeries(rawJson, 'old')}, {dataset: this.makeSeries(rawJson, 'new')}];
  }

  makeCategories(operation, rawJson) {
    if (rawJson == null) return;
    const versions = ['old', 'new'];

    return [{
      category: Object.keys(rawJson).map((k) => {return {label: k};})
    }];
  }

  makeSeries(rawJson, key) {
    const items = this.getItems();

    return this.getItems().map((item) => {
      const data = Object.keys(rawJson).map((k) => {
        return (key in rawJson[k]) ? {value: rawJson[k][key][item]} : {value: 0};
      });

      return {
        seriesname: item,
        data: data
      }
    });
  }
}
