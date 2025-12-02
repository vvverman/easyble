import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const TARGET_EMAIL = process.env.CLAIM_EMAIL || "vermosti@gmail.com"
const TARGET_NAME = process.env.CLAIM_NAME || "Owner"

async function main() {
  const user = await prisma.user.upsert({
    where: { email: TARGET_EMAIL },
    update: {},
    create: { email: TARGET_EMAIL, name: TARGET_NAME },
    select: { id: true, email: true },
  })

  const [teams, projects] = await Promise.all([
    prisma.team.updateMany({
      data: { ownerId: user.id },
    }),
    prisma.project.updateMany({
      data: { ownerId: user.id },
    }),
  ])

  console.log(
    `Assigned data to ${user.email}: teams=${teams.count}, projects=${projects.count}`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
