---
layout: pages/list.njk
permalink: /tags/{{ tag | slugify }}/
eleventyComputed:
  title: “{{ tag }}”
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ['posts']
---