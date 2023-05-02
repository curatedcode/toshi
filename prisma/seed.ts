import { type Category, PrismaClient, type Product } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * This will generate a blank test user for you to sign in with
 */
async function createTestUser() {
  const hash = await bcrypt.hash("superSecretPassword123", 10);
  const name = "John Doe";
  const email = "johnnyBoy@gmail.com";
  const image = faker.internet.avatar();

  await prisma.user.create({ data: { name, email, image, hash } });
}

// total companies to create
const COMPANIES_TO_CREATE = 50;

// total categories to create (max of 22)
const CATEGORIES_TO_CREATE = 22;

// products per company to create
const PRODUCTS_TO_CREATE = 20;

// images min/max per product
const PRODUCT_IMAGE_MIN = 1;
const PRODUCT_IMAGE_MAX = 5;

// quantity min/max per product
const PRODUCT_QUANTITY_MIN = 0;
const PRODUCT_QUANTITY_MAX = 420;

// total users to create
const USERS_TO_CREATE = 100;

// lists per user to create
const LISTS_TO_CREATE = 5;

// products min/max per list
const PRODUCT_LIST_MIN = 0;
const PRODUCT_LIST_MAX = 10;

// orders per user to create
const ORDERS_TO_CREATE = 5;

// products min/max per order
const PRODUCT_ORDER_MIN = 0;
const PRODUCT_ORDER_MAX = 10;

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

function getRandomDate(min?: Date, max?: Date) {
  const today = new Date().toISOString();
  return faker.date.between(min ?? "2022-01-01T00:00:00.000Z", max ?? today);
}

function getRandomRating() {
  let randomRating = Math.round(Math.random() * 5 * 1e1) / 1e1;

  if (randomRating < 1) randomRating += 1;

  return randomRating;
}

function getRandomBody() {
  const randomNum = Math.round(Math.random() * 3);

  if (randomNum >= 2) return null;

  return faker.lorem.paragraphs();
}

function getRandomCategory(
  index: number,
  categories: Category[]
): { name: string; id: string } {
  const category = categories[index];

  if (!category) return getRandomCategory(index - 1, categories);

  return { name: category.name, id: category.id };
}

function getRandomProduct(index: number, products: Product[]): Product {
  const product = products[index];

  if (!product) return getRandomProduct(index - 1, products);

  return product;
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
    logoURL: faker.image.abstract(),
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
  const companies = await prisma.company.findMany();

  for (const company of companies) {
    const index = companies.indexOf(company);
    const productsToCreate = [];

    for (let i = 0; i < PRODUCTS_TO_CREATE; i++) {
      const { name: category, id: categoryId } = getRandomCategory(
        index,
        categories
      );

      // generate random amount of images for product
      const imageAmount = faker.datatype.number({
        min: PRODUCT_IMAGE_MIN,
        max: PRODUCT_IMAGE_MAX,
      });
      const images: { url: string }[] = [];

      for (let i = 0; i < imageAmount; i++) {
        images.push({
          url: faker.image.imageUrl(undefined, undefined, category, true),
        });
      }

      productsToCreate.push(
        prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            quantity: faker.datatype.number({
              min: PRODUCT_QUANTITY_MIN,
              max: PRODUCT_QUANTITY_MAX,
            }),
            description: faker.commerce.productDescription(),
            companyId: company.id,
            categories: { connect: { id: categoryId } },
            createdAt: getRandomDate(),
            images: { create: images },
          },
        })
      );
    }

    await prisma.$transaction(productsToCreate);
  }

  // create users
  console.log("creating users...");

  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const name = faker.name.fullName();
    const state = faker.address.state();

    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name,
        image: faker.internet.avatar(),
        addresses: {
          create: {
            addressee: name,
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            state,
            zipCode: faker.address.zipCodeByState(state),
            country: faker.address.country(),
          },
        },
      },
    });
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  const products = await prisma.product.findMany();

  // create lists & orders for users
  console.log("creating lists & orders for users");

  const lists = [];
  const orders = [];

  for (const user of users) {
    const userIndex = users.indexOf(user);

    // generate lists
    for (let i = 0; i < LISTS_TO_CREATE; i++) {
      const totalProductsPerList = faker.datatype.number({
        min: PRODUCT_LIST_MIN,
        max: PRODUCT_LIST_MAX,
      });

      const listProducts: { id: string }[] = [];

      for (let i = 0; i < totalProductsPerList; i++) {
        listProducts.push({ id: getRandomProduct(i, products).id });
      }

      lists.push(
        prisma.list.create({
          data: {
            name: `${faker.commerce.department()} list`,
            isPrivate: userIndex % 2 === 0,
            description:
              userIndex % 2 === 0
                ? faker.commerce.productDescription()
                : undefined,
            products: { connect: listProducts },
            userId: user.id,
          },
        })
      );
    }

    // generate orders
    for (let i = 0; i < ORDERS_TO_CREATE; i++) {
      const totalProductsPerOrder = faker.datatype.number({
        min: PRODUCT_ORDER_MIN,
        max: PRODUCT_ORDER_MAX,
      });

      const orderProducts: { id: string }[] = [];
      for (let i = 0; i < totalProductsPerOrder; i++) {
        orderProducts.push({ id: getRandomProduct(i, products).id });
      }

      const date = getRandomDate();
      const randomProduct = getRandomProduct(userIndex, products);

      orders.push(
        prisma.order.create({
          data: {
            deliveredAt: getRandomDate(date),
            createdAt: date,
            products: {
              create: {
                priceAtPurchase: randomProduct.price,
                quantity: faker.datatype.number({ min: 1, max: 10 }),
                productId: randomProduct.id,
              },
            },
            userId: user.id,
          },
        })
      );
    }
  }

  // create product reviews
  console.log("creating product reviews...");

  async function getRandomUser(index: number): Promise<string> {
    const user = users[index];

    if (!user) return getRandomUser(index - 1);

    return user.id;
  }

  for (const product of products) {
    const randomAmountOfReviews = faker.datatype.number({
      min: REVIEWS_TO_CREATE_MIN,
      max: REVIEWS_TO_CREATE_MAX,
    });

    for (let i = 0; i < randomAmountOfReviews; i++) {
      const userId = await getRandomUser(i);
      await prisma.review.create({
        data: {
          userId,
          productId: product.id,
          rating: getRandomRating(),
          title: faker.lorem.sentence(),
          body: getRandomBody(),
          createdAt: getRandomDate(),
        },
      });
    }
  }

  console.log("creating test user...");
  await createTestUser();
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});
