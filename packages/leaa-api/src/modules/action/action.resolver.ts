import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

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
    @Args() args: ActionsArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<ActionsWithPaginationObject | undefined> {
    return this.actionService.actions(args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('action.item-read')
  @Query(() => Action)
  async action(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ActionArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Action | undefined> {
    return this.actionService.action(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('action.item-create')
  @Mutation(() => Action)
  async createAction(@Args('action') args: CreateActionInput): Promise<Action | undefined> {
    return this.actionService.createAction(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('action.item-delete')
  @Mutation(() => Action)
  async deleteAction(@Args({ name: 'id', type: () => String }) id: string): Promise<Action | undefined> {
    return this.actionService.deleteAction(id);
  }
}
