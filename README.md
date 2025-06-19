# Seraph

<p align="right"> Ichinoe </p>

## Introduction
**Seraph** is a cloud server assistant aiming to make advantage of hosts' potential.

## Usage
1. Install `Node.js` no earlier than v16.7.0 (on which `fs.cpSync` was added) and `npm.js`
2. Clone this repository to your cloud server and install dependencies in `package.json`

    ```shell
    git clone https://github.com/ShiinaHiiragi/seraph
    cd seraph/
    npm install
    cd server/
    npm install
    ```

3. **IMPORTANT:** Create an `.env` file under `seraph/`
    - on Linux: `touch .env` for Bash
    - on Windows: `type nul >.env` for CMD or `New-Item .env` for Powershell

    **OPEN `.env` AND ADD FOLLOWING CONFIGURATION:**

    ```shell
    REACT_APP_PROTOCOL=http
    REACT_APP_HOSTNAME=localhost
    REACT_APP_PORT=3000
    REACT_APP_SPORT=80
    ```

    - `REACT_APP_PROTOCOL`: `http` or `https`. If `https` is applied, certificate `${HOSTNAME}.crt` and key `${HOSTNAME}.key` MUST be added under seraph/server/cert
    - `REACT_APP_HOSTNAME`: changed to host name of your certificate, or just use `localhost` for HTTP
    - `REACT_APP_PORT`: the port react uses
    - `REACT_APP_SPORT`: the port server uses

4. Start the server (make sure `.env` is created before executing following command)

    ```shell
    npm run build
    # tmux new -t seraph
    npm start
    # detach from session via Ctrl+B D
    ```

    stop this process using Ctrl+C

    ```shell
    tmux attach -t seraph
    tmux kill-session -t seraph
    ```

    - for Linux user who receive error like 'Port 80 requires elevated privileges', try running

        ```shell
        sudo setcap 'cap_net_bind_service=+ep' $(which node)
        ```

    - for Linux usesr who receive error like 'sudo: node: command not found', add path of node to visudo

        ```shell
        sudo visudo
        ```

    - for those who receive error like 'Can't resolve `@mui/material/utils`', try running the following command

        ```shell
        npm install @mui/material @emotion/react @emotion/styled
        ```

5. Open page and initialize configuration via setting language and password

## Log
- 2023 10/17 ver 0.2.1 Fix several bugs and add extraction
- 2023 10/16 ver 0.2.0 Add TODO list
- 2023 9/19 ver 0.1.1: Fix several bugs
- 2023 9/18 ver 0.1.0: Complete folder page

## TODO
- [ ] hash tag problem
- [ ] shortcut supports
- [ ] auto delete cron
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
    - local mail sever
    - listening server
4. Terminal
    - open powershell / bash
    - terminal: react-terminal
