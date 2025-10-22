import ImageKit from '@imagekit/nodejs';

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
});


export default imageKit;
