## Microservices-Based Application with Nest.js and Docker

This repository contains a microservices-based application with two services: User Service and Notification Service. The services are built using Nest.js, TypeScript, and Docker for containerization and orchestration.

### Project Structure

The project is structured as follows:

- `apps/user`: Contains the User Service, which handles CRUD operations for user entities and uses MongoDB as the data store.

- `apps/notification`: Contains the Notification Service, which consumes messages from a message broker, sends mock notifications when a user is created, and informs about user deletions.


- `compose.yml`: Defines the services and their configurations for orchestration using Docker Compose.

- `libs/common`: Shared libraries bettwen the services

### Prerequisites

Before running the application, ensure that you have the following installed:

- Docker: For containerization.

### Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/DominikIlski/magma-skeleton.git
   cd magma-skeleton
   ```

2. Set permisions on key file for mongodb cluster 
   ```bash
   sudo chmod 400 ./data/replica.key
   ```

2. Build and run the services using Docker Compose:

   ```bash
   docker-compose up
   ```

3. Once the services are up and running, you can access the User Service APIs to perform CRUD operations on user entities.

### User Service

The User Service exposes the following API endpoints:

- `GET /users`: Retrieve a list of users with pagination support.
- `POST /users`: Create a new user (sends an event to the Notification service).
- `GET /users/:id`: Retrieve a user by ID.
- `PUT /users/:id`: Update a user by ID.
- `DELETE /users/:id`: Delete a user by ID (sends an event to the Notification service).
- `GET /health`: Checks health of the user service



### Notification Service

The Notification Service listens for events from a message broker. It sends mock notifications when a user is created and when a user is deleted. The notifications are logged to the console.

- `GET /health`: Checks health of the notification service

### Message Broker

This Project uses RabbitMQ

# IMPORTANT NOTES
To create a new replica key run:
```bash 
openssl rand -base64 756 > ./data/replica.key
```
Remember to add correct permisions to replica key file before the deployment.
```bash
sudo chmod 400 ./data/replica.key
```
To add correct error tracking in the services while they run on docker container add bellow to the top of the `main.ts` file
`import 'source-map-support/register';`

While inside a container of db to interact with it run `mongosh`
 and after that:
```bash
var admin = db.getSiblingDB('admin');
admin.auth('root', 'root');
```
end example command (change magmaSkeletonDb with appropiert db name inside mongo (e.g run `show dbs;`))
```
use magmaSkeletonDb;
db.users.findOne();
```