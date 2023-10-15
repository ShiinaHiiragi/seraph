# Seraph

<p align="right"> Ichinoe </p>

## Introduction

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
    REACT_APP_SPORT=80
    ```

    - `REACT_APP_PROTOCOL`: `http` or `https`. If `https` is applied, certificate `${HOSTNAME}.crt` and key `${HOSTNAME}.key` MUST be added under seraph/server/cert
    - `REACT_APP_HOSTNAME`: changed to host name of your certificate, or just use `localhost` for HTTP
    - `REACT_APP_SPORT`: the port server uses

4. Start the server (make sure `.env` is created before executing following command)

    ```shell
    npm run build
    npm start
    ```

    - for Linux user who receive error like 'Port 80 requires elevated privileges', try running `npm run start:sudo`
    - for those who receive error like 'Can't resolve `@mui/material/utils`', try running the following command

        ```shell
        npm install @mui/material @emotion/react @emotion/styled
        ```

5. Open page and initialize configuration via setting language and password

## Log

- 2023 9/18 ver 0.1.0: Complete folder page
- 2023 9/19 ver 0.1.1: Fix several bugs
- 2023 10/16 ver 0.2.0 Add TODO list

## Memo

1. File Explorer
    - unzip compressed
    - auto delete cron
    - edit in milkdown
    - create / edit attached markdown
2. Links
    - add / modify / delete links
    - download resources
    - arXiv search
3. Milkdown
    - edit / read only
    - save in folder / attach to file
    - download
4. Subscription
    - cron (cron) & sync (ntp-time-sync)
    - snippet (return string / file)
    - mail server
    - multilanguage support
5. Terminal
    - open powershell / bash
    - terminal: react-terminal
6. Header
    - about seraph
    - setting
