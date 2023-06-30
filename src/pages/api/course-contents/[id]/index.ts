import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { courseContentValidationSchema } from 'validationSchema/course-contents';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.course_content
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCourseContentById();
    case 'PUT':
      return updateCourseContentById();
    case 'DELETE':
      return deleteCourseContentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCourseContentById() {
    const data = await prisma.course_content.findFirst(convertQueryToPrismaUtil(req.query, 'course_content'));
    return res.status(200).json(data);
  }

  async function updateCourseContentById() {
    await courseContentValidationSchema.validate(req.body);
    const data = await prisma.course_content.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCourseContentById() {
    const data = await prisma.course_content.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
