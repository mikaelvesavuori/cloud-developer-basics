export PROJECT_ID=cloud-developer-basics
export APP_NAME=node-simple-webserver
export CLUSTER_NAME=webserver
export CLUSTER_ZONE=europe-north1-b

# Build your image
docker build -t gcr.io/${PROJECT_ID}/${APP_NAME} .

# Push image to Container Registry
gcloud docker -- push gcr.io/${PROJECT_ID}/${APP_NAME}

# Create cluster
gcloud container clusters create ${CLUSTER_NAME} \
	--num-nodes 3 \
	--machine-type g1-small \
	--zone ${CLUSTER_ZONE}

# Create deployment with your image
kubectl create deployment ${CLUSTER_NAME} --image=gcr.io/${PROJECT_ID}/${APP_NAME}:latest

# Expose a public-facing port of the LoadBalancer type
kubectl expose deployment ${CLUSTER_NAME} --type=LoadBalancer --port 80 --target-port 8080

# Scale your cluster
# kubectl scale deployment ${CLUSTER_NAME} --replicas=4

# Apply a rolling update
# kubectl set image deployment webserver webserver=gcr.io/${PROJECT_ID}/${APP_NAME}:v2
