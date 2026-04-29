# Project (Todo App)

## How to deploy to Google Cloud

Apply application production and staging versions to ArgoCD with command:

```
kubectl apply -n argocd -f application-prod.yaml -f application-staging.yaml
```

The application is managed by ArgoCD on the cluster. Simply commit and push your changes to GitHub — GitHub Actions and ArgoCD will take care of the rest.

The secrets must be added manually:

- The Todo App requires a Secret for PostgreSQL database credentials
- Automatic database backup needs a Secret for the Google Service Account

The folder `./todo-backend/manifests/` contains the required secrets encrypted using the `sops` and `age` tools. If you have the private key in your possession and it is stored in the default location `~/.config/sops/age/`, you can apply the them to the cluster with the following commands:

```
sops -d todo-backend/manifests/google-sa-secret.enc.yaml | kubectl apply -f -
sops -d todo-backend/manifests/secret.enc.yaml | kubectl apply -f -
```
