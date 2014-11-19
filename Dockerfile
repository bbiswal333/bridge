FROM ubuntu:14.04
MAINTAINER WDF Tools GitHub

# Setup apt-get and proxies
RUN echo deb http://archive.ubuntu.com/ubuntu precise universe >> /etc/apt/sources.list
RUN echo 'Acquire::http::Proxy "http://proxy.wdf.sap.corp:8080/";Acquire::https::Proxy "http://proxy.wdf.sap.corp:8080/";' > /etc/apt/apt.conf
ENV http_proxy http://proxy.wdf.sap.corp:8080
ENV https_proxy http://proxy.wdf.sap.corp:8080
ENV no_proxy github.wdf.sap.corp,localhost

# Install dependencies
RUN apt-get update && apt-get clean
RUN apt-get install -q -y git curl wget nodejs nodejs-legacy npm && apt-get clean

# Install SAP certificates
RUN curl -k https://github.wdf.sap.corp/GitHub/Install-Root-Certificates/raw/master/install-certs-ubuntu-12.04.sh | sh
RUN curl -k https://github.wdf.sap.corp/GitHub/Install-Root-Certificates/raw/master/install-certs-java-ubuntu-12.04.sh | sh

# Configure git
RUN git config --global http.sslVerify false
RUN git config --global http.sslCAinfo /usr/local/share/ca-certificates/sapnetca.crt

RUN mkdir bridge
RUN git clone https://github.wdf.sap.corp/bridge/bridge.git /bridge

RUN npm config set proxy http://proxy.wdf.sap.corp:8080
RUN npm config set https-proxy http://proxy.wdf.sap.corp:8080

EXPOSE 8000
CMD ["node", "/bridge/server/server.js", "-proxy", "false", "-host_filter", ""]