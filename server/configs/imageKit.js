import ImageKit from 'imagekit';

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy',
});


export default imageKit;
