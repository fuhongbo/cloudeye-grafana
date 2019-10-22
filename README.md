## Cloudeye Datasource

More documentation about datasource plugins can be found in the [Docs](https://github.com/grafana/grafana/blob/master/docs/sources/plugins/developing/datasources.md).

## Installation

Copy cloudeye-grafana to datasource folder of grafana to install this plugin:
```
sudo git clone https://github.com/huaweicloud/cloudeye-grafana
sudo cp -r cloudeye-grafana  ${GRAFANA_HOME}\public\app\plugins\datasource
sudo service grafana-server restart
```
Login (http://local_ip:3000) to check whether the cloudeye-grafana install success .

### Config

Added "URL", "Domain", "Project", "User", "Password" in the following image.
![image](https://github.com/huaweicloud/cloudeye-grafana/blob/master/config.png)


### How to use it
Choose one value of the "Project", "Metric" and "Dimention" to see the metric data.

![image](https://github.com/huaweicloud/cloudeye-grafana/blob/master/dashboard.png)
