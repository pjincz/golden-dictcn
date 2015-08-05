#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');

var word = process.argv[2];

request('http://m.dict.cn/' + word, function(err, res, body) {
  if (err) {
    throw err;
  }
  $ = cheerio.load(body);
  $('script').each(function(i, e) {
    e = $(e);
    if (e.text().match('baidu') || e.text().match('_gaq')) {
      e.remove();
    } else if (e.attr('src') && e.attr('src').match('baidu')) {
      e.remove();
    }
  });
  $('header').remove();
  $('#dbann').parent().remove();
  $('#foot').remove();
  $('.adsbygoogle').parent().next().remove();
  $('.adsbygoogle').parent().remove();

  $('.dict-chart-map').remove();
  $('#dict-chart-basic').css('display', 'block');
  $('.dict-basic').parent().append($('.dict-basic'));
  $('head').append('<style>#dict-chart-basic{float:right} .dict-basic::after{content:" "; clear:both; display: block}</style>');
  console.log($.html());
});
