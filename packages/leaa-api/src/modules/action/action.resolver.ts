import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Action } from '@leaa/common/src/entrys';
import { ActionsArgs, ActionsWithPaginationObject, ActionArgs, CreateActionInput } from '@leaa/common/src/dtos/action';
import { ActionService } from '@leaa/api/src/modules/action/action.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Action)
export class ActionResolver {
  constructor(private readonly actionService: ActionService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions('action.list-read')
  @Query(() => ActionsWithPaginationObject)
  async actions(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: ActionsArgs,
  ): Promise<ActionsWithPaginationObject | undefined> {
    return this.actionService.actions(gqlCtx, args);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('action.item-read')
  @Query(() => Action, { nullable: true })
  async action(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ActionArgs,
  ): Promise<Action | undefined> {
    return this.actionService.action(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('action.item-create')
  @Mutation(() => Action)
  async createAction(@GqlCtx() gqlCtx: IGqlCtx, @Args('action') args: CreateActionInput): Promise<Action | undefined> {
    return this.actionService.createAction(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('action.item-delete')
  @Mutation(() => Action)
  async deleteAction(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Action | undefined> {
    return this.actionService.deleteAction(gqlCtx, id);
  }
}
