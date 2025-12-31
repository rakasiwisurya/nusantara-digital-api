import { Request, Response } from "express";
import Joi from "joi";
import { prisma } from "../db/prisma";
import {
  responseBadRequest,
  responseInternalServerError,
  responseSuccess,
} from "../libs/response";
import { employeeQueue } from "../queues/employee";

export const addEmployee = async (req: Request, res: Response) => {
  const { name, age, position, salary } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    position: Joi.string().required(),
    salary: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return responseBadRequest(res, error.details[0].message);

  try {
    await prisma.$transaction(async (prisma) => {
      const employee = await prisma.employee.create({
        data: {
          name,
          age,
          position,
          salary,
        },
      });

      await employeeQueue.add("created", { employeeId: employee.id });

      responseSuccess(res, "Success add new data", { id: employee.id });
    });
  } catch (error) {
    responseInternalServerError(res, error);
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  const { current_page = 1, limit } = req.query;

  const schema = Joi.object({
    current_page: Joi.number().optional(),
    limit: Joi.number().optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) return responseBadRequest(res, error.details[0].message);

  const offset = (+current_page - 1) * (limit ? +limit : 0);

  try {
    const totalRecord = await prisma.employee.count();

    const employeesData = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        position: true,
        salary: true,
      },
      orderBy: {
        created_at: "desc",
      },
      skip: offset,
      take: limit ? +limit : undefined,
    });

    const newLimit = limit ? +limit : totalRecord;
    const startIndex = (+current_page - 1) * newLimit;
    const endIndex = +current_page * newLimit;
    const hasNext = endIndex < totalRecord ? true : false;
    const hasPrev = startIndex > 0 ? true : false;

    responseSuccess(res, "Success get data", {
      current_page: +current_page,
      total_record: totalRecord,
      has_next: hasNext,
      has_prev: hasPrev,
      records: employeesData,
    });
  } catch (error) {
    responseInternalServerError(res, error);
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);

  if (error) return responseBadRequest(res, error.details[0].message);

  try {
    const employeeData = await prisma.employee.findUnique({
      select: {
        id: true,
        name: true,
        age: true,
        position: true,
        salary: true,
      },
      where: { id },
    });

    if (!employeeData) return responseBadRequest(res, "Data not found");

    responseSuccess(res, "Success get detail data", employeeData);
  } catch (error) {
    responseInternalServerError(res, error);
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, position, salary } = req.body;

  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().required(),
    position: Joi.string().required(),
    salary: Joi.number().required(),
  });

  const { error } = schema.validate({ ...req.params, ...req.body });

  if (error) return responseBadRequest(res, error.details[0].message);

  try {
    await prisma.$transaction(async (prisma) => {
      const employeeData = await prisma.employee.findUnique({
        select: { id: true },
        where: { id },
      });

      if (!employeeData) return responseBadRequest(res, "Data not found");

      await prisma.employee.update({
        data: {
          name,
          age,
          position,
          salary,
        },
        where: { id },
      });

      responseSuccess(res, "Success update data", null);
    });
  } catch (error) {
    responseInternalServerError(res, error);
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate({ ...req.params, ...req.body });

  if (error) return responseBadRequest(res, error.details[0].message);

  try {
    await prisma.$transaction(async (prisma) => {
      const employeeData = await prisma.employee.findUnique({
        select: { id: true },
        where: { id },
      });

      if (!employeeData) return responseBadRequest(res, "Data not found");

      await prisma.employee.delete({
        where: { id },
      });

      responseSuccess(res, "Success delete data", null);
    });
  } catch (error) {
    responseInternalServerError(res, error);
  }
};
