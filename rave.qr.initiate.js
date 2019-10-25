var morx = require('morx');
var q = require('q');
var charge = require('./rave.charge');

//This allows you generate a QR code powered by Rave

var spec = morx
  .spec()
  .build('amount', 'required:true, alidators:isNumeric, eg:10000')
  .build('txRef', 'required:true, eg:m3s4m0c1526722407366')
  .build(
    'device_fingerprint',
    'required:false, eg:ada1d43c29279d9f743956edfb98d801',
  )
  .build('email', 'required:true,eg:example@abc.com')
  .build('meta', 'required:false')
  .build('IP', 'required:false,eg:127.9.0.7')
  .end();

function service(data, _rave) {
  var d = q.defer();
  q.fcall(() => {
    var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
    var params = validated.params;
    params.is_qr = 'qr';
    params.payment_type = 'pwc_qr';
    params.country = 'NG';
    return charge(params, _rave);
  })
    .then(resp => {
      d.resolve(resp);
    })
    .catch(err => {
      d.reject(err);
    });

  return d.promise;
}

service.morxspc = spec;
module.exports = service;
