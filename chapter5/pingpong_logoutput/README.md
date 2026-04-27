# Ping Pong / Log Output App

## How to deploy to Google Kubernetes Engine

### Manual deployment

1. Create the file `ping_pong/.env.gke` based on the provided example file:

   ```
   cp ping_pong/.env.gke.example ping_pong/.env.gke
   ```

   Then fill in your password in the new file:

   ```
   POSTGRES_PASSWORD=<your-password>
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
