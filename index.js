const http = require('http');
const got = require('got');

var ts_url_prefix = ''
var m3u8_url = ''
var last_timestamp = -1
var server = http.createServer(async function (req, res) {
  if (req.url.indexOf('/cqtv3') > -1) {
    try {
      await cqtv3(req, res);
    } catch (e) {
      console.log(e)
    }
  } else if (req.url.indexOf("/sctv4") > -1) {
    var headers = {
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Referer': 'http://www.sctv.com/live/video/SCTV4/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3610.2 Safari/537.36',
      "X-Requested-With": 'ShockwaveFlash/32.0.0.101'
    };
    var url = req.url;
    if (url.indexOf('m3u8') > -1) {
      var m3u8 = 'http://m3u8.sctv.com/tvlive/SCTV4/index.m3u8';
      var content = (await got.get(m3u8, {
        headers: headers
      })).body
      console.log('get m3u8 file:'+m3u8)
      return res.end(content)
    } else if (url.indexOf('.ts') > -1) {
      var file = url.substr(url.indexOf('2-'))
      var stream_3_url = 'http://m3u8.sctv.com/tvlive/SCTV4/' + file
      console.log('ts file:' + stream_3_url)
      got.stream(stream_3_url, { headers: headers }).pipe(res);
      return
    }
  } else {
    res.end('not found')
  }
});

async function cqtv3(req, res) {
  var headers = {
    'Referer': 'http://www.cbg.cn/1ive/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3610.2 Safari/537.36'
  };
  if (req.url.indexOf('m3u8') > 0) {
    var m3u8 = 'http://app.cbg.cn/?app=activity&controller=wwsp&action=hlive_md5&callback=jQuery&ch=%2Fapp_2%2F_definst_%2Fls_3.stream%2Fchunklist.m3u8&_=' + new Date().valueOf();

    if (last_timestamp == -1 || new Date().valueOf() - last_timestamp > 1000 * 60) {
      var content = (await got.get(m3u8, {
        headers: headers
      })).body;
      var url = content.replace(/.*jQuery\(\"/, '')
        .replace('\")', '')
        .replace(/\\/ig, '');
      m3u8_url = url
      last_timestamp = new Date().valueOf()
      ts_url_prefix = url.substr(0, url.lastIndexOf('/') + 1)
    }
    var body = (await got.get(m3u8_url, { headers: headers })).body
    body = body.replace('http://sjlivecdnx.cbg.cn/1ive/stream_3.php', 'stream_3.php')
    console.log('get m3u8 file:'+m3u8_url)
    return res.end(body)
  } else if (req.url.indexOf('stream') > 0) {
    var stream_3_url = 'http://sjlivecdnx.cbg.cn/1ive/' + req.url.substr(req.url.lastIndexOf('/'))
    console.log(stream_3_url)
    got.stream(stream_3_url, { headers: headers }).pipe(res);
    return
  } else if (req.url.indexOf('media') > 0) {
    var ts_url = ts_url_prefix + req.url.substr(req.url.lastIndexOf('/'))
    console.log('ts_url:', ts_url)
    got.stream(ts_url, { headers: headers }).pipe(res);
    return
  }
}

console.log("listening on port 5050")
server.listen(5050);