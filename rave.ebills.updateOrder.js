var morx = require('morx');
var q = require('q');

//This allows you create an Order for Ebills

var spec = morx
  .spec()
  .build('reference', 'required:true, eg:RVEBLS-9D7EFD86ABA6-77932') //Reference returned create Order
  .build('amount', 'required:true,validators:isNumeric, eg:1000')
  .build('currency', 'required:false, eg:NGN') //Please pass only NGN as per documentation
  .end();

function service(data, _rave) {
  var d = q.defer();
  q.fcall(() => {
    var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
    var params = validated.params;
    _rave.params = params;
    return _rave;
  })
    .then(_rave => {
      _rave.params.SECKEY = _rave.getSecretKey();
      return _rave.request(
        'flwv3-pug/getpaidx/api/ebills/update',
        _rave.params,
      );
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
