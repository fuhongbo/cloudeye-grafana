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
sudo cp -r cloudeye-grafana  ${GRAFANA_HOME}\public\app\plugins\datasource
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
