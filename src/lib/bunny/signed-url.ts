import crypto from 'crypto'

export function generateSignedUrl(videoId: string, libraryId: string): string {
  const cdnHostname = process.env.BUNNY_CDN_HOSTNAME!
  const signingKey = process.env.BUNNY_SIGNING_KEY!
  const expiresAt = Math.floor(Date.now() / 1000) + 4 * 60 * 60 // 4 години

  const hashableBase = `${signingKey}${videoId}${expiresAt}`
  const token = crypto
    .createHash('sha256')
    .update(hashableBase)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `https://${cdnHostname}/${libraryId}/${videoId}/playlist.m3u8?token=${token}&expires=${expiresAt}`
}
