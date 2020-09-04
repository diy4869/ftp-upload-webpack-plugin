const FTP = require('ftp')
const fs = require('fs')
const ora = require('ora')
const path = require('path')

class FTPUploadWebpackPlugin {
  constructor (options) {
    this.options = options
    this.client = new FTP()
  }

  apply (compiler) {
    compiler.plugin('done', () => {
      this.client.on('ready', async () => {
        const spinner = ora('正在努力上传中....').start()
        await this.readFtpDir(this.options.uploadPath)
        this.upload(this.options.copyPath, this.options.uploadPath).then(res => {
          res ? spinner.succeed('上传成功') : spinner.succeed('文件已存在')
        })
        spinner.succeed('上传成功')
        this.client.end()
      })
      this.client.connect({
        host: this.options.host,
        port: this.options.port,
        user: this.options.user,
        password: this.options.password
      })
    })
  }

  // 读取ftp文件夹目录
  readFtpDir (path) {
    return new Promise((resolve, reject) => {
      this.client.list(path, false, (err, list) => {
        if (err) reject(err)
        const fileList = list.map(item => item.name)
        resolve(fileList)
      })
    })
  }

  // 上传
  upload (fromPath, toPath) {
    const uploadFile = (file, toPath) => {
      return new Promise((resolve, reject) => {
        this.client.put(file, toPath, false, err => {
          if (err) reject(err)
          resolve()
        })
      })
    }
    const upload = (fromPath, toPath) => {
      const stats = fs.statSync(fromPath)

      if (stats.isFile()) {
        // 文件
        const buffer = fs.readFileSync(fromPath)
        uploadFile(buffer, toPath).catch(err => {
          console.log(err)
        })
      } else {
        // 文件夹
        this.client.mkdir(toPath, false, () => {
          this.upload(fromPath, toPath)
        })
      }
    }

    return new Promise((resolve, reject) => {
      const filelist = fs.readdirSync(fromPath)

      filelist.map(async item => {
        const ftpFilePath = await this.readFtpDir(toPath)
        // 找到ftp中不存在的文件
        const some = ftpFilePath.some(file => file === item)

        if (this.options.cover) {
          const from = path.resolve(fromPath, item)
          const to = `${toPath}/${item}`
          upload(from, to)
          resolve(true)
        } else {
          if (!some) {
            const from = path.resolve(fromPath, item)
            const to = `${toPath}/${item}`
            upload(from, to)
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}

module.exports = FTPUploadWebpackPlugin
