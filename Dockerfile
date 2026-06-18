FROM node:20

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV PLAYWRIGHT_BROWSERS_PATH=0

COPY package*.json ./

# install dependency WAJIB INCLUDE devDependencies
RUN npm ci --include=dev

# copy project
COPY . .

# install browser (di image saja)
RUN npx playwright install chromium

USER root

ENTRYPOINT ["/app/docker.sh"]