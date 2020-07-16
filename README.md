## Cloudeye Datasource

[Cloud Eye](https://www.huaweicloud.com/en-us/product/ces.html) is a multi-dimensional resource monitoring platform. You can use Cloud Eye to monitor the utilization of service resources, track the running status of cloud services, configure alarm rules and notifications, and quickly respond to resource changes.

Use this datasource if you want to use Cloudeye to query your [Cloud Service Resources metrics](https://support.huaweicloud.com/en-us/api-ces/en-us_topic_0171212568.html).

### Install Grafana Instructions on the Grafana Docs Site

- [Installing on Debian/Ubuntu](http://docs.grafana.org/installation/debian/)
- [Installing on RPM-based Linux (CentOS, Fedora, OpenSuse, RedHat)](http://docs.grafana.org/installation/rpm/)
- [Installing on Windows](http://docs.grafana.org/installation/windows/)
- [Installing on Mac](http://docs.grafana.org/installation/mac/)

## Installation cloudeye-grafana

Installation cloudeye-grafana:
Copy cloudeye-grafana to datasource folder of grafana to install this plugin.
```
sudo git clone https://github.com/huaweicloud/cloudeye-grafana
sudo cp -r cloudeye-grafana  /var/lib/grafana/plugins/
sudo service grafana-server restart
```
Login (http://local_ip:3000) to check whether the cloudeye-grafana install success .

### Config

To create your own datasorce, added "URL", "Domain", "Project", "User", "Password" in the following image.

The "URL" value can be get from [Identity and Access Management (IAM) endpoint list](https://developer.huaweicloud.com/en-us/endpoint).
![image](https://github.com/huaweicloud/cloudeye-grafana/blob/master/config.png)


### How to use it
Choose one value of the "Project", "Metric" and "Dimention" to see the metric data.

![image](https://github.com/huaweicloud/cloudeye-grafana/blob/master/dashboard.png)

### Fixed

1. 修复与 grafana 7.06 集成问题，增加了Reverse Proxy,用户反向代理到华为Cloud Eye API(当前填写服务器地址如果为IAM地址，那么后继查询会报错，如果写CES地址，会导致取Token报错，增加反向代理处理不同的API请求)  
2. 修复了请求metric报错问题，未修复前取 X-Subject-Token 报错
3. 修复了界面上无法显示Dimention 问题