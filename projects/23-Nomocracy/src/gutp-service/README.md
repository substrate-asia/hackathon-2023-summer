# GUTP

A General User Text Persistence protocol.


## The Backend

This project aims to give a reference implimentation for the GUTP backend service. 

The frontend should be put into another project. This backend could potentially support multiple frontends, or multiple different apps.

The initial idea is to support a forum app, a blog, a technical social app.

## Build

### build application wasm
```
cd gutp && spin build
```

### build application docker image
```
./build_app_image.sh
```


### start framework
```
docker compose -f gutp-docker-compose-1node.yml up
```

## Development

Rebuild application image when code changed.
```
./build_app_image.sh
```

If there is DB change, following cleanup needed:

    Delete gutp-db_1-1
    Delete gutp-subnode_1-1