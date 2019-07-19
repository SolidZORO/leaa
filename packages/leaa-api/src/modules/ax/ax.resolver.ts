import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Ax } from '@leaa/common/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/dtos/ax';
import { AxService } from './ax.service';

@Resolver(() => Ax)
export class AxResolver {
  constructor(private readonly axService: AxService) {}

  @Query(() => AxsWithPaginationObject)
  async axs(@Args() args: AxsArgs): Promise<AxsWithPaginationObject | undefined> {
    return this.axService.axs(args);
  }

  @Query(() => Ax)
  async ax(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: AxArgs): Promise<Ax | undefined> {
    return this.axService.ax(id, args);
  }

  @Mutation(() => Ax)
  async createAx(@Args('ax') args: CreateAxInput): Promise<Ax | undefined> {
    return this.axService.craeteAx(args);
  }

  @Mutation(() => Ax)
  async updateAx(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('ax') args: UpdateAxInput,
  ): Promise<Ax | undefined> {
    return this.axService.updateAx(id, args);
  }

  @Mutation(() => Ax)
  async deleteAx(@Args({ name: 'id', type: () => Int }) id: number): Promise<Ax | undefined> {
    return this.axService.deleteAx(id);
  }
}
