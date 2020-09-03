import webpack from 'webpack'

export interface FTPUploadWebpackPluginOptions {
    host: string,
    port: number,
    user: string,
    password: string,
    copyPath: string,
    uploadPath: string
}

declare class FTPUploadWebpackPlugin {
    constructor (options: FTPUploadWebpackPluginOptions)
    apply (compiler: webpack.Configuration)
    readFtpDir(path: string): Promise<string[]>
    upload(fromPath: string, toPath: string): Promise<Boolean>
}

export default FTPUploadWebpackPlugin
