# This is a build stage for the admeta node

# This is a base image to build substrate nodes
FROM docker.io/paritytech/ci-linux:production as builder

WORKDIR /admeta
COPY . .
RUN cargo build --locked --release

# This is the 2nd stage: a very small image where we copy the binary."
FROM docker.io/library/ubuntu:20.04
LABEL description="Multistage Docker image for AdMeta Node" \
	image.type="builder" \
	image.authors="han@admeta.network" \
	image.vendor="AdMeta" \
	image.description="Multistage Docker image for AdMeta Node" \
	image.source="https://github.com/AdMetaNetwork/admeta" \
	image.documentation="https://github.com/AdMetaNetwork/admeta"

# Copy the node binary.
COPY --from=builder /admeta/target/release/admeta /usr/local/bin

RUN useradd -m -u 1000 -U -s /bin/sh -d /node-dev node-dev && \
	mkdir -p /chain-data /node-dev/.local/share && \
	chown -R node-dev:node-dev /chain-data && \
	ln -s /chain-data /node-dev/.local/share/admeta && \
	# unclutter and minimize the attack surface
	rm -rf /usr/bin /usr/sbin && \
	# check if executable works in this container
	/usr/local/bin/admeta --version

USER node-dev

EXPOSE 30333 9933 9944 9615
VOLUME ["/chain-data"]

ENTRYPOINT ["/usr/local/bin/admeta"]