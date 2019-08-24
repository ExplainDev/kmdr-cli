FROM node:12-slim
USER node
RUN mkdir /home/node/kmdr.sh
WORKDIR /home/node/kmdr.sh
COPY ./ ./
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm install 
RUN npm run build
RUN npm link
RUN echo 'PS1="\\$\[$(tput sgr0)\] "' >> /home/node/.bashrc
