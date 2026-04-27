# Ping Pong / Log Output App

## How to deploy to Google Kubernetes Engine

### Manual deployment

1. Create the secret pingpong-postgres-password:

In addition, you need to add a Secret for the Ping Pong application's PostgreSQL database. The file <code>./ping_pong/manifests/pingpong-postgres-password.enc.yaml</code> contains the required values encrypted with the sops and age tools. If you have the private key in the default location ~/.config/sops/age/, you can apply the secret to the cluster with the following command:

```
sops -d ping_pong/manifests/pingpong-postgres-password.enc.yaml | kubectl apply -f -
```

This password is used for the Ping Pong application's PostgreSQL database. The password used in the cluster is stored encrypted in `ping_pong/manifests/pingpong-postgres-password.enc.yaml`.

2. Create the `exercises` namespace:

   ```
   kubectl create namespace exercises
   ```

3. Deploy the app:
   ```
   kubectl apply -k .
   ```

## How to use App

- The main path (`/`) shows the current log value and ping pong count.
- The pingpong count is increased by 1 by every request to path `/pingpong`.
