FROM node:18-alpine3.15

WORKDIR /matrixai-ui
COPY ./build .

# RUN node ./web-server.js
ENTRYPOINT ["node"]
CMD ["./web-server.js"]