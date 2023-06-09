import {
  type Category,
  PrismaClient,
  type Product,
  type AvatarColor,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
const avatarColors = ["blue", "green", "red", "yellow"] as const;

const prisma = new PrismaClient();

// If you don't want a test user, set this to false
const doCreateTestUser = true;

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
const PRODUCT_ORDER_MIN = 1;
const PRODUCT_ORDER_MAX = 10;

// min/max items per user cart
const CART_ITEM_MIN = 1;
const CART_ITEM_MAX = 10;

// min/max quantity per item in cart
const CART_ITEM_QUANTITY_MIN = 1;
const CART_ITEM_QUANTITY_MAX = 5;

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

function getRandomAvatarColor(num?: number): AvatarColor {
  const randomNum = Math.round(Math.random() * 3);
  const color = avatarColors[num ?? randomNum];
  if (!color) return getRandomAvatarColor(randomNum - 1);
  return color;
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
    const state = faker.address.state();

    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatarColor: getRandomAvatarColor(),
        addresses: {
          create: {
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

  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  // create lists & orders for users
  console.log("creating lists & orders for users");

  const lists = [];

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

      const randomProducts: Product[] = [];
      for (let i = 0; i < totalProductsPerOrder; i++) {
        randomProducts.push(getRandomProduct(i, products));
      }

      const date = getRandomDate();

      const allProductPrices = randomProducts.map((product) => product.price);
      const orderTotal = allProductPrices.reduce(
        (total, price) => (total += price)
      );

      const address = {
        firstName: user.firstName,
        lastName: user.lastName,
        streetAddress: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country(),
      };

      const deliveryDate = getRandomDate(date);

      const order = await prisma.order.create({
        data: {
          deliveredAt: deliveryDate,
          createdAt: date,
          user: { connect: { id: user.id } },
          total: orderTotal * 0.07 + orderTotal,
          subtotal: orderTotal,
          shippingTotal: 0.07 * orderTotal,
          status: "delivered",
          shippingAddress: {
            create: address,
          },
          billingAddress: { create: address },
          estimatedDelivery: deliveryDate,
        },
      });

      const allOrderedProducts = [];
      for (const product of randomProducts) {
        allOrderedProducts.push(
          prisma.orderedProduct.create({
            data: {
              priceAtPurchase: product.price,
              quantity: faker.datatype.number({ min: 1, max: 10 }),
              productId: product.id,
              orderId: order.id,
            },
          })
        );
      }

      await prisma.$transaction(allOrderedProducts);
    }
  }

  await prisma.$transaction(lists);

  // create user carts
  console.log("creating user carts...");

  for (const user of users) {
    const itemsToAdd = faker.datatype.number({
      min: CART_ITEM_MIN,
      max: CART_ITEM_MAX,
    });

    const cart = await prisma.userCart.create({
      data: { userId: user.id },
    });

    const randomProductIds = Array.from({ length: itemsToAdd })
      .fill(null)
      .map((_, index) => getRandomProduct(index, products).id);

    for (const id of randomProductIds) {
      const quantity = faker.datatype.number({
        min: CART_ITEM_QUANTITY_MIN,
        max: CART_ITEM_QUANTITY_MAX,
      });

      await prisma.cartProduct.create({
        data: {
          productId: id,
          quantity,
          userCartId: cart.id,
        },
      });
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

  // create test user
  if (doCreateTestUser) {
    console.log("creating test user...");

    await (async function () {
      const user = await prisma.user.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "johnnyBoy@gmail.com",
          avatarColor: getRandomAvatarColor(),
          hash: await bcrypt.hash("superSecretPassword123", 10),
          addresses: {
            create: {
              streetAddress: faker.address.streetAddress(),
              city: faker.address.city(),
              state: faker.address.state(),
              zipCode: faker.address.zipCode(),
              country: faker.address.country(),
            },
          },
        },
      });

      const listsToCreate = [];
      for (let i = 0; i < LISTS_TO_CREATE; i++) {
        const totalProductsPerList = faker.datatype.number({
          min: PRODUCT_LIST_MIN,
          max: PRODUCT_LIST_MAX,
        });

        const listProducts: { id: string }[] = [];

        for (let i = 0; i < totalProductsPerList; i++) {
          listProducts.push({ id: getRandomProduct(i, products).id });
        }

        listsToCreate.push(
          prisma.list.create({
            data: {
              name: `${faker.commerce.department()} list`,
              isPrivate: i % 2 === 0,
              description:
                i % 2 === 0 ? faker.commerce.productDescription() : undefined,
              products: { connect: listProducts },
              userId: user.id,
            },
          })
        );
      }

      for (let i = 0; i < ORDERS_TO_CREATE; i++) {
        const totalProductsPerOrder = faker.datatype.number({
          min: PRODUCT_ORDER_MIN,
          max: PRODUCT_ORDER_MAX,
        });

        const randomProducts: Product[] = [];
        for (let i = 0; i < totalProductsPerOrder; i++) {
          randomProducts.push(getRandomProduct(i, products));
        }

        const date = getRandomDate();

        const allProductPrices = randomProducts.map((product) => product.price);
        const orderTotal = allProductPrices.reduce(
          (total, price) => (total += price)
        );

        const address = {
          firstName: user.firstName,
          lastName: user.lastName,
          streetAddress: faker.address.streetAddress(),
          city: faker.address.city(),
          state: faker.address.state(),
          zipCode: faker.address.zipCode(),
          country: faker.address.country(),
        };

        const deliveryDate = getRandomDate(date);

        const order = await prisma.order.create({
          data: {
            deliveredAt: deliveryDate,
            createdAt: date,
            user: { connect: { id: user.id } },
            total: orderTotal * 0.07 + orderTotal,
            subtotal: orderTotal,
            shippingTotal: 0.07 * orderTotal,
            status: "delivered",
            billingAddress: { create: address },
            shippingAddress: { create: address },
            estimatedDelivery: deliveryDate,
          },
        });

        const allOrderedProducts = [];
        for (const product of randomProducts) {
          allOrderedProducts.push(
            prisma.orderedProduct.create({
              data: {
                priceAtPurchase: product.price,
                quantity: faker.datatype.number({ min: 1, max: 10 }),
                productId: product.id,
                orderId: order.id,
              },
            })
          );
        }

        await prisma.$transaction(allOrderedProducts);
      }

      await prisma.$transaction(listsToCreate);

      const itemsToAdd = faker.datatype.number({
        min: CART_ITEM_MIN,
        max: CART_ITEM_MAX,
      });

      const cart = await prisma.userCart.create({
        data: { userId: user.id },
      });

      const randomProductIds = Array.from({ length: itemsToAdd })
        .fill(null)
        .map((_, index) => getRandomProduct(index, products).id);

      for (const id of randomProductIds) {
        const quantity = faker.datatype.number({
          min: CART_ITEM_QUANTITY_MIN,
          max: CART_ITEM_QUANTITY_MAX,
        });

        await prisma.cartProduct.create({
          data: {
            productId: id,
            quantity,
            userCartId: cart.id,
          },
        });
      }
    })();
  }
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});
