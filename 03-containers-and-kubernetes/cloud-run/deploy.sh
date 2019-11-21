gcloud beta run deploy $APP_NAME \
	--image gcr.io/$PROJECT_ID/$APP_NAME:latest \
	--platform managed \
	--region $REGION \
	--allow-unauthenticated