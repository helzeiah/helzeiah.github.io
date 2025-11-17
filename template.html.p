<html>
  <head>
    <meta charset="utf-8">
    <title>my site – ◊(select 'h1 doc)</title>
    <link rel="stylesheet" href="/styles.css">
  </head>

  <body>
    <nav>
      <a href="/index.html">home</a> ·
      <a href="/blog/index.html">blog</a> ·
      <a href="/portfolio/index.html">portfolio</a>
    </nav>

    <main>
      ◊(->html doc #:splice? #t)
    </main>
  </body>
</html>