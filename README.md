# helzeiah.com

Personal site built with [Pollen](https://docs.racket-lang.org/pollen/) + Racket. Pages are written in a simple markup language and compiled to static HTML.

---

## Setup

Install [Racket](https://racket-lang.org/download/), then Pollen:

```
raco pkg install pollen
```

---

## Daily workflow

**Start the dev server** (auto-reloads at `localhost:8080`):

```
raco pollen start
```

Edit any `.pm` file and refresh the browser — Pollen recompiles on demand.

**Rebuild everything** (required before deploying):

```
raco pollen render index.ptree
```

**If something looks stale:**

```
raco pollen reset
raco pollen render index.ptree
```

---

## Editing the homepage

Open `index.html.pm`. The text between tag calls is plain prose — blank lines become paragraph breaks automatically.

```
#lang pollen

◊(define-meta title "Your Name")

◊h1{Your Name}

Write your intro here. This becomes a paragraph.

Another blank line, another paragraph. Use ◊link["/blog/index.html"]{links} inline.
```

Save and reload `localhost:8080/index.html`.

---

## Editing the blog index page

Open `blog/index.html.pm`. You can change the heading, add a subtitle, or rename it entirely:

```
#lang pollen

◊(define-meta title "Notes — Your Name")

◊h1{Notes}

◊(blog-listing)
```

`◊(blog-listing)` automatically scans the `blog/` folder and lists every post — you never need to touch this file when adding posts. Just change the heading text if you want a different title (e.g. "Writing", "Notes", "Log").

---

## Adding a blog post

### 1. Create the file

Create `blog/your-post-slug.html.pm`. Use lowercase hyphens for the name.

```
#lang pollen

◊(define-meta title "My Post Title")
◊(define-meta date "April 2026")

◊p[#:class "meta"]{◊link["/blog/index.html"]{← Blog}}

◊h1{My Post Title}

◊post-meta{April 2026}

Write your post here. Blank lines between paragraphs are automatic.

You can use any tag functions listed below.
```

The `title` and `date` metas are used by the blog listing. Both are required.

### 2. Add to `index.ptree`

Open `index.ptree` and add your post filename (without `.pm`):

```
#lang pollen

index.html
blog/your-post-slug.html    ← add this
blog/getting-started.html
blog/index.html
portfolio/index.html
styles.css
feed.xml
```

Order within the blog section doesn't matter for the listing (it sorts by filename). Put newer posts above older ones for clarity.

### 3. Rebuild

```
raco pollen render index.ptree
```

The post now appears in the blog listing automatically.

### Removing a post

Delete the `.pm` file and the compiled `.html` file, and remove the line from `index.ptree`. The blog listing updates automatically.

---

## Tag function reference

These are available in any `.pm` file.

### Headings and structure

```
◊h1{Title}
◊h2{Section}
◊h3{Subsection}
◊hr   ← horizontal divider line
```

### Links

```
◊link["https://example.com"]{link text}
◊link["/blog/index.html"]{relative link}
```

### Inline code

```
Run ◊ic{raco pollen start} to start the server.
```

### Code blocks

````
◊codeblock[#:lang "python"]{
def hello():
    print("hello")
}
````

Supported languages: `python`, `c`, `cpp`, `javascript`, `typescript`, `racket`, `bash`, `haskell`, `rust`, `sql`, `json`, `html`, `css`. Omit `#:lang` for plain text.

### Math (LaTeX via KaTeX)

Inline: `◊math{x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}}`

Display (centered, own line):
```
◊display-math{\sum_{n=1}^{N} n = \frac{N(N+1)}{2}}
```

### Notes / callouts

```
◊note{This is a subtle aside — good for caveats or tips.}
```

### Post metadata

```
◊post-meta{April 2026}
```

Renders as a muted date line beneath the post title. Use on every post.

---

## Adding the Portfolio back

When you have projects ready:

1. Edit `portfolio/index.html.pm` with your projects.
2. Add the Portfolio link back in `template.html.p`:

```html
<nav class="site-nav">
  <a href="/index.html">Home</a>
  <a href="/blog/index.html">Blog</a>
  <a href="/portfolio/index.html">Portfolio</a>   ← add this back
</nav>
```

3. Rebuild: `raco pollen render index.ptree`

---

## Deploying

1. Run `raco pollen render index.ptree`
2. Update `https://example.com` in `feed.xml.pp` to your real domain, then rebuild
3. Upload these files to your host:

```
index.html
styles.css
favicon.svg
robots.txt
feed.xml
blog/index.html
blog/*.html
portfolio/index.html
assets/
```

Do **not** upload: `.pm`, `.pp`, `.p`, `pollen.rkt`, `index.ptree`, `compiled/`, `.claude/`

---

## Quick reference

| Task | How |
|------|-----|
| Edit homepage | `index.html.pm` |
| Change blog page title | `blog/index.html.pm` → change `◊h1{...}` |
| Add a post | Create `blog/slug.html.pm` + add to `index.ptree` |
| Remove a post | Delete the `.pm` and `.html` files + remove from `index.ptree` |
| Change nav links | `template.html.p` |
| Change styles | `styles.css.pp` |
| Add Portfolio to nav | See "Adding the Portfolio back" above |
| Rebuild | `raco pollen render index.ptree` |
| Reset cache | `raco pollen reset` |
