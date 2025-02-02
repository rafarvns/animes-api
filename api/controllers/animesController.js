'use strict';

var cheerio = require('cheerio'),
    request = require('request'),
    settings = require('../settings'),
    reqOptions = require('../req-options');

exports.list_all = function(req, res) {
  var page = !isNaN(Number(req.params.page)) ? req.params.page : 1; 
  var url = settings.base_path+"/anime/"+page;
  var min = 500;
  request(url, reqOptions, function(error, response, body) {

    if( response.statusCode !== 200 || error ){
      res.json({
        "err" : error,
        "msg" : "Não foi possível carregar os animes."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = [];
    var $el = $('#wrapper .col-lg-3.col-md-4.col-sm-6.col-xs-12');
    
    $el.each(function(index, el){
      
 

      arr.push({


        'image' : $(el).find('.img-responsive').attr('src'),
        'slug' : $(el).find('.internalUrl').attr('href')
        
      });

    });

    res.json({
      'animes': arr
    });
  });
};



exports.episodes = function(req, res) {
  var slug = req.params.slug || "";
  var page = !isNaN(Number(req.params.page)) ? req.params.page : 1;
  var url = settings.base_path+"/anime/"+slug+"/page/"+page;
  var min = 12;

  console.log(url);

  request(url, reqOptions, function (error, response, body) {

    if( response.statusCode !== 200 || error ){
      res.json({
        "err" : error,
        "msg" : "Não foi possível carregar as informações."
      });
      return;
    }

    var $ = cheerio.load(body);
    var arr = null;
    
    var $el = $('.col-sm-6.col-md-4.col-lg-4 .well.well-sm');
    
    if($el.length){
      arr = [];
      $el.each(function(index, el){
        
        let obj = {
          'title': $(el).find('.video-title').text(),
          'key' : $(el).find('a').attr('href').split('/').filter(String).slice(-2).shift(),
          'slug' : $(el).find('a').attr('href').split('/').filter(String).slice(-1).pop(),
          'image' : $(el).find('.thumb-overlay img').attr('src'),
          'duration' : $(el).find('.duration').text().trim(),
          'has_hd' : !!$(el).find('.hd-text-icon').length

        };

    
        

        arr.push(obj);

      });
    }

    res.json({
      'length':$el.length ,
      'nextPage': $el.length < min ? false : Number(page)+1,
      'prevPage': Number(page) > 1 ? Number(page)-1 : false,
      'episodes': arr
    });
  });
};