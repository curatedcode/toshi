# Toshi - Marketplace platform

This is my take on a marketplace platform where visitors can browse and purchase products from a sea of different companies

Users can browser and purchase items, leave reviews on previously purchased items and create lists of items they wish to purchase or view again at a later date.

## Screenshots

![Homepage](https://i.postimg.cc/7Z5Jb1n3/Screenshot-from-2023-06-03-10-07-38.png)
![Order Page](https://i.postimg.cc/ncRQHSBV/Screenshot-from-2023-06-03-10-12-09.png)

### How To Deploy Project Locally

1. This project requires you to have Node.js installed, refer to [their website](https://nodejs.org/en/download/) on how to get it installed.

2. Clone this repo to your local machine with one of the commands below. You can also read the GitHub documentation on [cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

```
# If you have SSH set up with Git:
git clone git@github.com:curatedcode/toshi.git

# For HTTPS:
git clone https://github.com/curatedcode/toshi.git

# Finally, GitHub CLI:
gh repo clone curatedcode/toshi
```

3. `cd` into the directory of your local clone.

4. Install the required packages

```
pnpm install
```

5. Create a `.env` file and fill it out with all the required variables listed in `.env.example`.

6. Push the prisma schema to your database

```
pnpm prisma db push
```

7. Finally build and start the app

```
pnpm build
pnpm start
```
