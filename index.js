const http = require('http');
const got = require('got');


const cdtv_map = {
  "1": "1", // 新闻
  "2": "2", // 经济
  "3": "3", // 都市
  "4": "45", // 影视
  "5": "5", //公共
  "6": "6" //少儿
}


const cqtv_map = {
  "1": {
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "2": { //重庆卫视
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "3": { //重庆新闻
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "4": { //睛彩重庆
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "5": { //重庆汽摩
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "6": { //重庆影视
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "9": { //重庆科教
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "10": { //重庆都市
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "11": { //重庆娱乐
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "12": { //重庆生活
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "13": { //重庆国际
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "17": { //重庆时尚
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "16": { //重庆移动
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "18": { //重庆农村
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "19": { //重庆少儿
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
  "20": { //重庆手持
    ts_url_prefix: '',
    m3u8_url: '',
    last_timestamp: -1
  },
}

let sctv_cache = []

var server = http.createServer(async function (req, res) {
  if (req.url.indexOf('/cqtv') > -1) {
    try {
      cqtv(req, res)
    } catch (e) {
      console.log(e)
    }
  } else if (req.url.indexOf("/sctv") > -1 || req.url.indexOf('Kangba') > -1) {
    try {
      sctv(req, res)
    } catch (e) {
      console.log(e)
    }
  } else if (req.url.indexOf('cdtv') > -1) {
    try {
      cdtv(req, res)
    } catch (e) {
      console.log(e)
    }
  } else {
    res.end('not found')
  }
});
server.keepAliveTimeout = 300 * 1000

/**
 * proxy cdtv hls flv
 * @param {*} req 
 * @param {*} res 
 */
async function cdtv(req, res) {
  //hls url : http://www.cditv.cn/api.php?op=live&type=live&catid=192&id=1
  var headers = {
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Referer': 'http://www.cditv.cn/html/cdrtv/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3610.2 Safari/537.36',
    "X-Requested-With": 'ShockwaveFlash/32.0.0.101'
  };
  var url = req.url
  var index = url.substr(url.lastIndexOf('/') - 1, 1)
  index = cdtv_map[index] ? cdtv_map[index] : "1"
  var type = 'type=live'
  if (url.indexOf('m3u8') > -1) {
    type = 'videotype=m3u8'
  }
  var flv = 'http://www.cditv.cn/api.php?op=live&' + type + '&catid=192&id=' + index
  console.log('get file:' + flv)
  var content = (await got.get(flv, {
    headers: headers
  }).on('error', err => { console.log(err) })).body
  res.writeHead(302, { 'Location': content })
  console.log('redirect video_url:' + content)
  return res.end()
}



/**
 * proxy sctv hls
 * @param {*} req 
 * @param {*} res 
 */
async function sctv(req, res) {
  var headers = {
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Referer': 'http://www.sctv.com/live/video/SCTV4/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3610.2 Safari/537.36',
    "X-Requested-With": 'ShockwaveFlash/32.0.0.101'
  };
  var url = req.url;
  var index = url.substr(url.lastIndexOf('/') - 1, 1)
  if (url.indexOf('Kangba') > -1) {
    index = 'Kangba'
  } else {
    index = 'SCTV' + index
  }
  if (url.indexOf('m3u8') > -1) {
    var m3u8 = 'http://m3u8.sctv.com/tvlive/' + index + '/index.m3u8'
    console.log('get m3u8 file:' + m3u8)
    var content = (await got.get(m3u8, {
      headers: headers
    }).on('error', err => { console.log(err) })).body
    var reg = /(.*).ts/ig
    var list = []
    while (result = reg.exec(content)) {
      list.push(result[0])
    }
    if (sctv_cache.length == 0) {
      sctv_cache = ['', '', '', '', '', '']
    }
    var cache_count = sctv_cache.length
    for (var i = list.length - 1; i >= 0; i--) {
      var ts = list[i]
      var cache_index = --cache_count
      if (cache_index < 0) {
        break;
      }
      var cache_ts = sctv_cache[cache_index]
      if (cache_ts && cache_ts > ts) {
        break;
      }
      sctv_cache[cache_index] = ts
    }

    var m3u8_str = '#EXTM3U\r\n#EXT-X-VERSION:3\r\n#EXT-X-TARGETDURATION:10\r\n'
    for (var i in sctv_cache) {
      var ts = sctv_cache[i]
      if (i == 0) {
        m3u8_str += '#EXT-X-MEDIA-SEQUENCE:' + ts.substr(ts.indexOf('-') + 1, ts.indexOf('.ts') - 2) + '\r\n'
      }
      m3u8_str += '#EXTINF:10.000, \r\n'
      m3u8_str += ts + '\r\n'
    }
    return res.end(m3u8_str)
  } else if (url.indexOf('.ts') > -1) {
    var file = url.substr(url.lastIndexOf('/') + 1)
    var ts_file_url = 'http://m3u8.sctv.com/tvlive/' + index + '/' + file
    console.log('get ts   file:' + ts_file_url)
    try {
      got.stream(ts_file_url, { headers: headers, retry: 3 }).on('error', err => { console.log(err) }).pipe(res);
    } catch (e) {
      console.error(e)
    }
    return
  }
}


/**
 * proxy cqtv hls
 * @param {*} req 
 * @param {*} res 
 */
async function cqtv(req, res) {
  var headers = {
    //'Referer': 'http://www.cbg.cn/1ive/',
    //'Referer': 'http://www.cbg.cn/live/index.shtml',
    'Referer': 'http://www.cbg.cn/live/Index.shtml,http://www.cbg.cn/live/lndex.shtml,http://www.cbg.cn/live/index.shtml',
    //'Referer': 'http://www.cbg.cn/live/lndex.shtml',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3610.2 Safari/537.36'
  };
  var url = req.url;

  var reg = /\/cqtv(\d+)\//
  var match = reg.exec(url)
  var index = url.substr(url.lastIndexOf('/') - 1, 1)
  if (match && match.length > 0) {
    index = match[1]
  }
  if (!cqtv_map[index]) {
    index = '1';
  }
  var map = cqtv_map[index]
  if (req.url.indexOf('m3u8') > 0) { //hls m3u8 file
    var m3u8 = 'http://app.cbg.cn/?app=activity&controller=wwsp&action=hlive_md5&callback=jQuery&ch=%2Fapp_2%2F_definst_%2Fls_' + index + '.stream%2Fchunklist.m3u8&_=' + new Date().valueOf();
    if (map.last_timestamp == -1 || new Date().valueOf() - map.last_timestamp > 1000 * 60) {
      var content = (await got.get(m3u8, {
        headers: headers
      }).on('error', err => { console.log(err) })).body;
      var url = content.replace(/.*jQuery\(\"/, '')
        .replace('\")', '')
        .replace(/\\/ig, '');
      map.m3u8_url = url
      map.last_timestamp = new Date().valueOf()
      map.ts_url_prefix = url.substr(0, url.lastIndexOf('/') + 1)
    }
    var body = (await got.get(map.m3u8_url, { headers: headers })).body
    console.log('body')
    body = body.replace('http://sjlivecdnx.cbg.cn/1ive/stream_' + index + '.php', 'stream_' + index + '.php')
    console.log('get m3u8 file:' + map.m3u8_url)
    return res.end(body)
  } else if (req.url.indexOf('stream') > 0) { //hls aes key file
    var stream_url = 'http://sjlivecdnx.cbg.cn/1ive/' + req.url.substr(req.url.lastIndexOf('/') + 1)
    console.log('get key  file:' + stream_url)
    got.stream(stream_url, { headers: headers }).pipe(res);
    return
  } else if (req.url.indexOf('media') > 0) { //hls ts file
    var ts_url = map.ts_url_prefix + req.url.substr(req.url.lastIndexOf('/') + 1)
    console.log('get ts   file:' + ts_url)
    got.stream(ts_url, { headers: headers, retry: 3 }).on('error', err => { console.log(err) }).pipe(res);
    return
  }
}

server.listen(5050);
console.log("listening on port 5050")