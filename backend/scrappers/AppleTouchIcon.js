class AppleTouchIcon{
  scrap(options){
    let $ = options.$;
    return $("link[rel='apple-touch-icon']").attr("href");
  }

  get name(){
    return "appleTouchIcon";
  }
}

module.exports = AppleTouchIcon;
