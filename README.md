# minio-cnpm
minio wraper for [cnpmjs.org NFS](https://github.com/cnpm/cnpmjs.org/wiki/NFS-Guide)

## Usage

```javascript
const minioCnpm =  require('minio-cnpm')({
      endPoint: '192.168.14.221',
      port: 9000,
      region: 'us-east-1',
      secure: false,
      accessKey: 'xxxxxxxxxxxx',
      secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
      bucket: 'cnpm'
  })
```