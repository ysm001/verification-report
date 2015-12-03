export class ChartJSONService {
  constructor ($log, $resource, $q, verification, type) {
    this.$log = $log;
    this.$resource = $resource;
    this.$q = $q;
    this.verification = verification;
    this.type = type;
  }

  getJSON(type) {
    return this.verification.getDetail(this.type);
  }

  getStyleTemplate() {
    return this.$resource('/data/templates/style.json').get()
  }

  getStyle(operation) {
    return {};
  }

  getType(operation) {
    return 'mscolumn2d';
  }

  getFushionFormatJSONs() {
    const self = this;

    const stylePromise = this.getStyleTemplate().$promise;
    const rawJsonPromise = self.getJSON(this.type).$promise;

    return this.$q.all([stylePromise, rawJsonPromise]).then((values) => {
      const groups = this.formatJSONs(values[1].toJSON());

      return Object.keys(groups).map((key) => {
        return self.getFushionFormatJSON(key, groups[key].values, values[0].toJSON());
      }).filter((e) => {return e != undefined && e != null});
    })
  }

  getFushionFormatJSON(operation, rawJson, styleTemplate) {
    const style = this.applyStyle(styleTemplate, this.getStyle(operation, rawJson));
    const formattedJSON = this.formatJSON(operation, rawJson);

    const dataSet = this.makeDataset(operation, formattedJSON);
    const categories = this.makeCategories(operation, formattedJSON);

    if (dataSet == null) {
      return null;
    }

    return this.getFushionFormatJSONResult(this.getType(operation), style, categories, dataSet);
  }

  getFushionFormatJSONResult(type, chart, categories, dataSet) {
    return {
      type: type,
      chart: chart,
      categories: categories,
      dataset: dataSet
    };
  }

  applyStyle(styleTemplate, style) {
    return Object.assign(styleTemplate, style);
  }

  formatJSONs(rawJsons) {
    return Object.keys(rawJsons).reduce((result, key) => {
      result[key] = this.makeGroup(key, rawJsons[key]);
      return result;
    }, {});
  }

  formatJSON(operation, rawJson) {
    return rawJson;
  }

  makeDataset(operation, formattedJSON) {
    return [];
  }

  makeCategories(operation, formattedJSON) {
    return [];
  }

  makeGroup(group, values) {
    return {group: group, values: values};
  }

  makeBorders() {
    const lines = [
    {value: 80, color: "#ff4081"},
    {value: 90, color: "#ff4081"},
    {value: 100, color: "#34343e"},
    {value: 110, color: "#09a274"},
    {value: 120, color: "#09a274"},
    ];

    return lines.map((line) => {
      return {
        line: [{
          startvalue: line.value,
          color: line.color,
          parentyaxis: 's',
          showValues: '0',
          displayvalue: String(line.value),
          valueOnRight: 1,
          thickness: 1,
        }]
      };
    });
  }
}
