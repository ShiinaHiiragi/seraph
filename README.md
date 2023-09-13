# Seraph

<p align="right"> Ichinoe </p>

## Introduction

## Usage

## Memo

1. File Explorer
    - upload
    - view in new tab / rename / move / download / delete
    - edit in milkdown
    - attached markdown
    - preview markdown
2. Archive
    - arXiv
    - external link / save in file explorer
3. Links
4. Mail Server
5. Milkdown
    - edit only
    - attach to file / save in file explorer
    - export
6. TODO
    - sync: clear when finish
    - async: 60 s

## 请求状态管理

对于请求，初始状态为 `BA`。经过认证后，状态变为 `AS` 或 `AF`

1. 对于 `AS`，继续执行
    1. 得到状态 `ES`：成功返回，状态码 200
    2. 得到状态 `EF`：执行产生已知错误，状态码 200
2. 对于 `AF`，继续执行
    1. 得到状态 `ES`：成功返回受限制的消息，状态码 200
    2. 得到状态 `EF`：执行产生已知错误，状态码 200
3. 对于 `AF`，继续执行时产生几种特殊已知错误
    1. 权限不足：返回 `AF` 状态的 `IT` 或 `NI`
    2. 未初始化：返回 `AF` 状态的 `NI`（仅在 `GET/auth/meta`）
    3. 密码错误：返回 `AF` 状态的 `PU`（仅在 `POST/auth/login`）
4. 产生未知错误：返回 `EF` 状态的 `ISE`，状态码 500
