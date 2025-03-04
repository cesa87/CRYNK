CRYNK: Full Stack Deployment with GitHub Actions & EKS

Overview

CRYNK is a full-stack application with a React frontend, a Rust backend, and an AWS RDS database, deployed to an Amazon EKS cluster using GitHub Actions for CI/CD.

Structure

/frontend                # React frontend application
│── /src                # Source code
│── package.json        # Dependencies
│── Dockerfile          # Builds frontend container
│── /k8s                # Kubernetes YAMLs for frontend
│   ├── deployment.yaml
│   ├── service.yaml
│── .github/workflows/frontend-ci.yml  # GitHub Actions workflow

/backend                 # Rust backend application
│── /src                # Source code
│── Cargo.toml          # Rust dependencies
│── Dockerfile          # Builds backend container
│── /k8s                # Kubernetes YAMLs for backend
│   ├── deployment.yaml
│   ├── service.yaml
│── .github/workflows/backend-ci.yml  # GitHub Actions workflow

Deployment Pipeline

GitHub Actions Workflow

The repository includes two CI/CD workflows:

Frontend CI/CD (.github/workflows/frontend-ci.yml)

Installs dependencies

Builds the React app

Builds and pushes a Docker image

Deploys to EKS

Backend CI/CD (.github/workflows/backend-ci.yml)

Installs Rust

Builds the backend

Builds and pushes a Docker image

Deploys to EKS

How to Deploy

Prerequisites

AWS EKS Cluster is set up

GitHub Secrets are configured:
AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

DOCKER_USERNAME

DOCKER_PASSWORD

Steps

Clone the repository
git clone https://github.com/cesa87/CRYNK.git
cd CRYNK

Push code to main branch
git add .
git commit -m "New deployment"
git push origin main

Monitor GitHub Actions
Go to Actions tab in GitHub to monitor build and deployment progress.

Kubernetes Deployment
Updating Deployments Manually

If needed, apply Kubernetes YAML files manually:
kubectl apply -f frontend/k8s/deployment.yaml
kubectl apply -f frontend/k8s/service.yaml
kubectl apply -f backend/k8s/deployment.yaml
kubectl apply -f backend/k8s/service.yaml


