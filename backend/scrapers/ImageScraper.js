const cheerio = require('cheerio');
const URI = require("uri-js");
const url = require('url');
const R = require('ramda');


class ImageScraper{

  constructor(options){
    this.scrapers = [];
    this.nameToScraperMap = {};
  }

  addScraper(scrapers){

    if(!R.is(Array, scrapers)){
      scrapers = [scrapers];
    }

    scrapers.map(s => {
      if(R.isNil(s)) throw new Error("Scraper null.");
      if(!R.is(Function, s.scrap)) throw new Error("Doesn't have 'scrap' method.");
      if(!R.is(String, s.name)) throw new Error("Doesn't have 'name' getter.");

      this.nameToScraperMap[s.name] = s;
      this.scrapers.push(s);
    });

  }

  getScraperDescription(name){
    return this.nameToScraperMap[name].description;
  }

  getScrapersInfo(){

    let scrapers = [];

    this.scrapers.map(s => {
      scrapers.push({
        name: s.name,
        description: s.description || null
      });
    });

    return scrapers;
  }

  getImages(options){

    let result = {};
    let fullUrl = options.fullUrl;

    let scrappingOptions = {
      $: cheerio.load(options.body),
      fullUrl: options.fullUrl,
      uri: URI.parse(fullUrl)
    };

    for(let i=0; i<this.scrapers.length; i++){
      let key = this.scrapers[i].name;
      result[key] = this.scrapers[i].scrap(scrappingOptions);

      if(R.is(String, result[key])){
        result[key] = url.resolve(fullUrl, result[key]);

      }

      else if(R.is(Array, result[key])){
        for(let j=0; j<result[key].length; j++){
          result[key][j] = url.resolve(fullUrl, result[key][j]);
        }
      }

    }

    return R.reject(el => R.or(R.isEmpty(el), R.isNil(el)))(result);
  }
}

module.exports = ImageScraper;
