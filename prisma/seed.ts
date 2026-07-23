import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  //clear existing data
  await prisma.adImage.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();

  //add main cat
  const vehicles = await prisma.category.create({
    data: { name: "Vehicles", slug: "vehicles" },
  });

  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics" },
  });

  const property = await prisma.category.create({
    data: { name: "Property", slug: "property" },
  });

  //add sub cat
  await prisma.category.createMany({
    data: [
      { name: "Cars", slug: "cars", parentId: vehicles.id },
      { name: "Motorbikes", slug: "motorbikes", parentId: vehicles.id },
      { name: "Mobile Phones", slug: "mobile-phones", parentId: electronics.id },
      { name: "Laptops", slug: "laptops", parentId: electronics.id },
    ],
  });

  //add locations
  await prisma.location.createMany({
    data: [
      { name: "Colombo", slug: "colombo" },
      { name: "Kandy", slug: "kandy" },
      { name: "Galle", slug: "galle" },
      { name: "Gampaha", slug: "gampaha" },
      { name: "Kurunegala", slug: "kurunegala" },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });