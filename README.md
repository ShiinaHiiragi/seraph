# Seraph

<p align="right"> Ichinoe </p>

## Introduction

**Seraph** is a cloud server assistant aiming to make advantage of hosts' potential.

## Usage

1. Install `Node.js` no earlier than v16.7.0 (on which `fs.cpSync` was added) and `npm.js`

2. Clone this repository to your cloud server and install dependencies in `package.json`

    ```shell
    # use　`git clone --recurse-submodules` to fetch extent modules
    git clone https://github.com/ShiinaHiiragi/seraph
    cd seraph/
    npm install
    cd server/ && npm install && cd ..
    ```

3. **IMPORTANT:** Create an `.env` file under `seraph/` and add following configuration:

    - development http (`npm run dev`) with react on 80 and express on 8000:

        ```shell
        cat > .env <<EOF
        PORT=80
        REACT_APP_HOSTNAME=localhost
        REACT_APP_SPORT=8000
        EOF
        ```

    - deployment https (`npm start`) with express on 443:

        ```shell
        cat > .env <<EOF
        REACT_APP_HOSTNAME=$YOUR_HOSTNAME
        REACT_APP_SSLCERT=local
        REACT_APP_SPORT=443
        EOF
        ```

        and certificate `${HOSTNAME}.crt` and key `${HOSTNAME}.key` MUST be added under seraph/server/cert

    - deployment https (`npm start`) with nginx proxy from 443 to express on 8000:

        ```shell
        cat > .env <<EOF
        REACT_APP_HOSTNAME=$YOUR_HOSTNAME
        REACT_APP_SSLCERT=nginx
        REACT_APP_NPORT=443
        REACT_APP_SPORT=8000
        EOF
        ```

        and configure nginx

        ```
        cat > /etc/nginx/sites-available/default <<EOF
        server {
            listen 443 ssl;
            server_name $YOUR_HOSTNAME;
            ssl_certificate     /etc/nginx/ssl/$YOUR_HOSTNAME_bundle.crt;
            ssl_certificate_key /etc/nginx/ssl/$YOUR_HOSTNAME.key;

            location / {
                proxy_pass http://localhost:8000;
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
            }
        }
        EOF
        sudo nginx -t && sudo systemctl reload nginx
        ```

        a reload is needed after updation of certificates

4. Start the server (make sure `.env` is created before executing following command)

    ```shell
    npm run build
    tmux new -As seraph
    npm start
    ```

    - for Linux user who receive error like 'Port 80 requires elevated privileges', try running

        ```shell
        sudo setcap 'cap_net_bind_service=+ep' $(which node)
        ```

    - for Linux user who receive error like 'sudo: node: command not found', add path of node to visudo

        ```shell
        sudo visudo
        ```

    - for those who receive error like 'Can't resolve `@mui/material/utils`', try running the following command

        ```shell
        npm install @mui/material @emotion/react @emotion/styled
        ```

5. Open page and initialize configuration via setting language and password

## Log

- 05/27/2026 ver 0.2.3: Fix i18n and add converter for epub files
- 05/26/2026 ver 0.2.2: Fix some bugs and add supports for dot files
- 10/17/2023 ver 0.2.1: Fix several bugs and add extractor for zip files
- 10/16/2023 ver 0.2.0: Add TODO list
- 09/19/2023 ver 0.1.1: Fix several bugs
- 09/18/2023 ver 0.1.0: Complete folder page

## TODO

- [ ] upload multiple files
- [ ] setting popup

## Memo

1. File Explorer
    - edit in milkdown
    - create / edit attached markdown
2. Milkdown
    - edit / read only
    - save in folder / attach to file
    - download
3. Subscription: receive message from
    - cron(`cron`)'s & sync(`ntp-time-sync`)'s snippet
    - webhook server
4. Terminal
    - open powershell / bash
    - terminal: react-terminal
