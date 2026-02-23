import CryptoJS from 'crypto-js'
import { AE_CONFIG } from './config'

export interface SignedParams {
  [key: string]: string
}

export function signRequest(
  method: string,
  params: Record<string, string>,
  appKey: string,
  appSecret: string
): SignedParams {
  const timestamp = String(Date.now())

  const baseParams: Record<string, string> = {
    ...params,
    method,
    app_key: appKey,
    sign_method: AE_CONFIG.SIGN_METHOD,
    timestamp,
    v: AE_CONFIG.API_VERSION,
  }

  // Sort params alphabetically
  const sortedKeys = Object.keys(baseParams).sort()

  // Build signature string: concatenate key+value pairs
  let signStr = appSecret
  for (const key of sortedKeys) {
    signStr += key + baseParams[key]
  }
  signStr += appSecret

  const sign = CryptoJS.MD5(signStr).toString().toUpperCase()

  return { ...baseParams, sign }
}
