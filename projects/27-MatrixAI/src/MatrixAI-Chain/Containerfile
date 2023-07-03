FROM docker.io/library/ubuntu:22.04

# show backtraces
ENV RUST_BACKTRACE 1

# install tools and dependencies
RUN apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
		ca-certificates && \
# apt cleanup
	apt-get autoremove -y && \
	apt-get clean && \
	find /var/lib/apt/lists/ -type f -not -name lock -delete; \
# add user and link ~/.local/share/contractlab to /data
	useradd -m -u 1000 -U -s /bin/sh -d /contractlab contractlab && \
	mkdir -p /data /contractlab/.local/share && \
	chown -R contractlab:contractlab /data && \
	ln -s /data /contractlab/.local/share/matrix-ai

USER contractlab

# copy the compiled binary to the container
COPY --chown=contractlab:contractlab --chmod=774 matrix-ai /usr/bin/matrix-ai

# check if executable works in this container
RUN /usr/bin/matrix-ai --version

# ws_port
EXPOSE 9930 9333 9944 30333 30334

CMD ["/usr/bin/matrix-ai"]