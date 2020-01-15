import _ from "lodash";

export class GenericDatasource {
  default_headers: any;
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.cesEndpoint = "";
    this.token = "";
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = {'Content-Type': 'application/json'};
    this.default_headers = {'Content-Type': 'application/json'};
    this.cesEndpoint = "";
    this.jsonData = instanceSettings.jsonData;
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  query(options) {
  }

  testDatasource() {
    var _this = this;
    return _this.backendSrv.datasourceRequest({
        url: _this.url,
        method: 'GET'
    }).then(function (result) {
        if (result.status === 200) {
            return {status: "success", message: "Data source is working", title: "Success"};
        }
    });
  }

  annotationQuery(options) {
  }

  metricFindQuery(query) {
  }

  getProject() {
  }

  getMetrics(project) {
  }

  mapToTextValue(result) {
    return _.map(result.data, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      } else if (_.isObject(d)) {
        return { text: d, value: i};
      }
      return { text: d, value: d };
    });
  }

  doRequest(options) {
  }

  buildQueryParameters(options) {
      var _this = this;

      //remove placeholder targets
      options.targets = _lodash2.default.filter(options.targets, function (target) {
          return target.target !== 'select metric';
      });

      var targets = _lodash2.default.map(options.targets, function (target) {
          return {
              target: _this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
              project: target.project,
              metric: target.metric,
              refId: target.refId,
              hide: target.hide,
              type: target.type || 'timeserie'
          };
      });

      options.targets = targets;

      return options;
  }

  getTagKeys(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-keys',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }

  getTagValues(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-values',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }

}
