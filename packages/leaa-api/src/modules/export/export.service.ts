import moment from 'moment';
import xlsx from 'node-xlsx';
import { Injectable, Request, Response, Body } from '@nestjs/common';

import { IRequest, IResponse, IArticleArgs, IPromosArgs } from '@leaa/api/src/interfaces';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { getGqlCtxFromReq } from '@leaa/api/src/utils';

const CLS_NAME = 'ExportService';

const EXCEL_TYPE = 'application/vnd.openxmlformats';
const FILENAME_TIME = moment().format('YYYYMMDD-HHmmss');
const PAGE_SIZE = 9999999999;

@Injectable()
export class ExportService {
  constructor(private readonly articleService: ArticleService, private readonly promoService: PromoService) {}

  hi() {
    return `Hi, ${CLS_NAME}.`;
  }

  async exportPromo(@Body() args: IPromosArgs, @Request() req: IRequest, @Response() res: IResponse) {
    const filenamePrefix = 'promo';

    const gqlCtx = getGqlCtxFromReq(req);
    const promos = await this.promoService.promos({ ...args, pageSize: PAGE_SIZE }, gqlCtx);

    const dataTitle = ['Name', 'Amount'];
    const dataBody = promos.items.map((i) => [i.name, i.amount]);

    const buffer = xlsx.build([
      {
        name: filenamePrefix,
        data: [dataTitle, ...dataBody],
      },
    ]);

    res
      .type(EXCEL_TYPE)
      .set('Content-Disposition', `attachment; filename=${filenamePrefix}-${FILENAME_TIME}.xlsx`)
      .end(buffer, 'binary');

    return res;
  }

  async exportArticle(@Body() args: IArticleArgs, @Request() req: IRequest, @Response() res: IResponse) {
    const filenamePrefix = 'article';

    const gqlCtx = getGqlCtxFromReq(req);
    const articles = await this.articleService.articles({ ...args, pageSize: PAGE_SIZE }, gqlCtx);

    const options = { '!cols': [{ wch: 12 }, { wch: 24 }, { wch: 50 }] };
    const dataTitle = ['ID', 'Title', 'Slug'];
    const dataBody = articles.items.map((i) => [i.id, i.title, i.slug]);

    const buffer = xlsx.build(
      [
        {
          name: filenamePrefix,
          data: [dataTitle, ...dataBody],
        },
      ],
      options,
    );

    res
      .type(EXCEL_TYPE)
      .set('Content-Disposition', `attachment; filename=${filenamePrefix}-${FILENAME_TIME}.xlsx`)
      .end(buffer, 'binary');

    return res;
  }
}
