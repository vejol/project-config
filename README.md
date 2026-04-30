# Project (Todo App)

This repository contains the configuration and manifests for the DevOps with Kubernetes course project. The configuration is intended for use with Google Kubernetes Engine.

The project is a simple Todo application. Its feature set is minimal — the main focus has been on building a well-structured configuration following good practices. The application source code can be found in my [kubernetes-submissions](https://github.com/vejol/kubernetes-submissions) repository.

The pipeline works as follows:

- The source code repository contains a GitHub Actions workflow that builds Docker images, pushes them to Docker Hub, and then commits the updated image names to this config repository's `kustomization.yaml` files.
- By default, every commit is deployed to the `project-staging` namespace, and every tagged commit is deployed to the `project-prod` namespace.
- ArgoCD is installed on the cluster and monitors this repository. When it detects changes, it automatically applies them to the cluster.
- After the initial setup, all it takes to ship changes is committing to the source code repository — the pipeline takes care of propagating them to the right environments.

## How to Deploy

### 1. Add Secrets to Cluster

The secrets must be added manually:

- The Todo App requires a Secret for PostgreSQL database credentials
- Automatic database backup needs a Secret for the Google Service Account
- The Broadcaster requires a Discord webhook Secret to send notifications about completed todos

The `overlays/prod/secrets` and `overlays/staging/secrets` directories contain the required secrets, encrypted using the `sops` and `age` tools. If you have the private key stored in the default location (`~/.config/sops/age/`), you can apply them to the cluster with the following commands:

Secrets for the `project-prod` environment:

```
sops -d overlays/prod/secrets/discord-webhook-secret.enc.yaml | kubectl apply -f -
sops -d overlays/prod/secrets/google-sa-secret.enc.yaml | kubectl apply -f -
sops -d overlays/prod/secrets/todo-postgres-secret.enc.yaml | kubectl apply -f -
```

Secrets for the `project-staging` environment:

```
sops -d overlays/staging/secrets/todo-postgres-secret.enc.yaml | kubectl apply -f -
```

### 2. Deploy Application

Apply the application to ArgoCD with the following command:

```
kubectl apply -f application-apps.yaml
```

ArgoCD will automatically start all the services required by the application.
