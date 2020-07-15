importScripts("jimp.js")

let image_script = (logo_data_blob, image_data_blob) =>{
    const LOGO_MARGIN_PERCENTAGE = 30;
   
    const main = async () => {
        let logo_data = await logo_data_blob.arrayBuffer();
        let image_data = await image_data_blob.arrayBuffer();
        const [image, logo] = await Promise.all([
        Jimp.read(image_data),
        Jimp.read(logo_data)
        ]);
    
        logo.resize(image.bitmap.width, Jimp.AUTO);
    
        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    
        const X = 0;
        const Y = 0;
        // {
        //     mode: Jimp.BLEND_SCREEN,
        //     opacitySource: 0.1,
        //     opacityDest: 1
        // }

        return new Promise((resove, reject)=> image.composite(logo, X, Y, 
            (err,img,c)=> resove(img)
        ));
        };
  
    return main().then(image => image.getBuffer("image/jpeg", (err, res)=> {
        let dataUri = "data:" + Jimp.MIME_JPEG + ";base64,"  + res.toString('base64');
        return new Promise((resolve, reject)=> resolve(dataUri));
    }));
  }
  