const path = require('path');
const axios = require('axios');

function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@', resolve('src'))
            .set('stylus', resolve('src/common/stylus'))
            .set('common', resolve('src/common'))
            .set('components', resolve('src/components'))
            .set('api', resolve('src/api'))
            .set('base', resolve('src/base'))
    },
    devServer: {
      before(app) {
        app.get('/api/getDiscList', (req, res) => {
          const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        }),
        app.get('/api/getSongData', (req, res) => {
          const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

          axios.get(url, {
            headers: {
              referer: 'https://y.qq.com/',
              origin: 'https://y.qq.com'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        }),
        app.get('/api/getSongUrl', (req, res) => {
          const url = 'https://api.qq.jsososo.com/song/urls'

          axios.get(url, {
            headers: {
              referer: 'https://api.qq.jsososo.com/',
              origin: 'https://api.qq.jsososo.com/'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        }),
        app.get('/api/getSongLyric', (req, res) => {
          const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

          axios.get(url, {
            headers: {
              origin: 'https://y.qq.com',
              referer: 'https://y.qq.com/portal/player.html'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        }),
        app.get('/api/getDiscDetail', (req, res) => {
          const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

          axios.get(url, {
            headers: {
              origin: 'https://y.qq.com',
              referer: 'https://y.qq.com/n/yqq/playlist'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        });
      }
    }

}
