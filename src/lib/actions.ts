"use server";

/* 
NOTE: Nothing in this file is in use until Next server actions are out of alpha.
*/

import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma";

export async function submitEmail(email: string) {
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!validateEmail(email)) return;

  const upsertEmail = await prisma.emails.upsert({
    where: { email: email },
    update: { email: email },
    create: { id: uuidv4(), email: email },
  });

  console.log(upsertEmail);
}
