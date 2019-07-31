interface IEnvConfig {
  NODE_ENV: 'production' | 'development';
  SITE_NAME: string;
}

const envDataEl = document.getElementById('__ENV_DATA__');

export const envConfig: IEnvConfig = envDataEl
  ? JSON.parse(envDataEl.innerHTML)
  : {
      NODE_ENV: 'development',
      SITE_NAME: '-',
    };
