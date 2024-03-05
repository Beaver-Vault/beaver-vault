<h1><p align="center"> Beaver Vault </p></h1>

<p align="center">
  <img src="frontend/src/imgs/beaver_logo.png" width="150">
</p>

This project aims to provide a secure way to store passwords, notes, and credit card information for anyone needing to bolster their online security.

### Local Testing

1. Clone this repository.

2. If you're on Windows, ensure that the Docker Desktop client is installed:
https://docs.docker.com/desktop/install/windows-install/

3. Run `docker compose` in a terminal to verify Docker is installed correctly. If in Windows, Docker Desktop must be open.

4. Navigate to the root of the directory in VS Code Terminal, Git Bash, WSL, or Powershell (`/frontend` and `/backend` must be subdirectories). In the terminal, run `./autobuild-dev.sh`. This script will:
    1. Pull changes from the currently checked out branch.

    2. Navigate to `/frontend` and build a local Docker image: `frontend_local`.

    3. Navigate to root directory, down to `/backend`, and build a local Docker image: `backend_local`.

    4. Navigate to root directory and start the `dev` docker compose configuration.

    5. The `prod` docker compose configuration is only edited for server-side configurations. This does not need to be edited.

5. Navigate to `http://localhost:3000`.

6. Create a new account. You will be prompted to scan the MFA QR code and verify MFA works before account access is granted.


### Production Usage

The frontend is already configured to serve static JavaScript at runtime, and the Watchtower container is configured to automatically pull new images from Docker Hub every 30 seconds.

If Watchtower is not pulling the image updates automatically, a production-only helper script is provided to manually pull the container updates and bring the containers up:

  - Navigate to root directory of project on the production server.
  - Ensure the script is executable: `sudo chmod +x pullup-prod.sh`
  - Run `./pullup-prod.sh`

    - This will pull any image updates and run the containers listed in the `docker-compose-prod.yml` Compose file.

  - You can verify Watchtower is updating containers by inspecting the docker logs: `docker logs watchtower`. Take into account Watchtower's polling period when troubleshooting.