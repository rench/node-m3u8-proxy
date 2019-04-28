node-m3u8-proxy is a node package to proxy hls stream,depending on your needs, you can run node package on routers, development boards, personal computers and other devices that can run nodes.

the functions currently implemented are as follows
1. fetch orignal m3u8 file data
2. proxy ts file data with customizing http headers

# Installation & Run
```
git clone https://github.com/rench/node-m3u8-proxy.git
npm i --verbose
node index.js
```
# Global Installation
```
npm i m3u8-proxy --g
node-m3u8-proxy
```

> If your device does not have NPM commands, you can copy node_modules to your device after installing the dependencies on the device that can run NPM commands.

# Address and Channel Menu After Proxy
```
四川卫视HD,http://localhost:5050/sctv0/index.m3u8
四川文化HD,http://localhost:5050/sctv2/index.m3u8
四川经济HD,http://localhost:5050/sctv3/index.m3u8
四川新闻,http://localhost:5050/sctv4/index.m3u8
四川影视HD,http://localhost:5050/sctv5/index.m3u8
四川星空,http://localhost:5050/sctv6/index.m3u8
四川妇女,http://localhost:5050/sctv7/index.m3u8
四川科教,http://localhost:5050/sctv8/index.m3u8
四川公共,http://localhost:5050/sctv9/index.m3u8
康巴卫视,http://localhost:5050/Kangba/index.m3u8
成都新闻,http://localhost:5050/cdtv1/index.flv
成都经济,http://localhost:5050/cdtv2/index.flv
成都都市,http://localhost:5050/cdtv3/index.flv
成都影视,http://localhost:5050/cdtv4/index.flv
成都公共,http://localhost:5050/cdtv5/index.flv
成都少儿,http://localhost:5050/cdtv6/index.flv

成都新闻,http://localhost:5050/cdtv1/index.m3u8
成都经济,http://localhost:5050/cdtv2/index.m3u8
成都都市,http://localhost:5050/cdtv3/index.m3u8
成都影视,http://localhost:5050/cdtv4/index.m3u8
成都公共,http://localhost:5050/cdtv5/index.m3u8
成都少儿,http://localhost:5050/cdtv6/index.m3u8

重庆卫视,http://localhost:5050/cqtv1/index.m3u8
重庆新闻,http://localhost:5050/cqtv3/index.m3u8
重庆睛彩,http://localhost:5050/cqtv4/index.m3u8
重庆汽摩,http://localhost:5050/cqtv5/index.m3u8
重庆影视,http://localhost:5050/cqtv6/index.m3u8
重庆科教,http://localhost:5050/cqtv9/index.m3u8
重庆都市,http://localhost:5050/cqtv10/index.m3u8
重庆娱乐,http://localhost:5050/cqtv11/index.m3u8
重庆生活,http://localhost:5050/cqtv12/index.m3u8
重庆国际,http://localhost:5050/cqtv13/index.m3u8
重庆时尚,http://localhost:5050/cqtv17/index.m3u8
重庆移动,http://localhost:5050/cqtv16/index.m3u8
重庆农村,http://localhost:5050/cqtv18/index.m3u8
重庆少儿,http://localhost:5050/cqtv19/index.m3u8
重庆手持,http://localhost:5050/cqtv20/index.m3u8
```
> Replace the `localhost` string above with the actual IP address of your device

# Change Logs
- 2019-4-28 fix cqtv referer header(0.0.9)
- 2019-4-16 fix sctv referer header,support cdtv m3u8(0.0.8)
- 2019-2-12 fix bug,hand error
- 2019-2-11 change cdtv proxy channel suffix,cache sctv proxy channel latest three ts file(0.0.6)
- 2019-1-8 add cqtv/sctv/cdtv(0.0.1)