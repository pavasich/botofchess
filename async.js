import http from 'http';

export default ({ host, path = '/', callback }) => {
  let _path = path[0] === '/' ? path : `/${path}`;
  return http.get({
    host,
    path: _path,
  }, (res) => {
    let body = '';

    res.on('data', (d) => {
      body += d;
    });

    res.on('end', () => {
      const parsed = JSON.parse(body);
      callback(parsed);
    });
  });
};
