import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Locations
  await prisma.location.upsert({
    where: { slug: 'colombo' },
    update: {},
    create: { name: 'Colombo', slug: 'colombo' },
  });

  await prisma.location.upsert({
    where: { slug: 'kandy' },
    update: {},
    create: { name: 'Kandy', slug: 'kandy' },
  });

  await prisma.location.upsert({
    where: { slug: 'galle' },
    update: {},
    create: { name: 'Galle', slug: 'galle' },
  });

  // 2. Seed Parent Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics' },
  });

  const vehicles = await prisma.category.upsert({
    where: { slug: 'vehicles' },
    update: {},
    create: { name: 'Vehicles', slug: 'vehicles' },
  });

  // 3. Seed Subcategories
  await prisma.category.upsert({
    where: { slug: 'mobile-phones' },
    update: {},
    create: {
      name: 'Mobile Phones',
      slug: 'mobile-phones',
      parentId: electronics.id,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'cars' },
    update: {},
    create: {
      name: 'Cars',
      slug: 'cars',
      parentId: vehicles.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });