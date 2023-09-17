# Seraph

<p align="right"> Ichinoe </p>

## Introduction

## Usage
1. Clone this repository to cloud server and install dependencies

    ```shell
    git clone https://github.com/ShiinaHiiragi/seraph
    cd seraph/
    npm install
    npm run build
    cd server/
    npm install
    ```

2. **IMPORTANT**: Create an .env file under seraph
    - on Linux: `touch .env` for Bash
    - on Windows: `type nul >.env` for CMD or `New-Item .env` for Powershell

    open `.env` and add following config:

    ```shell
    PORT=600
    REACT_APP_PROTOCOL=http
    REACT_APP_HOSTNAME=localhost
    REACT_APP_SPORT=700
    ```

    - `PORT`: the port React uses
    - `REACT_APP_PROTOCOL`: `http` or `https`. If `https` is applied, certificate `${HOSTNAME}_bundle.crt` and key `${HOSTNAME}.key` should be added under seraph/server/cert
    - `REACT_APP_HOSTNAME`: can be changed to other host name
    - `REACT_APP_SPORT`: the port server uses

3. Start by `npm start` in `seraph/`
    - for Linux user who receive error like 'Port xxx requires elevated privileges', try running `npm run start:sudo`
    - for those who receive error like 'Can't resolve @mui/material/utils', try running the following command

        ```shell
        npm install @mui/material @emotion/react @emotion/styled
        ```

4. Open page and initialize config by setting language and password

## Memo

1. Intro
2. File Explorer
    - new / delete folder
    - edit in milkdown
    - create / edit attached markdown
3. Links
    - add / modify / delete links
    - download resources
    - arXiv search
4. Milkdown
    - edit / read only
    - save in folder / attach to file
    - download
5. Subscription
    - cron (cron) & sync (ntp-time-sync)
    - snippet (return string / file)
    - mail server
    - multilanguage support
6. Terminal
    - open powershell / bash
    - terminal: react-terminal
7. TODO
    - sync: clear automatically
    - async: clear after ticked 60 s
8. Header
    - about
        - platform argument
        - info about seraph
    - setting
