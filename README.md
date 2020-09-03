# ftp-upload-webpack-plugin
![npm](https://img.shields.io/npm/v/ftp-upload-webpack-plugin)
## 安装
```
npm i ftp-upload-webpack-plugin -D
```

## 使用

```ts

interface FTPUploadWebpackPluginOptions {
    host: string,
    port: number,
    user: string,
    password: string,
    copyPath: string,
    uploadPath: string
}

new FTPUploadWebpackPlugin(options: FTPUploadWebpackPluginOptions)

```
## 选项

选项 | 说明 | 必填
---|---|---
host | ftp地址 | 是
port | ftp端口 | 是
user| 用户名 | 是
password | 密码 | 是
copyPath | 本地路径 | 是
uploadPath | 需要上传的ftp路径 | 是

