class TwitterIcon{

  scrap(options){
    let $ = options.$;
    let uri = options.uri;
    let fullUrl = options.fullUrl;

    let search = "";

    if(uri.host === "twitter.com"){
      search = ".ProfileAvatar-image";
    } else if(uri.host === "mobile.twitter.com"){
      search = "img[src*='https://pbs.twimg.com/profile_images/']";
    } else {
      return null;
    }

    let img = $(search).first();
    if(!img) return null;

    return img.attr("src");
  }

  get name(){
    return "twitterIcon";
  }

  get description(){
    return "If the URL host is Twitter (desktop or mobile), it'll try to find the user's profile icon.";
  }

}

module.exports = TwitterIcon;
