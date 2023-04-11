import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// total companies to create
const COMPANIES_TO_CREATE = 50;

// total categories to create (max of 22)
const CATEGORIES_TO_CREATE = 22;

// products per company to create
const PRODUCTS_TO_CREATE = 20;

// quantity min/max per product
const PRODUCT_QUANTITY_MIN = 0;
const PRODUCT_QUANTITY_MAX = 420;

// total users to create
const USERS_TO_CREATE = 100;

/**
 * reviews per product to create
 *
 * a user can only review a product once.
 * use the below formula to see the max number you can put.
 *
 * (PRODUCTS_TO_CREATE * COMPANIES_TO_CREATE) / USERS_TO_CREATE
 */
const REVIEWS_TO_CREATE_MIN = 0;
const REVIEWS_TO_CREATE_MAX = 10;

function getRandomDate() {
  const today = new Date().toISOString();
  return faker.date.between("2022-01-01T00:00:00.000Z", today);
}

function getRandomRating() {
  let randomRating = Math.round(Math.random() * 5);

  if (randomRating < 1) randomRating += 1;

  return randomRating;
}

function getRandomBody() {
  const randomNum = Math.round(Math.random() * 3);

  if (randomNum >= 2) return null;

  return faker.lorem.paragraphs();
}

function getCategoryImage(category: string) {
  return faker.image.imageUrl(undefined, undefined, category, true);
}

async function createCategories() {
  const categories: string[] = [];
  create(CATEGORIES_TO_CREATE);

  function create(toCreate: number): void {
    if (toCreate <= 0) return;

    const category = faker.commerce.department();
    if (categories.includes(category)) return create(toCreate);

    categories.push(category);
    return create(toCreate - 1);
  }

  for (const category of categories) {
    await prisma.category.create({ data: { name: category } });
  }
}

async function run() {
  // create companies
  const companyData = Array.from({ length: COMPANIES_TO_CREATE }).map(() => ({
    name: faker.company.name(),
    location: faker.address.country(),
    about: faker.company.catchPhrase(),
  }));

  console.log("creating companies...");

  await prisma.company.createMany({ data: companyData });

  // create categories
  console.log("creating categories...");

  await createCategories();

  // create products for each company
  console.log("creating products...");

  const categories = await prisma.category.findMany();

  function getRandomCategory(index: number): { name: string; id: string } {
    const category = categories[index];

    if (!category) return getRandomCategory(index - 1);

    return { name: category.name, id: category.id };
  }

  const companies = await prisma.company.findMany();

  for (const company of companies) {
    const index = companies.indexOf(company);

    const products = Array.from({ length: PRODUCTS_TO_CREATE }).map(() => {
      const { name: category, id: categoryId } = getRandomCategory(index);
      const imageURL = getCategoryImage(category);

      return prisma.product.create({
        data: {
          name: faker.commerce.product(),
          price: parseFloat(faker.commerce.price()),
          quantity: faker.datatype.number({
            min: PRODUCT_QUANTITY_MIN,
            max: PRODUCT_QUANTITY_MAX,
          }),
          description: faker.commerce.productDescription(),
          companyId: company.id,
          categories: { connect: { id: categoryId } },
          images: { create: { url: imageURL } },
          createdAt: getRandomDate(),
        },
      });
    });
    await prisma.$transaction(products);
  }

  // create users
  console.log("creating users...");

  const userData = Array.from({ length: USERS_TO_CREATE }).map(() => ({
    email: faker.internet.email(),
    name: faker.name.fullName(),
    image: faker.internet.avatar(),
  }));

  await prisma.user.createMany({ data: userData });

  const users = await prisma.user.findMany({ select: { id: true } });

  // create product reviews
  console.log("creating product reviews...");

  async function getRandomUser(index: number): Promise<string> {
    const user = users[index];

    if (!user) return getRandomUser(index - 1);

    return user.id;
  }

  const products = await prisma.product.findMany({ select: { id: true } });

  for (const product of products) {
    const randomAmountOfReviews = Math.floor(
      Math.random() * (REVIEWS_TO_CREATE_MAX - REVIEWS_TO_CREATE_MIN) +
        REVIEWS_TO_CREATE_MIN
    );

    for (let i = 0; i < randomAmountOfReviews; i++) {
      const userId = await getRandomUser(i);
      await prisma.review.create({
        data: {
          userId,
          productId: product.id,
          rating: getRandomRating(),
          body: getRandomBody(),
          createdAt: getRandomDate(),
        },
      });
    }
  }
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});
