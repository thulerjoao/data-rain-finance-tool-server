import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { BudgetRequestEntity } from '../entities/budget-request.entity';
import { DbCreateBudgetRequestProps } from '../protocols/props/db-create-budget-request.props';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';

@Injectable()
export class BudgetRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBudgetRequest(
    props: DbCreateBudgetRequestProps,
  ): Promise<BudgetRequestEntity> {
    const data: Prisma.BudgetRequestCreateInput = {
      id: props.id,
      status: props.status,
      amount: props.amount,
      totalHours: props.totalHours,
      client: {
        connect: {
          id: props.clientId,
        },
      },
    };
    const budgetRequestCreated = await this.prisma.budgetRequest
      .create({
        data,
      })
      .catch(serverError);

    return budgetRequestCreated;
  }

  async createClientResponses(
    props: DbCreateClientResponsesProps[],
  ): Promise<void> {
    const data: Prisma.Enumerable<Prisma.ClientsResponsesCreateManyInput> =
      props.map((response) => ({ ...response }));
    await this.prisma.clientsResponses.createMany({ data }).catch(serverError);
  }
}