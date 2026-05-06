#lang pollen

:root {
  --bg:      #f5edda;
  --text:    #2c2416;
  --muted:   #8a7a62;
  --link:    #6e5e44;
  --line:    #d9cebc;
  --code-bg: #ece2cc;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

#matcha-scene {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.65;
}

/* Header */

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  transition: background 0.3s ease;
}

.site-header-inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
}

.site-nav {
  display: flex;
  gap: 1.25rem;
  font-size: 0.9rem;
  flex: 1;
}

.site-nav a {
  color: var(--muted);
  text-decoration: none;
}

.site-nav a:hover {
  color: var(--text);
}

/* Content */

.content {
  max-width: 680px;
  margin: 2rem auto 5rem;
  padding: 0 1.25rem;
}

/* Typography */

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 0.35rem;
}

h2 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 2.25rem 0 0.5rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.75rem 0 0.35rem;
}

p {
  margin: 0.9rem 0;
}

a {
  color: var(--link);
  text-decoration: none;
}

a:hover {
  color: var(--text);
}

hr {
  border: none;
  border-top: 1px solid var(--line);
  margin: 2rem 0;
}

.meta {
  color: var(--muted);
  font-size: 0.875rem;
  margin: 0 0 1.75rem;
}

blockquote {
  border-left: 2px solid var(--line);
  margin: 1.25rem 0;
  padding: 0.2rem 0 0.2rem 1rem;
  color: var(--muted);
}

/* Code */

code {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.875em;
  background: var(--code-bg);
  padding: 0.1em 0.3em;
  border-radius: 3px;
}

pre {
  border-radius: 8px;
  padding: 0.85rem 0;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 1.25rem 0;
}

/* Override the hljs theme's default 1em padding — flush left, keep right breathing room */
pre code.hljs {
  padding-left: 0;
  padding-right: 1rem;
  border-radius: inherit;
}

pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

/* Note aside */

.note, .footnote {
  border-left: 2px solid var(--line);
  padding: 0.2rem 0 0.2rem 1rem;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 1.25rem 0;
}

.footnote {
  margin-top: 2rem;
}

/* Blog post list */

.post-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}

.post-list li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);
}

.post-list li:first-child {
  border-top: 1px solid var(--line);
}

.post-list a {
  color: var(--link);
  text-decoration: none;
  width: fit-content;
}

.post-list a:hover {
  color: var(--text);
}

.post-date {
  color: var(--muted);
  font-size: 0.875rem;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Portfolio project list */

.project-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}

.project-list li {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--line);
}

.project-list li:first-child {
  border-top: 1px solid var(--line);
}

/* Mobile */

@media (max-width: 600px) {
  .post-list li {
    flex-direction: column;
    gap: 0.2rem;
  }

  .post-date {
    font-size: 0.8rem;
  }

  #mc-svg {
    height: 2rem !important;
    width: auto !important;
  }
}
