#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var nopt = require('nopt');
var execFile = require('child_process').execFile;

var args = nopt({sound: Boolean, us: Boolean, uk: Boolean});

if (!args.us && !args.uk) {
  args.us = true;
}

var word = args.argv.remain[0];

function rearrange(body) {
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
}

function sound(body) {
  $ = cheerio.load(body);
  var e = $('.phonetic .sound')[args.us ? 1 : 0];
  var url = $(e).attr('naudio');
  if (!url.match('http://')) {
    url = 'http://audio.dict.cn/' + url;
  }
  execFile('/usr/bin/mplayer', [url]);
}

request('http://m.dict.cn/' + word, function(err, res, body) {
  if (err) {
    throw err;
  }
  if (args.sound) {
    sound(body);
  } else {
    rearrange(body);
  }
});
