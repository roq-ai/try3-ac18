import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { useCaseValidationSchema } from 'validationSchema/use-cases';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUseCases();
    case 'POST':
      return createUseCase();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUseCases() {
    const data = await prisma.use_case
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'use_case'));
    return res.status(200).json(data);
  }

  async function createUseCase() {
    await useCaseValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.use_case.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
