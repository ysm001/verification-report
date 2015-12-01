import { NetperfJSONService } from './netperfJSON.service.js';

export class NetperfEachJSONService extends NetperfJSONService {
  getTarget() {
    return 'each';
  }

  formatJSONs(rawJsons) {
    const targetName = this.getTarget();

    return Object.keys(rawJsons)
      .filter((sender_receiver) => {return rawJsons[sender_receiver] != null && rawJsons[sender_receiver][targetName] != null})
      .reduce((formattedJSON, sender_receiver) => {
        const target = rawJsons[sender_receiver][targetName];
        Object.keys(target).forEach((version) => {
          Object.keys(target[version])
            .filter((item) => {return target[version][item] != null;})
            .forEach((item) => {
              formattedJSON[`${item} [${sender_receiver} ${version}]`] = target[version][item];
            });
        });

        return formattedJSON;
      }, {});
  }

  makeDataset(operation, rawJson) {
    const coreNum = 16;
    const categories = Array.from(Array(coreNum).keys()).map((i) => {return `cpu${i}`});
    return categories.map((c) => {return {dataset: this.makeSeries(rawJson, c)};});
  }
}
