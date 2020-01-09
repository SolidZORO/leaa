import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Oauth } from '@leaa/common/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { IRequest, IResponse } from '@leaa/api/src/interfaces';

const CLS_NAME = 'OauthGithubService';

@Injectable()
export class OauthGithubService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Oauth) private readonly oauthRepository: Repository<Oauth>,
  ) {}

  async githubCallback(req: IRequest, res: IResponse): Promise<void | string> {
    console.log('githubCallback', req.headers.referer, req.user);

    // return 'githubCallback';

    res.redirect('http://localhost:7777/test-any?xxxxxxxxxxxx');
  }
}
