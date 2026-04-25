# JeopardyClone
 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Adding Content

To add media, navigate to the folder `@/app/public/media` to add media files (i.e. picture, audio, video) so Next.js can be serve them statically. The format for media files is the following:

```
export interface ClueMedia {
  type: MediaType;
  src: string; // path relative to /public, e.g. "/media/clue1.jpg"
  alt?: string; // for images: screen-reader text
  caption?: string; // optional label shown below the media
}
```

To add answers and questions for the categories, navigate to `@/app/data/questions.ts` and hardcode the text under `question` and `answer` variables. The format for Jeopardy clues is the following:
```
export interface Clue {
  question: string;
  answer: string;
  isDailyDouble: boolean;
  media?: ClueMedia;
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
