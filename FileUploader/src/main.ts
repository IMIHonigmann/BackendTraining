import express from "npm:express@5.0.1";
import Prisma from "@prisma/client"

const prisma = new Prisma.PrismaClient()

const app = express();

const PORT = Deno.env.get("PORT")
const env = Deno.env.get("NODE_ENV")

app.listen(PORT, () => {
  console.log(`Server running in ${env} mode at http://localhost:${PORT}`)
});

async function findUser() {
  return await prisma.user.findUnique({
    where: {
      id: 1
    }
  })

}

(async () => {
  try {
    const user = await findUser();
    console.log('Found user:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();