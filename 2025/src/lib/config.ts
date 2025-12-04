
import 'dotenv/config';

export const aocConfig = {
  debug: getEnvBool('AOC_DEBUG'),
} as const;

function getEnvBool(key: string): boolean {
  let val = process.env[key];
  if(val !== undefined && val.trim().toLowerCase() === 'true') {
    return true;
  }
  return false;
}
