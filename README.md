# thefeetify.com

Next.js 16 (App Router) + React 19 site for Feetify: the landing page, supporting pages, a blog, and a built-in admin CMS for writing posts.

## Pages

| URL | What it is |
| --- | --- |
| `/` | Landing page (original content, unchanged) plus a "latest guides" strip |
| `/about` | About the site, principles, how it is funded |
| `/blog`, `/blog/page/2`… | Blog index, 9 posts per page |
| `/blog/[slug]` | Blog post with table of contents, related posts, Article schema |
| `/blog/category/[category]` | Category archive |
| `/contact` | Contact form (messages land in the admin inbox) |
| `/privacy-policy`, `/terms`, `/affiliate-disclosure` | Legal pages |
| `/admin` | CMS: posts, rich-text editor, image uploads, contact messages |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/llms.txt` | Generated automatically, always include the latest posts |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin is at http://localhost:3000/admin — the password is `ADMIN_PASSWORD` in `.env.local`.

Locally, posts are saved as JSON files in `content/posts/` and images in `public/uploads/`. Commit those files and they ship with the next deploy.

## Deploy to Vercel

1. **Import the project** into Vercel (push this folder to a Git repository and import it, or run `vercel` from this folder). No build settings need changing.
2. **Set the admin password.** Project → Settings → Environment Variables → add `ADMIN_PASSWORD` (at least 10 characters) for Production.
3. **Connect storage.** Project → Storage → Create → **Blob** → choose **Public** access → connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` automatically. Posts, uploaded images and contact messages are stored there.
4. **Redeploy** so the new variables take effect, then add the `thefeetify.com` domain under Settings → Domains.
5. Sign in at `https://thefeetify.com/admin`.

Until step 3 is done the site still works and shows the posts committed in `content/posts/`, but the admin cannot save anything and the contact form is switched off. The admin shows a notice explaining this.

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Yes | Password for `/admin`. Changing it signs everyone out. |
| `BLOB_READ_WRITE_TOKEN` | Yes (production) | Added by Vercel when a Blob store is connected. |
| `AUTH_SECRET` | No | Extra secret mixed into the session signature. |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://thefeetify.com`. Used for canonical URLs, sitemap and Open Graph. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Shown on the contact and legal pages when set. |
| `NEXT_PUBLIC_AFFILIATE_URL` | No | Overrides the affiliate link used by every call-to-action button. |

`NEXT_PUBLIC_*` values are read at build time, so redeploy after changing them.

## Writing posts

Sign in at `/admin` → **New post**.

- **Editor:** headings (H2–H4), bold/italic/underline/strike, lists, quotes, code, links, images, tables, dividers, undo/redo, and an **HTML** view for pasting or fine-tuning markup.
- **Images:** use the image button, or paste/drag an image into the editor. Large photos are resized in the browser before upload (max 4 MB). Always fill in the alt text.
- **Links:** each link can be set to open in a new tab and marked `nofollow` or `sponsored`. Links to the affiliate domain are always marked `sponsored nofollow` automatically.
- **Publish box:** *Save draft* keeps a post private, *Publish* makes it live. A future publish date schedules the post.
- **SEO box:** custom title and meta description with length counters and a search-result preview, plus a noindex switch. If left empty, the post title and excerpt are used.
- **URL slug:** generated from the title; editable. Changing the slug of a published post breaks existing links to it.

Publishing updates the blog, home page, sitemap, RSS feed and `llms.txt` within a few seconds. Post HTML is sanitised on save and again on render.

The posts already in `content/posts/` can be edited or deleted from the admin like any other post.

If your session expires while you are writing (after 7 days), saving shows a message instead of losing your work: sign in again in another tab, come back, and save.

## Project layout

```
app/(site)/          public pages (share the header/footer layout)
app/admin/           login, post list, editor, messages, server actions
app/api/admin/upload image upload endpoint (admin only)
components/site/     header, footer, cards, icons
components/admin/    post editor, rich-text editor
content/posts/       posts stored as JSON (local mode + starter posts)
lib/                 site config, auth, storage, sanitiser, SEO helpers
proxy.ts             keeps signed-out visitors out of /admin
legacy-static/       the original static landing page, kept for reference (not deployed)
```

Site-wide settings (name, navigation, affiliate link, posts per page) live in `lib/site.ts`. Landing page copy lives in `lib/home-content.ts`.

## Notes

- The legal pages are sensible starting templates, not legal advice. Have them reviewed for your jurisdiction.
- Admin login attempts and contact form submissions are rate limited per server instance.
- `npm run build` must pass before deploying; `npm run typecheck` runs TypeScript only.
