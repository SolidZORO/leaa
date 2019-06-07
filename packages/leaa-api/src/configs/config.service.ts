import Joi from 'joi';
import dotenv from 'dotenv';
import fs from 'fs';

export interface IEnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(path: string) {
    const config = dotenv.parse(fs.readFileSync(path));

    this.envConfig = this.validate(config);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  private validate(envConfig: IEnvConfig): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      PROTOCOL: Joi.string().valid(['http', 'https']),
      PORT: Joi.number().default(3000),
      BASE_HOST: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }
}
