import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/entrys';
import { GetUsersArgsDto, GetUsersObjectDto } from '@leaa/common/dtos/user';
import { formatUtil } from '@leaa/api/utils';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getUsers(args: GetUsersArgsDto): Promise<GetUsersObjectDto> {
    const formatArgs = formatUtil.formatArgs(args);
    const [items, total] = await this.userRepository.findAndCount(formatArgs);

    return {
      items,
      total,
      page: formatArgs.page || 1,
      pageSize: formatArgs.pageSize || 30,
    };
  }
}
