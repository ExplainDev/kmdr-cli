FROM node:12-slim

COPY ./ /home/node/kmdr.sh

WORKDIR /home/node/kmdr.sh

ENV PATH=/home/node/.npm-global/bin:$PATH \
    NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install \ 
&&  npm run build \
&&  npm link \
&&  echo 'PS1="\\$\[$(tput sgr0)\] "' >> /home/node/.bashrc

ENTRYPOINT [ "kmdr", "explain" ]
