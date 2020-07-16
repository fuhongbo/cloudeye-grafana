'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericDatasource = exports.GenericDatasource = function () {
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    this.jsonData = instanceSettings.jsonData;
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = { 'Content-Type': 'application/json' };
    this.default_headers = {
      'Content-Type': 'application/json'
    };
    this.cesEndpoint = "";

    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  _createClass(GenericDatasource, [{
    key: 'query',
    value: function query(options) {
      var query = this.buildQueryParameters(options);
      query.targets = query.targets.filter(function (t) {
        return !t.hide;
      });

      if (query.targets.length <= 0) {
        return this.q.when({ data: [] });
      }
      /////////////////////////////////////////////////////////////////////////////////////////////////////
      var target = options.targets[0];

      var from = Date.parse(options.range.from);
      // var to = Date.parse(options.range.to);
      var _this = this;
      var getMetrics = [];
      var dps = [];
      return _this.doRequest({
        // extra_url: "/metric-data?namespace=SYS.OBS" + "&metric_name=" + "first_byte_latency" + "&dim.0=bucket_name,spinnaker03" + "&from=1571563919000&to=1571650319000&period=1&filter=average",
        extra_url: "/metric-data?namespace=" + target.project + "&metric_name=" + target.metric + "&dim.0=" + target.target + "&from=" + from + "&to=" + options.startTime + "&period=1&filter=average",
        method: 'GET'
      }).then(function (result) {
        _.each(result.data["datapoints"], function (dp) {
          var dataPoint = [];
          dataPoint.push(dp["average"]);
          dataPoint.push(dp["timestamp"]);
          dps.push(dataPoint)
        });
        getMetrics.push({
          "target": target.target,
          "datapoints": dps
        });
        return { data: getMetrics };
      }).catch(function (error) {
        console.log(error);
        getMetrics.push(JSON.stringify(error));
        return _this.mapToTextValue({ data: getMetrics });
      });
    }
  }, {
    key: 'testDatasource',
    value: function testDatasource() {
      //return {status: "success", message: "Data source is working", title: "Success"};
      var _this = this;
      return _this.doRequest({
        extra_url: "/metrics",
        method: 'GET'
      }).then(function (result) {
        if (result.status === 200) {
          return { status: "success", message: "Data source is working", title: "Success" };
        } else {
          return {
            status: "error", message: "Init data source is" +
              " failed, statue=" + JSON.stringify(result)
          };
        }
      }).catch(function (error) {
        return { status: "error", message: "Init data source is failed", err: error };
      });
    }
  }, {
    key: 'annotationQuery',
    value: function annotationQuery(options) {
    }
  }, {
    key: 'metricFindQuery',
    value: function metricFindQuery(query, project, metric) {
      var interpolated = {
        target: this.templateSrv.replace(query, null, 'regex')
      };

      var _this = this;
      var getMetrics = [];

      return _this.doRequest({
        extra_url: '/metrics?namespace=' + project + '&order=asc&metric_name=' + metric,
        method: 'GET'
      }).then(function (result) {
        _.each(result.data["metrics"], function (m) {
          _.each(m["dimensions"], function (dim) {
            getMetrics.push(dim["name"] + ',' + dim["value"]);
          });
        });

        return _this.mapToTextValue({ data: getMetrics });
      }).catch(function (error) {
        getMetrics.push(JSON.stringify(error));
        return _this.mapToTextValue({ data: getMetrics });
      });
    }
  }, {
    key: "getProject",
    value: function getProject() {
      var _this = this;
      var getMetrics = [];

      return _this.doRequest({
        extra_url: '/metrics',
        method: 'GET'
      }).then(function (result) {
        _.each(result.data["metrics"], function (m) {
          if (getMetrics.includes(m["namespace"]) === false) {
            getMetrics.push(m["namespace"]);
          }
        });

        return _this.mapToTextValue({ data: getMetrics });
      }).catch(function (error) {
        console.log(JSON.stringify(error));
      });
    }
  }, {
    key: "getMetrics",
    value: function getMetrics(project) {
      var _this = this;
      var getMetrics = [];
      return _this.doRequest({
        extra_url: '/metrics?namespace=' + project,
        method: 'GET'
      }).then(function (result) {
        _.each(result.data["metrics"], function (m) {
          if (getMetrics.includes(m["metric_name"]) === false) {
            getMetrics.push(m["metric_name"]);
          }
        });

        return _this.mapToTextValue({ data: getMetrics });

      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'mapToTextValue',
    value: function mapToTextValue(result) {
      return _lodash2.default.map(result.data, function (d, i) {
        if (d && d.text && d.value) {
          return { text: d.text, value: d.value };
        } else if (_lodash2.default.isObject(d)) {
          return { text: d, value: i };
        }
        return { text: d, value: d };
      });
    }
  }, {
    key: 'doRequest',
    value: function doRequest(options) {
      var _this = this;
      options.withCredentials = this.withCredentials;
      var getAuth = {
        "auth": {
          "identity": {
            "methods": ["password"],
            "password": {
              "user": {
                "name": this.jsonData.username,
                "password": this.jsonData.password,
                "domain": { "name": this.jsonData.domain }
              }
            }
          },
          "scope": {
            "project": {
              "domain": { "name": this.jsonData.domain },
              "name": this.jsonData.project
            }
          }
        }
      };
      var x = 0;
      if (_this.cesEndpoint === null || _this.cesEndpoint === '') {

        return _this.backendSrv.datasourceRequest({
          url: _this.url + '/v3/auth/tokens',
          method: 'POST',
          data: getAuth
        }).then(function (result) {

          if (result.status === 201) {
            x = 2;
            try {

              _this.headers['X-Auth-Token'] = result.headers.get('X-Subject-Token');
              _this.headers['Content-Type'] = 'application/json';
              x = 3;
              _.each(result.data['token']['catalog'], function (service) {
                if (service['type'] === 'cesv1') {
                  _.each(service['endpoints'], function (endpoint) {
                    if (endpoint['interface'] === 'public') {
                      _this.cesEndpoint = _this.url + endpoint['url'].split(".com")[1];
                    }
                  });
                }
              });
              x = 4;
              options.headers = _this.headers;
              options.url = _this.cesEndpoint + options.extra_url;
              x = 5;
              return _this.backendSrv.datasourceRequest(options);
            }
            catch (err) {
              return { data: err, x: x, result: result, code: '401' };
            }
          }
        }).catch(function (error) {

          return { data: error, x: x, result: options, code: '40s0' };

        })
      } else {
        options.url = _this.cesEndpoint + options.extra_url;
        options.headers = _this.headers;

      }

      return this.backendSrv.datasourceRequest(options);
    }
  }, {
    key: 'buildQueryParameters',
    value: function buildQueryParameters(options) {
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
  }, {
    key: 'getTagKeys',
    value: function getTagKeys(options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.doRequest({
          url: _this2.url + '/tag-keys',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }, {
    key: 'getTagValues',
    value: function getTagValues(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.doRequest({
          url: _this3.url + '/tag-values',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }]);

  return GenericDatasource;
}();
//# sourceMappingURL=datasource.js.map
