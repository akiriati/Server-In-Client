importScripts("jimp.js")

let image_script = (logo_data, image_data) =>{
  
    const LOGO_MARGIN_PERCENTAGE = 5;
    
    const main = async () => {
    const [image, logo] = await Promise.all([
      Jimp.read(logo_data),
      Jimp.read(image_data)
    ]);
  
    logo.resize(image.bitmap.width / 10, Jimp.AUTO);
  
    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  
    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;
  
    return image.composite(logo, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1,
        opacityDest: 1
      }
    ]);
    };
  
    return main().then(image => {
        console.log(image);
        return resolve(image)}
        );
  }
  