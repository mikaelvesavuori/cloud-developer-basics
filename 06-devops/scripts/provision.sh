#################
#   CODE/REPO   #
#################

# Create new repo in Cloud Source Repositories
gcloud source repos create $REPO_NAME

# Create a build trigger, working on master branch
gcloud beta builds triggers create cloud-source-repositories \
  --repo $REPO_NAME \
  --branch-pattern "master" \
  --build-config "cloudbuild.yaml"

# Clone a demo webserver app, clean files, reset git, add new origin, create an intended test/function error, then push all code to your new repo
git clone https://github.com/mikaelvesavuori/node-simple-webserver.git
cd node-simple-webserver
rm -rf .git
rm -rf serverless
rm build-aws.sh
rm build-gcp.sh
rm buildspec.yml
sed -i -e 's/8080/80/g' Dockerfile
cd src
sed -i -e 's/8080/80/g' index.js

# The below is only for following along with the workshop; creates a failing test
# cd functions
# sed -i -e 's/return a + b/return a + b + 1/g' calc.js
# cd ..

cd ..
git init
git config user.email "${GIT_EMAIL}"
git config user.name "${GIT_EMAIL}"
git remote add origin \
  https://source.developers.google.com/p/$PROJECT_ID/r/$REPO_NAME
git add .
git commit -m "Initial commit"
git push origin master

#################
#   NETWORKING  #
#################

# Create network
gcloud compute networks create $NETWORK_NAME \
  --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create $SUBNET_NAME \
  --network $NETWORK_NAME \
  --region $REGION \
  --range 192.168.0.0/24

# Create firewall rule opening port 80 over TCP
gcloud compute firewall-rules create $FIREWALL_RULE_NAME \
  --network $NETWORK_NAME \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
	--priority 100 \
  --target-tags $FIREWALL_RULE_NAME

#################
#    COMPUTE    #
#################

# Create instance template
gcloud compute instance-templates create-with-container $INSTANCE_TEMPLATE_NAME \
  --container-image $CONTAINER_PATH \
  --machine-type f1-micro \
  --tags $FIREWALL_RULE_NAME,http-server \
  --network $NETWORK_NAME \
  --subnet $SUBNET_NAME

# Create health check
gcloud compute health-checks create http $HEALTH_CHECK_NAME \
  --check-interval=10s \
	--unhealthy-threshold=3 \
  --port=80 \
  --timeout=5s

# Create Managed Instance Group
gcloud compute instance-groups managed create $INSTANCE_GROUP_NAME \
  --description "Managed Instance Group with webservers" \
  --template $INSTANCE_TEMPLATE_NAME \
  --region $REGION \
  --size $INSTANCE_COUNT_MIN \
  --health-check $HEALTH_CHECK_NAME \
  --initial-delay=180

#################################################################
# NEED TO WAIT FOR INSTANCE GROUP TO BE READY BEFORE CONTINUING #
#################################################################

# Configure auto-scaling (may require a bit of waiting after doing the previous action)
gcloud compute instance-groups managed set-autoscaling $INSTANCE_GROUP_NAME \
  --min-num-replicas $INSTANCE_COUNT_MIN \
  --max-num-replicas $INSTANCE_COUNT_MAX \
  --scale-based-on-load-balancing \
  --region $REGION

# Set named port for traffic
gcloud compute instance-groups managed set-named-ports $INSTANCE_GROUP_NAME \
  --named-ports http:80 \
  --region $REGION

#################
#      CDN      #
#################

# Reserve an IPv4 address
gcloud compute addresses create $LOAD_BALANCER_IP_RESOURCE \
  --ip-version=IPV4 \
  --global

gcloud compute addresses describe $LOAD_BALANCER_IP_RESOURCE --format="get(address)" --global
export LOAD_BALANCER_IP=000000 # USE VALUE FROM ABOVE! ex. 34.107.242.10

# Create backend service
gcloud compute backend-services create $BACKEND_SERVICE_NAME \
  --description "Load balancing and CDN backend service" \
  --health-checks $HEALTH_CHECK_NAME \
  --global \
  --global-health-checks \
  --enable-cdn

# Create URL map for proxy, needed by load balancer
gcloud compute url-maps create $URL_MAP_NAME \
  --default-service $BACKEND_SERVICE_NAME

# Create HTTP proxy for load balancer
gcloud compute target-http-proxies create $PROXY_NAME \
  --description "HTTP proxy required by the load balancer" \
  --url-map $URL_MAP_NAME \
  --global

# Create forwarding rules (aka. frontend service)
gcloud compute forwarding-rules create $FRONTEND_SERVICE_NAME \
  --description "Frontend service for load balancer" \
  --address $LOAD_BALANCER_IP \
  --global \
  --target-http-proxy=$PROXY_NAME \
  --ports 80

# Attach backend service
gcloud compute backend-services add-backend $BACKEND_SERVICE_NAME \
  --description "Load balancing and CDN for our Managed Instance Group" \
  --instance-group $INSTANCE_GROUP_NAME \
  --instance-group-region $REGION \
  --global