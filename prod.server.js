var express = require('express')
var axios = require('axios')

var app = express()


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
}),
app.get('/api/getHotKey', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  axios.get(url, {
    headers: {
      origin: 'https://y.qq.com',
      referer: 'https://y.qq.com/portal/search.html'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
app.get('/api/getSearchData', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  axios.get(url, {
    headers: {
      origin: 'https://y.qq.com',
      referer: 'https://y.qq.com/m/index.html'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

// app.use('/', config)

app.use(express.static('./dist'))

var port = 9000

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
