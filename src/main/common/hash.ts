import crypto from 'node:crypto';

export function hashWithMd5(data: any) {
  return crypto.createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
}
