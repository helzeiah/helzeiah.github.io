#lang pollen

◊(define-meta title "First Post -- Life Currently and a Feature Showcase")
◊(define-meta data "April 2026")

◊p[#:class "meta"]{◊link["/blog/index.html"]{← Blog}}

◊h1{First Post -- Life Currently and a Feature Showcase}

Hi, my first blog post, yay! The thought of having a website with a blog has been sitting in the back of my mind for the past few months, and I've finally set the time aside to make it a reality. I hope to use these blog posts a way to talk about my projects, interests, and life in general, hopefully sharing some insightful information along the way.

◊h3{◊ic{whoami}}

◊codeblock{
Helzeiah Oliveira | 20yo | problem solver i guess
Current Mathematics Major at Northeastern, Minor in CS
Potentially Pursuing a Physics minor
Used to be a Computer Science and Math combined Major
Current Software Engineer Co-op at Auria Space
Interested in learning more about:
Quant, AI (contributing to safe AI would be amazing),
Psychology, The World, and Ethics
}

◊hr[]

◊h3{Features and Stuff}

I find it so cool how I can simply use ◊ic{◊"◊"codeblock{}} via ◊link["https://docs.racket-lang.org/pollen/"]{Pollen} to display such codeblocks. Here's a random idea of C++ code (from a problem i've seen before) I made while writing this:

◊codeblock[#:lang "cpp"]{
#include <vector>
#include <unordered_map>
#include <random>

template <typename T>
class RandomSet {
  std::vector<T> m_vec;
  std::unordered_map<T, size_t> m_elemToIdxMap;
  std::mt19937 m_randGen{std::random_device{}()};

public:

  RandomSet() = default;
  ~RandomSet() = default;

  void insert(const T& element) {
    auto [it, inserted] = m_elemToIdxMap.insert({element, m_vec.size()});
    if (inserted) {
      m_vec.push_back(element);
    }
  }

  void remove(const T& element) {
    try {
      size_t idx = m_elemToIdxMap.at(element);
      // swap and pop
      T last = m_vec.back();
      m_vec[idx] = last;
      m_elemToIdxMap[last] = idx;
      m_vec.pop_back();

      m_elemToIdxMap.erase(element);
    } catch (std::exception& e) {
      throw std::invalid_argument("Given element does not exist in the set. -- RandomSet::remove()");
    }
  }

  T getRandom() {
    if (m_vec.empty()) {
      throw std::out_of_range("Cannot get random element from an empty RandomSet. -- RandomSet::getRandom()");
    }
    std::uniform_int_distribution<size_t> distr(0, m_vec.size() - 1);
    size_t idx = distr(m_randGen);
    return m_vec[idx];
  }

  bool contains(const T& element) const {
    return m_elemToIdxMap.contains(element);
  }

};
}

If you're are a "lazy person", in the sense that, you also, like me, want things to be as optimized, simple and easy as possible, ◊link["https://racket-lang.org/"]{Racket} and ◊link["https://docs.racket-lang.org/pollen/"]{Pollen} is the answer to making sites for you. I know a lot of people like myself who simply avoid frontend development. I wanted a way to have a blog with cool inline codeblocks, math, and other features that didn't require me to know any crazy frontend stuff that I couldn't bother to learn. ◊link["https://docs.racket-lang.org/pollen/"]{Pollen} was the answer to this problem, along with A TON of help from ◊link["https://claude.ai/code"]{Claude Code}. It's beautiful how there's now a very small barrier between ◊em{anyone} having their own site, and showcasing creative work. You don't have to go through ◊fn[1]{tutorial hell} to learn frontend frameworks, you can solely be a backend problem solver like me who wanted a place to share their ideas.

◊footnote[1 "tutorial hell"]{Spending months watching tutorials without writing a single line of code.}

◊h3{Math, because I can}

Being a math major and all, I wanted some math rendering ◊math{ \text{Helzeiah} + \text{Claude} + \text{Pollen} = \text{perfect tooling for an awesome website}}.

I can also do some centered "\[" type of math, here's the Black-Scholes formula (i DO NOT have this memorized):

◊display-math{\frac{\partial V}{\partial t} + \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV = 0}

◊note{The math renders client-side via KaTeX. Just write ◊ic{◊"◊"math{}} or ◊ic{◊"◊"display-math{}} and it works.}

◊h3{That's it for now}

Future posts will be less "look at my setup" and more actual content — projects, ideas, things I'm thinking about. If you want to look into or steal my ◊link["https://docs.racket-lang.org/pollen/"]{Pollen} setup, the source is on my ◊link["https://github.com/helzeiah/helzeiah.github.io"]{GitHub}.
