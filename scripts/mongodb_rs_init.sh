#!/bin/bash

echo "###### Waiting for ${MONGODB_PRIMARY_NAME} instance startup.."
until mongosh --host "${MONGODB_PRIMARY_NAME}":"${MONGODB_PORT}" --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done
echo "###### Working ${MONGODB_PRIMARY_NAME} instance found, initiating user setup & initializing rs setup.."

mongosh --host "${MONGODB_PRIMARY_NAME}":"${MONGODB_PORT}" <<EOF
var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
var admin = db.getSiblingDB('admin');
admin.auth(rootUser, rootPassword);

var config = {
    "_id": "${MONGODB_REPLICA_SET_KEY}",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB_PRIMARY_NAME}:${MONGODB_PORT}",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "${MONGODB_SECONDARY_NAME}:${MONGODB_PORT}",
            "priority": 1
        },
        {
            "_id": 2,
            "host": "${MONGODB_ARBITER_NAME}:${MONGODB_PORT}",
            "arbiterOnly": true 
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF