'use strict';

var cheerio = require('cheerio'),
  request = require('request'),
  settings = require('../settings'),
  reqOptions = require('../req-options');


exports.detail = function (req, res) {
  var slug = req.params.slug || "";
  var url = settings.base_path + "/anime/" + slug;
  console.log(url);

  request(url, reqOptions, function (error, response, body) {

    if (response.statusCode !== 200 || error) {
      res.json({
        "err": error,
        "msg": "Não foi possível carregar as informações."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = null;
    console.log(body);
    

    arr = {

      'image': $('[property="og:image"]').attr('content'),
      'year': $('[itemprop="copyrightYear"]').text(),
      'episodes': $('[itemprop="numberofEpisodes"]').text(),
      'author': $('[itemprop="author"]').text(),
      'description': $('[itemprop="description"]').text().trim(),

    };
    console.log(arr)
    

    res.json({
      'length': $.length,
      'data': arr
    });



  });
};
