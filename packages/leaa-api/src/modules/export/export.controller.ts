import { Controller, Get, Post, Request, Response, Body, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@leaa/api/src/guards';
import { IRequest, IResponse, IArticlesArgs, IPromosArgs } from '@leaa/api/src/interfaces';

import { ExportService } from './export.service';

@Controller('/export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('')
  async test() {
    return '<code>-- NOT FOUND EXPORT --</code>';
  }

  @Get('/hi')
  async hi() {
    return this.exportService.hi();
  }

  @Post('/promo')
  @UseGuards(JwtGuard)
  async exportPromo(@Body() args: IPromosArgs, @Request() req: IRequest, @Response() res: IResponse) {
    return this.exportService.exportPromo(args, req, res);
  }

  @Post('/article')
  @UseGuards(JwtGuard)
  async exportArticle(@Body() args: IArticlesArgs, @Request() req: IRequest, @Response() res: IResponse) {
    return this.exportService.exportArticle(args, req, res);
  }
}
