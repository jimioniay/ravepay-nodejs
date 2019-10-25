var morx = require('morx');
var q = require('q');

var r = require('../lib/rave.base');
var R = new r(
  'FLWPUBK_TEST-0a9f81acd6729c8446a5a16ab1051f47-X',
  'FLWSECK_TEST-67a6f923caf41c603c6dbdb94f160152-X',
);

//This allows you verify a QR payment

var spec = morx
  .spec()
  .build('txref', 'required:false, eg:m3s5660c1526780007366')
  .build('flwref', 'required:false, eg:FLW050651572001280079')
  .end();

function service(data, _rave) {
  var d = q.defer();
  q.fcall(() => {
    var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
    var params = validated.params;
    _rave.params = params;
    if (!params.flwref || !params.txref)
      throw new Error('You must pass either flwref or txref');
    return _rave;
  })
    .then(_rave => {
      _rave.params.SECKEY = _rave.getSecretKey();
      return _rave.request('flwv3-pug/getpaidx/api/v2/verify', _rave.params);
    })
    .then(resp => {
      d.resolve(resp);
    })
    .catch(err => {
      d.reject(err);
    });

  return d.promise;
}

payload = {
  txRef: 'm3s4m0c1526722407366',
};

service(payload, R)
  .then((err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  })
  .catch(err => {
    console.log('Exception caught:::', err);
  });

service.morxspc = spec;
module.exports = service;
