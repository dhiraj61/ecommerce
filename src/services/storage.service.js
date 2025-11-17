const ImageKit = require("imagekit");

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

const uploadImage = (file, fileName) => {
  const response = imageKit.upload({
    file: file,
    fileName: fileName,
    folder: "products",
  });
  return response;
};

module.exports = uploadImage;
