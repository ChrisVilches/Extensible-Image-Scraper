# Extensible Image Scrapper

## How to run

Run a minio docker:

```bash
docker run -p 9000:9000 --name minio1 -v /mnt/data:/data -v /mnt/config:/root/.minio minio/minio server /data
```

No need to download anything, as this command will do so automatically and it'll then start Minio on port 9000.

Install each app:

```bash
npm install
```

Start the backend app (by default `localhost:3000`):

```bash
# These keys are printed on the console when you run a minio Docker container
export minioAccessKey=15NTOWZG8EKEDSW7J6UW
export minioSecretKey=FEC9qsLIYhKDT7Shns7NY8uImRVBsMqNJO5tBdVr
npm start
```

Start the frontend (`localhost:8080`):

```
npm start
```


## Examples

### Example 1

```
localhost:3000/?url=https://twitter.com/aamir_khan
```

↓↓

```json

{
  "appleTouchIcon": "https://abs.twimg.com/icons/apple-touch-icon-192x192.png",
  "allImages": [
    "https://pbs.twimg.com/profile_banners/88856792/1479290034/1500x500",
    "https://pbs.twimg.com/profile_images/798826399725297664/4awXtggx_400x400.jpg",
    "https://pbs.twimg.com/profile_images/798826399725297664/4awXtggx_normal.jpg",
    "https://pbs.twimg.com/profile_images/798826399725297664/4awXtggx_bigger.jpg",
    "https://pbs.twimg.com/media/DfJBh8VX4Ac5Zak.jpg",
    "https://pbs.twimg.com/media/Deb6oI3W4AALui2.jpg",
    "https://pbs.twimg.com/media/Deb6zzcW4AAuEZ3.jpg",
    "https://pbs.twimg.com/media/Deb60rlXUAAorjE.jpg",
    "https://pbs.twimg.com/media/Deb61amX0AIzrvv.jpg",
    "https://abs.twimg.com/emoji/v2/72x72/2764.png",
    "https://pbs.twimg.com/media/DcG4Sd4X0AEEBzE.jpg",
    "https://pbs.twimg.com/media/Db9Qa7cXUAES2Wd.jpg"
  ],
  "twitterIcon": "https://pbs.twimg.com/profile_images/798826399725297664/4awXtggx_400x400.jpg",
  "favicon": "https://abs.twimg.com/favicons/favicon.ico"
}
```


### Example 2 (persist into minio)

When you add the `save` query param with a `true` value, it will choose the image it thinks
represents the website best (using some algorithm I've probably not even implemented yet),
and it will save that image into minio and return its key to the client.

```
localhost:3000/?url=https://twitter.com/aamir_khan&save=true
```

↓↓

```json
{
  "imageUrl": "http://localhost:3000/img/2018624829333.jpg",
  "etag": "3758470345ff768aaaa27ea5892039c3"
}
```

The image will be available at the given URL `http://localhost:3000/img/2018624829333.jpg`.

## To do

* Convert `.ico` files to `.jpg` in case the selected image is an `.ico` file.
* Turn hardcoded things into config files.
