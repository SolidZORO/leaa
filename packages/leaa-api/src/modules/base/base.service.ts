// import { Injectable } from '@nestjs/common';
// import { Repository, ObjectLiteral } from 'typeorm';
//
// import { formatUtil } from '@leaa/api/utils';
// import { GetCommonItemsArgsDto, ReturnCommonItemsObjectDto } from '@leaa/common/dtos/_common';
//
// @Injectable()
// export abstract class BaseService<Entity extends ObjectLiteral> {
//   protected constructor(private readonly repository: Repository<Entity>) {}
//
//   //
//   //
//   // base service C U R D
//   // ---------------
//   async findAll(args: GetCommonItemsArgsDto): Promise<ReturnCommonItemsObjectDto<Entity>> {
//     console.log('service C U R D / FIND-ALL \n\n');
//
//     const formatArgs = formatUtil.formatArgs(args);
//
//     const [items, total] = await this.repository.findAndCount(formatArgs);
//
//     return {
//       items,
//       total,
//       page: formatArgs.page || 1,
//       pageSize: formatArgs.pageSize || 30,
//     };
//   }
// }
