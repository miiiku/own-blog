---
layout: pages/posts.njk
title: 归档
permalink: "/posts{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber + 1 }}{% endif %}/"
pagination:
  data: collections.posts
  reverse: true
  size: 15
---