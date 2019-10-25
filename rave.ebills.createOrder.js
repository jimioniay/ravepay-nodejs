var morx = require('morx');
var q = require('q');


//This allows you create an Order for Ebills

var spec = morx
  .spec()
  .build('narration', 'required:false, eg:Ebill Payment')
  .build('numberofunits', 'required:true,validators:isNumeric, eg:1')
  .build('currency', 'required:true, eg:NGN') //Please pass only NGN as per documentation
  .build('amount', 'required:true,validators:isNumeric,eg:1000')
  .build('country', 'required:true,eg:NG')
  .build('phonenumber', 'required:false,eg:09384747474')
  .build('email', 'required:true,eg:example@abc.com')
  .build('txRef', 'required:required,eg:773838837373')
  .build('IP', 'required:false,eg:127.9.0.7')
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
        'flwv3-pug/getpaidx/api/ebills/generateorder',
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
