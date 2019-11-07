# Create instance template
gcloud compute instance-templates create-with-container webserver-container-instance-template \
     --container-image gcr.io/mikaelvesavuori/simple-node-webserver

gcloud compute instance-templates create webserver-instance-template \
    --machine-type f1-micro \
    --image-family debian-9 \
    --image-project debian-cloud \
    --boot-disk-size 10GB

# Create instance from template
gcloud compute instances create webserver-instance --source-instance-template webserver-instance-template