import { parse } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
// 判断是否是开发环境
const is_env = process.env.NODE_ENV === 'development';

function getEnvConfig() {
  let info = 'dev';
  if (!is_env) {
    info = 'prod';
  }
  const file = fs.readFileSync(
    path.resolve(__dirname, `../../application.${info}.yml`),
    'utf-8',
  );
  const envConfig = parse(file);
  return envConfig;
}
export default getEnvConfig();
