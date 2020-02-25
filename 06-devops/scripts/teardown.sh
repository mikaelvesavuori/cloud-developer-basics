#################
#    DELETE     #
#################

gcloud compute forwarding-rules delete $FRONTEND_SERVICE_NAME --global -q
gcloud compute target-http-proxies delete $PROXY_NAME -q
gcloud compute url-maps delete $URL_MAP_NAME -q
gcloud compute backend-services delete $BACKEND_SERVICE_NAME --global -q
gcloud compute instance-groups managed delete $INSTANCE_GROUP_NAME --region $REGION -q
gcloud compute instance-templates delete $INSTANCE_TEMPLATE_NAME -q
gcloud compute health-checks delete $HEALTH_CHECK_NAME -q
gcloud compute firewall-rules delete $FIREWALL_RULE_NAME -q
gcloud compute networks subnets delete $SUBNET_NAME -q
gcloud compute networks delete $NETWORK_NAME -q
gcloud compute addresses delete $LOAD_BALANCER_IP_RESOURCE --global -q
gcloud beta builds triggers delete trigger -q
cd
rm -rf node-simple-webserver