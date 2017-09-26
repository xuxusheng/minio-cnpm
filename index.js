const Minio = require('minio')

module.exports = Client

function Client(options) {
  if (!(this instanceof Client)) {
    return new Client(options)
  }
  this._mode = options.mode === "public" ? "public" : "private"
  this._endPoint = options.endPoint
  this._port = options.port || null
  this._bucket = options.bucket
  this.client = new Minio.Client(options)
}

Client.prototype.upload = function (filepath, options) {
  return new Promise((resolve, reject) => {
    this.remove(options.key).then(() => {
      this.client.fPutObject(this._bucket, trimKey(options.key), filepath, (err, etag) => {
        if (err) {
          reject(err)
        } else {
          const {_endPoint, _port, _bucket, _mode} = this
          if (_mode === 'public') {
            resolve({
              url: `http://${_endPoint}${!_port ? '' : `:${_port}`}/${_bucket}/${trimKey(options.key)}`
            })
          } else {
            resolve({key: trimKey(options.key)})
          }
        }
      })
    })
  })
}

Client.prototype.uploadBuffer = function (buf, options) {
  return new Promise((resolve, reject) => {
    this.remove(options.key).then(() => {
      this.client.putObject(this._bucket, trimKey(options.key), buf, options.size, (err, etag) => {
        if (err) {
          reject(err)
        } else {
          resolve({key: trimKey(options.key)})
        }
      })
    })
  })
}

Client.prototype.download = function (key, filepath, options) {
  return new Promise((resolve, reject) => {
    this.client.fGetObject(this._bucket, trimKey(key), filepath, err => {
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
    this.client.getObject(this._bucket, trimKey(key), (err, dataStream) => {
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
    this.client.removeObject(this._bucket, trimKey(key), err => {
      resolve()
    })
  })
}

Client.prototype.url = function (key) {
  const {_endPoint, _port, _bucket} = this
  return `http://${_endPoint}${!_port ? '' : `:${_port}`}/${_bucket}/${trimKey(key)}`
}

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}