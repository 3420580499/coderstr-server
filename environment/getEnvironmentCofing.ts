import { parse } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
const is_env = process.env.NODE_ENV === 'development';

export default function getEnvConfig() {
  let info = 'dev';
  if (!is_env) {
    info = 'prod';
  }
  const file = fs.readFileSync(
    path.resolve(__dirname, `../../application.${info}.yml`),
    'utf-8',
  );
  const envConfig = parse(file) as Record<string, any>;
  return envConfig;
}

// import * as yaml from 'js-yaml';
// import { readFileSync } from 'fs';
// import { resolve } from 'path';
// // 判断是否是开发环境
// const is_env = process.env.NODE_ENV === 'development';

// function getEnvConfig() {
//   let info = 'dev';
//   if (!is_env) {
//     info = 'prod';
//   }
//   return yaml.load(
//     readFileSync(resolve(__dirname, `../../application.${info}.yml`), 'utf8'),
//   ) as Record<string, any>;
// }
// export default getEnvConfig;
