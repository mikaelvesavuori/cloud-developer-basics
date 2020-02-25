#################
#   VARIABLES   #
#################

# YOU PROBABLY WANT TO EDIT THESE, BUT IS NOT REQUIRED
export IMAGE_NAME="webserver"
export REGION="europe-north1"
export ZONE="europe-north1-b"
export REPO_NAME="webserver"
export GIT_NAME="Demo User"

# ONLY EDIT IF YOU HAVE OPINIONS
export PROJECT_ID=$(gcloud config get-value project)
export GIT_EMAIL=$(gcloud auth list --filter=status:ACTIVE --format='value(account)')
export CONTAINER_TAG="latest"
export CONTAINER_PATH="gcr.io/$PROJECT_ID/$IMAGE_NAME:$CONTAINER_TAG" # Must match image output in cloudbuild.yaml
export NETWORK_NAME="mynetwork"
export SUBNET_NAME="mynetwork-subnet"
export FIREWALL_RULE_NAME="allow-inbound-tcp-80"
export INSTANCE_GROUP_NAME="webserver-instance-group"
export INSTANCE_TEMPLATE_NAME="webserver-container-instance-template"
export INSTANCE_COUNT_MIN=3
export INSTANCE_COUNT_MAX=5
export HEALTH_CHECK_NAME="instance-health-check"
export BACKEND_SERVICE_NAME="mybackendservice"
export FRONTEND_SERVICE_NAME="myfrontendservice"
export LOAD_BALANCER_IP_RESOURCE="loadbalancer-ip"
export URL_MAP_NAME="loadbalancer"
export PROXY_NAME="lb-target-proxy"

gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE