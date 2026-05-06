#lang racket

(provide root link ic codeblock math display-math
         blog-entry post-meta note blog-listing fn footnote)

(require pollen/decode pollen/setup
         txexpr racket/string racket/file)

; wrap and clean pages
(define (root . elems)
  (txexpr 'root
          empty
          (decode-elements elems
                           #:txexpr-elements-proc decode-paragraphs)))

; attaches hyperlink to given text
(define (link url . txt)
  (txexpr 'a `((href ,url)) txt))

; inline code helper
(define (ic . txt)
  (txexpr 'code empty txt))

(define (join-text xs)
  (string-join (map ~a xs) ""))

; fenced-style code block helper
(define (codeblock #:lang [lang "text"] . txt)
  (txexpr 'pre
          empty
          (list (txexpr 'code
                        `((class ,(format "language-~a" lang)))
                        (list (join-text txt))))))

; math helpers rendered client-side by KaTeX auto-render
(define (math . expr)
  (format "$~a$" (join-text expr)))

(define (display-math . expr)
  (format "$$~a$$" (join-text expr)))

; blog-entry: one row in the post list on blog/index.html
; Usage: ◊blog-entry["/blog/foo.html" "March 2026"]{Post Title}
(define (blog-entry url date . title)
  (txexpr 'li empty
          (list (txexpr 'a `((href ,url)) title)
                (txexpr 'span '((class "post-date")) (list date)))))

; post-meta: date line rendered beneath a post's h1
; Usage: ◊post-meta{January 2026}
(define (post-meta . content)
  (txexpr 'p '((class "meta")) content))

; note: subtle aside block for callouts
; Usage: ◊note{This is a callout.}
(define (note . content)
  (txexpr 'aside '((class "note")) content))

; fn: inline footnote marker — wraps text with a superscript number
; Usage: ◊fn[1]{tutorial hell}
(define (fn num . txt)
  (txexpr 'span '((class "fn-ref"))
    (append txt (list (txexpr 'sup empty (list (format "[~a]" num)))))))

; footnote: bottom-of-page footnote entry with term label
; Usage: ◊footnote[1 "tutorial hell"]{Definition goes here.}
(define (footnote num term . content)
  (txexpr 'aside '((class "footnote"))
    (list* (txexpr 'sup empty (list (format "[~a] " num)))
           (txexpr 'strong empty (list term))
           " — "
           content)))

; blog-listing: scans blog/ directory for .html.pm sources, extracts metas
; directly from source files via regex — no pagetree or cache dependency.
(define (blog-listing)
  (define blog-dir (build-path (current-project-root) "blog"))
  (define (file-metas path)
    (define h (make-hash))
    (for ([m (in-list (regexp-match* #px"◊\\(define-meta (\\w+) \"([^\"]*)\"\\)"
                                     (file->string path) #:match-select cdr))])
      (hash-set! h (string->symbol (first m)) (second m)))
    h)
  (define sources
    (sort
      (filter (λ (f)
                (let ([s (path->string f)])
                  (and (string-suffix? s ".html.pm")
                       (not (string=? s "index.html.pm")))))
              (directory-list blog-dir))
      string>?
      #:key path->string))
  (txexpr 'ul '((class "post-list"))
    (map (λ (src)
           (define m (file-metas (build-path blog-dir src)))
           (define title (hash-ref m 'title
                           (regexp-replace #rx"\\.html\\.pm$" (path->string src) "")))
           (define date  (hash-ref m 'date ""))
           (define url   (string-append "/blog/"
                           (regexp-replace #rx"\\.pm$" (path->string src) "")))
           (txexpr 'li empty
             (list (txexpr 'a `((href ,url)) (list title))
                   (txexpr 'span '((class "post-date")) (list date)))))
         sources)))
