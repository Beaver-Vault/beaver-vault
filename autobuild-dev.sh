# Run this in the root directory of the project. Ensure /frontend and /backend are present.
# DO NOT RUN THIS IN PRODUCTION -- For LOCAL TESTING ONLY
git pull origin
cd frontend
docker build --build-arg REACT_APP_API_URL='http://localhost:8000' REACT_APP_DELETE_REDIRECT='http://localhost:3000' -t frontend_local .
cd ..
cd backend
docker build -t backend_local .
cd ..
docker compose -f docker-compose-dev.yml up -d