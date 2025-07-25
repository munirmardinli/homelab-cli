# trunk-ignore-all(checkov/CKV_DOCKER_2)
FROM node:22-alpine

RUN mkdir -p \
	/home/node/app/node_modules

WORKDIR /home/node/app

COPY --chown=node:node package.json /home/node/app/package.json
COPY --chown=node:node node_modules /home/node/app/node_modules
COPY --chown=node:node lib /home/node/app/lib

RUN apk add --no-cache openssh-client sshpass

ARG BUILD_TIMESTAMP
ARG BRANCH
ARG GITHUB_REPO
ARG GITHUB_OWNER
ARG GITHUB_SHA
ARG IMAGE_TITLE
ARG IMAGE_DESCRIPTION
ARG REPO_LICENSE
ARG REPO_CATEGORIES

LABEL org.opencontainers.image.title="${IMAGE_TITLE}"
LABEL org.opencontainers.image.description="${IMAGE_DESCRIPTION}"
LABEL org.opencontainers.image.vendor="${GITHUB_OWNER}"
LABEL org.opencontainers.image.authors="${GITHUB_OWNER} <munir@mardinli.de>"
LABEL org.opencontainers.image.url="https://hub.docker.com/r/${GITHUB_OWNER}/${IMAGE_TITLE}"
LABEL org.opencontainers.image.documentation="https://github.com/${GITHUB_REPO}#readme"
LABEL org.opencontainers.image.source="https://github.com/${GITHUB_REPO}"
LABEL org.opencontainers.image.version="${BRANCH}"
LABEL org.opencontainers.image.revision="${GITHUB_SHA}"
LABEL org.opencontainers.image.created="${BUILD_TIMESTAMP}"
LABEL org.opencontainers.image.licenses="${REPO_LICENSE}"

LABEL com.docker.desktop.extension.api.version="1.0.0"

LABEL com.docker.extension.additional-urls="https://${GITHUB_OWNER}.github.io/${IMAGE_TITLE}"

LABEL com.docker.extension.categories="${REPO_CATEGORIES}"
LABEL com.docker.extension.screenshots="https://profile-images.xing.com/images/22b60162f0c35aafb7f44323785a5616-4/munir-mardinli.1024x1024.jpg"

LABEL com.docker.extension.publisher-url="https://mardinli.de"
LABEL com.docker.extension.changelog-url="https://github.com/${GITHUB_REPO}/releases"

LABEL com.docker.extension.legal-url="https://github.com/${GITHUB_REPO}/blob/${BRANCH}/LICENSE"

LABEL com.centurylinklabs.watchtower.enable="true"

USER node

CMD ["sh", "-c", "node lib/index.js"]
