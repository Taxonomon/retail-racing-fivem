import crypto from 'node:crypto';

function md5(data: any) {
  return crypto.createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
}

const hashUtils = { md5 };

export default hashUtils;
