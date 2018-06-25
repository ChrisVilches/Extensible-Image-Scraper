const cheerio = require('cheerio');
const URI = require("uri-js");
const url = require('url');
const R = require('ramda');


class ImageScrapper{

  constructor(options){
    this.scrappers = [];
    this.nameToScrapperMap = {};
  }

  addScrapper(scrappers){

    if(!R.is(Array, scrappers)){
      scrappers = [scrappers];
    }

    scrappers.map(s => {
      if(R.isNil(s)) throw new Error("Scrapper null.");
      if(!R.is(Function, s.scrap)) throw new Error("Doesn't have 'scrap' method.");
      if(!R.is(String, s.name)) throw new Error("Doesn't have 'name' getter.");

      this.nameToScrapperMap[s.name] = s;
      this.scrappers.push(s);
    });

  }

  getScrapperDescription(name){
    return this.nameToScrapperMap[name].description;
  }

  getScrappersInfo(){

    let scrappers = [];

    this.scrappers.map(s => {
      scrappers.push({
        name: s.name,
        description: s.description || null
      });
    });

    return scrappers;
  }

  getImages(options){

    let result = {};
    let fullUrl = options.fullUrl;

    let scrappingOptions = {
      $: cheerio.load(options.body),
      fullUrl: options.fullUrl,
      uri: URI.parse(fullUrl)
    };

    for(let i=0; i<this.scrappers.length; i++){
      let key = this.scrappers[i].name;
      result[key] = this.scrappers[i].scrap(scrappingOptions);

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

module.exports = ImageScrapper;
