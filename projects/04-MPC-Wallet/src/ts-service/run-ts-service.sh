dapr_name="ts-service"

dapr run --app-id $dapr_name \
         --app-protocol http \
         --app-port 8100 \
         --dapr-http-port 7100 \
         --log-level debug \
         --components-path ~/.dapr/components \
         --config ~/.dapr/config.yaml \
         -- yarn start
