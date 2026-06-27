# Seraph

<p align="right"> Ichinoe </p>

## Introduction

**Seraph** is a cloud server assistant aiming to make advantage of hosts' potential.

## Usage

### Installation

1. Install `Node.js` no earlier than v16.7.0 (on which `fs.cpSync` was added) and `npm.js`

    ```shell
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    nvm install 16
    nvm use 16
    ```

2. Clone this repository to your cloud server and install dependencies in `package.json`

    ```shell
    # use　`git clone --recurse-submodules` to fetch submodules
    git clone https://github.com/ShiinaHiiragi/seraph
    cd seraph/
    npm install --production
    npm install --prefix server --production
    ```

    remove `--production` for development

3. (**IMPORTANT**) Create an `.env` file under `seraph/` and add following configuration

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
        GENERATE_SOURCEMAP=false
        REACT_APP_HOSTNAME=${YOUR_HOSTNAME}
        REACT_APP_SSLCERT=local
        REACT_APP_SPORT=443
        EOF
        ```

        and certificate `${HOSTNAME}.crt` and key `${HOSTNAME}.key` MUST be added under `seraph/server/cert`

    - deployment https (`npm start`) with nginx proxy from 443 to express on 8000:

        ```shell
        cat > .env <<EOF
        GENERATE_SOURCEMAP=false
        REACT_APP_HOSTNAME=${YOUR_HOSTNAME}
        REACT_APP_SSLCERT=nginx
        REACT_APP_NPORT=443
        REACT_APP_SPORT=8000
        EOF
        ```

        and configure nginx; attention, a reload is needed after updation of certificates

        ```
        sudo apt install -y nginx
        sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
        server {
            listen 443 ssl;
            server_name ${YOUR_HOSTNAME};
            ssl_certificate     /etc/nginx/ssl/${YOUR_HOSTNAME}_bundle.crt;
            ssl_certificate_key /etc/nginx/ssl/${YOUR_HOSTNAME}.key;

            location / {
                proxy_pass http://localhost:8000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_read_timeout 1800s;
                proxy_send_timeout 1800s;
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
                client_max_body_size 512M;
            }
        }
        EOF
        sudo nginx -t && sudo systemctl reload nginx
        ```

        > Configure auto certificate deployment
        > 
        > 1. Install `acme.sh` under `root`
        > 
        >     ```shell
        >     sudo su
        >     curl https://get.acme.sh | sh -s email=${YOUR_EMAIL}
        >     ```
        > 
        > 2. Issue and install certificate via dns provider api (e.g. Tencent Cloud)
        > 
        >     ```shell
        >     sudo mkdir -p /etc/nginx/ssl
        >     Tencent_SecretId="..." Tencent_SecretKey="..." /root/.acme.sh/acme.sh --issue \
        >       -d ${YOUR_HOSTNAME} \
        >       --dns dns_tencent \
        >       --server letsencrypt
        >     /root/.acme.sh/acme.sh --install-cert -d ${YOUR_HOSTNAME} \
        >       --fullchain-file /etc/nginx/ssl/${YOUR_HOSTNAME}_bundle.crt \
        >       --key-file /etc/nginx/ssl/${YOUR_HOSTNAME}.key \
        >       --reloadcmd "systemctl reload nginx"
        >     ```

4. (OPTIONAL) If you have fetched submodules, more dependencies are needed

    ```shell
    # if submodules have not been fetched
    git submodule update --init --recursive
    # install pandoc
    sudo apt install -y pandoc
    # install python3
    sudo apt install -y python3 python3-pip
    # install pip packages
    # sudo is needed because express is executed under sudo
    sudo pip3 install tqdm beautifulsoup4 lxml markdown-it-py pillow numpy
    ```

5. Start the server (make sure `.env` is created before executing following command)

    ```shell
    npm run build
    tmux new -As seraph
    npm start
    ```

6. Open the page and initialize configuration via setting language and password

#### Troubleshooting

1. `npm error make: g++: No such file or directory`: try running

    ```shell
    sudo apt update
    sudo apt install -y build-essential
    ```

2. `EACCES: permission denied, open 'node_modules/.cache/.eslintcache'`: try running

    ```shell
    sudo chown -R $USER:$USER node_modules/.cache
    ```

3. `Port 80 requires elevated privileges`: try running

    ```shell
    sudo setcap 'cap_net_bind_service=+ep' $(which node)
    ```

4. `sudo: node: command not found`: add path of node to visudo using

    ```shell
    sudo visudo
    ```

5. `Can't resolve @mui/material/utils`: try running

    ```shell
    npm install @mui/material @emotion/react @emotion/styled
    ```

#### Backup

- All data are stored in `server/data/`

    ```shell
    zip -r backup.zip server/data/
    ```

## Log

- 06/27/2026 ver 1.4.6: Fix cookie session and raw toast functions
- 06/26/2026 ver 1.4.5: Add feature of drag & drop and styles of sonner toast
- 06/25/2026 ver 1.4.4: Add setting for shortcuts and fix states of Crepe editor
- 06/24/2026 ver 1.4.3: Add feature of auto save for Crepe editor
- 06/23/2026 ver 1.4.2: Add link shortcut for file explorer
- 06/22/2026 ver 1.4.1: Fix file content and scrollbar during editor rebuilding
- 06/21/2026 ver 1.4.0: Add Milkdown Crepe as rich text editor
- 06/18/2026 ver 1.3.0: Update dependencies from @mui/material and introduce @mui/x-tree-view v7
- 06/18/2026 ver 1.2.2: Add salt manager for data safety
- 06/17/2026 ver 1.2.1: Add encryption/decryption for files
- 06/16/2026 ver 1.2.0: Refactor base components to data router
- 06/15/2026 ver 1.1.4: Change links properties inside web pages
- 06/13/2026 ver 1.1.3: Add import/export for config
- 06/09/2026 ver 1.1.2: Add several config options
- 06/08/2026 ver 1.1.1: Fix permission problem and input field
- 06/07/2026 ver 1.1.0: Refactor welcome page into system dashboard
- 06/05/2026 ver 1.0.1: Add loading animation and fix words wrap
- 06/04/2026 ver 1.0.0: Update dependencies from @mui/joy and split build bundles
- 06/03/2026 ver 0.4.1: Fix plaintext cipher
- 06/02/2026 ver 0.4.0: Add terminal
- 06/01/2026 ver 0.3.0: Add setting popup
- 05/29/2026 ver 0.2.4: Add multiple files uploading
- 05/27/2026 ver 0.2.3: Add converter for epub files fix i18n text
- 05/26/2026 ver 0.2.2: Add supports for dot files and fix several bugs
- 10/17/2023 ver 0.2.1: Add extractor for zip files and fix several bugs
- 10/16/2023 ver 0.2.0: Add TODO list
- 09/19/2023 ver 0.1.1: Fix several bugs
- 09/18/2023 ver 0.1.0: Complete folder page
