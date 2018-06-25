class AllImages{

  scrap(options){

    let $ = options.$;
    let fullUrl = options.fullUrl;

    let allImages = {};
    $("img").each((i, img) => {
      let src = $(img).attr("src");

      if(!src) return;
      src = src.trim();

      if(src.length === 0) return;

      allImages[src] = true;
    });

    return Object.keys(allImages);
  }

  get name(){
    return "allImages";
  }

  get description(){
    return "Returns an array with all images found.";
  }

}

module.exports = AllImages;
