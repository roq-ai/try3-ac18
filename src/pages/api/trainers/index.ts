import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainerValidationSchema } from 'validationSchema/trainers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainers();
    case 'POST':
      return createTrainer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainers() {
    const data = await prisma.trainer
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'trainer'));
    return res.status(200).json(data);
  }

  async function createTrainer() {
    await trainerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.course_content?.length > 0) {
      const create_course_content = body.course_content;
      body.course_content = {
        create: create_course_content,
      };
    } else {
      delete body.course_content;
    }
    if (body?.exercise?.length > 0) {
      const create_exercise = body.exercise;
      body.exercise = {
        create: create_exercise,
      };
    } else {
      delete body.exercise;
    }
    if (body?.quiz?.length > 0) {
      const create_quiz = body.quiz;
      body.quiz = {
        create: create_quiz,
      };
    } else {
      delete body.quiz;
    }
    if (body?.use_case?.length > 0) {
      const create_use_case = body.use_case;
      body.use_case = {
        create: create_use_case,
      };
    } else {
      delete body.use_case;
    }
    const data = await prisma.trainer.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
