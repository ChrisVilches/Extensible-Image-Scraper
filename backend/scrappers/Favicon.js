class Favicon{
  scrap(options){
    let $ = options.$;
    return $("link[rel='shortcut icon']").attr("href");
  }

  get name(){
    return "favicon";
  }
}

module.exports = Favicon;
