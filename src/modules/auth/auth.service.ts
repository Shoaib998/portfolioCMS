import prisma from "../../config/prisma";
import { comparePassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/jwt";
import { LoginBody } from "./auth.interface";

export const loginUser = async (payload: LoginBody) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been disabled");
  }

  const isPasswordMatched = await comparePassword(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    },
  };
};