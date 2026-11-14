# PineLaunch

A free three-week online program where high school students build and launch
one real project. This is the v1 website: a static site with guides, an idea
picker, a progress dashboard, and copy-paste AI prompts. It stores nothing on
a server.

- Working notes for Claude Code: `CLAUDE.md`
- What is done and what is next: `PROJECT_STATUS.md`
- Where this goes after the pilot: `ROADMAP.md`
- Creating the Google Forms: `scripts/README.md`
- Everything the founder changes: `config/program.ts`
- Guide text: `content/`

## Run it on your computer

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build the static site

```bash
npm run build
```

The finished site is in the `out` folder. Any static host can serve it.

## Deploy for free on Vercel

1. Create a free account at <https://github.com> if you do not have one, and
   create a new empty repository called `pinelaunch`.
2. In this folder, run:

   ```bash
   git add .
   git commit -m "PineLaunch v1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pinelaunch.git
   git push -u origin main
   ```

3. Create a free account at <https://vercel.com> using "Continue with GitHub".
4. Click **Add New** then **Project**, pick the `pinelaunch` repository, and
   click **Deploy**. Vercel detects Next.js and needs no settings.
5. In about a minute you get a link like `pinelaunch.vercel.app`. That is the
   live site. Every later `git push` redeploys it.

## Deploy for free on Netlify (alternative)

1. Push to GitHub as above.
2. Create a free account at <https://netlify.com> with GitHub.
3. **Add new site** then **Import an existing project**, pick the repo.
4. Build command: `npm run build`. Publish directory: `out`. Click **Deploy**.
