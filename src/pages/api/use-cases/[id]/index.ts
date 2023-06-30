import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { useCaseValidationSchema } from 'validationSchema/use-cases';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.use_case
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUseCaseById();
    case 'PUT':
      return updateUseCaseById();
    case 'DELETE':
      return deleteUseCaseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUseCaseById() {
    const data = await prisma.use_case.findFirst(convertQueryToPrismaUtil(req.query, 'use_case'));
    return res.status(200).json(data);
  }

  async function updateUseCaseById() {
    await useCaseValidationSchema.validate(req.body);
    const data = await prisma.use_case.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteUseCaseById() {
    const data = await prisma.use_case.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
