FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

ARG HOSTNAME=localhost
ARG NPORT=443
ARG SPORT=8000

# system deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git pandoc python3.11 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11 \
    && python3.11 -m pip install --no-cache-dir tqdm beautifulsoup4 markdown-it-py pillow numpy

# copy project source to /app
WORKDIR /app
COPY . .

# run `git submodule update --init --recurse` locally before building
# to avoid following network fetch inside the container as fallback
RUN [ -f extensions/ranobe-tools/README.md ] \
    || (rm -rf extensions/ranobe-tools && git clone https://github.com/ShiinaHiiragi/ranobe-tools extensions/ranobe-tools)

# express runs as plain HTTP on SPORT
# react constructs serverBaseURL as https://HOSTNAME:NPORT
# host nginx terminates TLS on NPORT and proxies to the mapped 800x port
RUN cat > .env <<EOF
REACT_APP_HOSTNAME=${HOSTNAME}
REACT_APP_SSLCERT=nginx
REACT_APP_NPORT=${NPORT}
REACT_APP_SPORT=${SPORT}
EOF

RUN npm install \
    && cd server \
    && npm install \
    && cd .. \
    && npm run build \
    && rm -rf node_modules

EXPOSE ${SPORT}

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
