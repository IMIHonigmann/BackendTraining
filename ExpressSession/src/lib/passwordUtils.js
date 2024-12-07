import bcrypt from "bcryptjs";

export async function genPasswordSafe(password) {
  const saltRounds = 11; // 10 Industry Standard, 11 still good, 12 >250ms too high
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return {
      salt: saltRounds,
      hashedPassword,
    };
  } catch (err) {
    throw err;
  }
}
