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

## Exercise 3.09: DBaaS vs DIY Comparison

The choice between Google Cloud SQL and a self-managed containerized database solution involves many considerations. Both approaches have their pros and cons.

### Database as a Service - Google Cloud SQL

#### Pros

- Setting up the database is easy and does not require much work or understanding of configurations.
- Database maintenance and updates are outsourced to Google, saving time and effort.
- The service can be considered highly scalable, meaning that as the load increases, the service automatically ensures database availability.
- Google Cloud SQL offers various backup options:
  - Backups can be made automatically at regular intervals or manually initiated by the user.
  - Backup and retention are automatically configured, making it easy to enable backups.

#### Cons

- Costs are higher compared to a self-managed database.
- The price consists of many components, making it difficult to estimate accurately.
- In some cases, DBaaS may be more limited in functionality compared to a self-managed database solution. The user may want a feature in the database that is not available in the managed service.

### Self-Managed Database Using Containerized PostgreSQL

#### Pros

- It is a more cost-effective option. There are costs associated with GKE usage and data storage, but generally, a self-managed database is cheaper than the DBaaS option.
- Provides full control over configuration, allowing you to choose any database and its version.
- Same setup and database image can be used in local development.

#### Cons

- Requires more manual work. It is more labor-intensive to set up and requires an understanding of database configurations.
- You must take care of the database's scalability. It may be challenging to setup multi-replica Postgres yourself.
- The database solution must be maintained by yourself, meaning you need to ensure its functionality and updates.
- You need to set up the backup solution yourself. This requires time and expertise. The database can be backed up, for example, by taking a snapshot of the volume where the database data is stored. Another option could be using the pg_dump tool to create a backup. You must also take care of retaining the backups.
