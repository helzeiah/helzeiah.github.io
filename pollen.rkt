#lang racket

(provide root)
(provide link)
(require pollen/decode txexpr)

; wrap and clean pages
(define (root . elems)
  (txexpr 'root
          empty
          (decode-elements elems
                           #:txexpr-elements-proc decode-paragraphs)))
; attaches hyperlink to given text!
(define (link url . txt)
  (txexpr 'a `((href ,url)) txt))
  