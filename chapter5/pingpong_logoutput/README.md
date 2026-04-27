# Ping Pong / Log Output App

## How to deploy to Google Kubernetes Engine

The application is managed by ArgoCD on the cluster. Simply commit and push your changes to GitHub — GitHub Actions and ArgoCD will take care of the rest.

The Ping Pong application requires a PostgreSQL database secret to be applied manually. The file <code>./ping_pong/manifests/pingpong-postgres-password.enc.yaml</code> contains the required values encrypted with sops and age. If you have the private key in the default location (~/.config/sops/age/), apply the secret to the cluster with:

```
sops -d ping_pong/manifests/pingpong-postgres-password.enc.yaml | kubectl apply -f -
```

## How to use App

- The main path (`/`) shows the current log value and ping pong count.
- The pingpong count is increased by 1 by every request to path `/pingpong`.
