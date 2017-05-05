const Minio = require('minio')

module.exports = Client

function Client(options) {
  if (!(this instanceof Client)) {
    return new Client(options)
  }
  this.bucket = options.bucket
  this.client = new Minio.Client(options)
}

Client.prototype.upload = function (filepath, options) {
  return new Promise((resolve, reject) => {
    this.remove(options.key).then(() => {
      this.client.fPutObject(this.bucket, trimKey(options.key), filepath, (err, etag) => {
        if (err) {
          reject(err)
        } else {
          resolve({ key: trimKey(options.key) })
        }
      })
    })
  })
}

Client.prototype.uploadBuffer = function (buf, options) {
  return new Promise((resolve, reject) => {
    this.remove(options.key).then(() => {
      this.client.putObject(this.bucket, trimKey(options.key), buf, options.size, (err, etag) => {
        if (err) {
          reject(err)
        } else {
          resolve({ key: trimKey(options.key) })
        }
      })
    })
  })
}

Client.prototype.download = function (key, filepath, options) {
  return new Promise((resolve, reject) => {
    this.client.fGetObject(this.bucket, trimKey(key), filepath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

Client.prototype.createDownloadStream = function (key, options) {
  return new Promise((resolve, reject) => {
    this.client.getObject(this.bucket, trimKey(key), (err, dataStream) => {
      if (err) {
        reject(err)
      } else {
        resolve(dataStream)
      }
    })
  })
}

Client.prototype.remove = function (key) {
  return new Promise((resolve, reject) => {
    this.client.removeObject(this.bucket, trimKey(key), err => {
      resolve()
    })
  })
}

Client.prototype.url = function (key) {
  return new Promise((resolve, reject) => {
    this.client.presignedGetObject(this.bucket, trimKey(key), 24 * 60 * 60, (err, presignedUrl) => {
      if (err) {
        reject(err)
      } else {
        resolve(presignedUrl)
      }
    })
  })
}

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}