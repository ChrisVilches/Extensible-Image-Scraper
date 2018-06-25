class OgImage{
  scrap(options){
    let $ = options.$;
    return $("meta[property='og:image']").attr("content");
  }

  get name(){
    return "ogImage";
  }
}

module.exports = OgImage;
