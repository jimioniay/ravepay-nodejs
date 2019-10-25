var morx = require('morx');
var q = require('q');

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


service.morxspc = spec;
module.exports = service;
