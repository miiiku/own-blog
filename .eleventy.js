const dayjs = require('dayjs');
const slugify = require("slugify");
const yaml = require('js-yaml');
const eleventySyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it")();
const markdownItEmoji = require("markdown-it-emoji");
const markdownItContainer = require("markdown-it-container")
const { buildStyle, buildScript } = require('./gulpfile');

const defaultRender = function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options, env, self);
};

const defaultRenderLink = markdownIt.renderer.rules.link_open || defaultRender;

const defaultRenderImage = markdownIt.renderer.rules.image || defaultRender;

markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrPush(['target', '_blank']);
  tokens[idx].attrPush(['rel', 'noopener']);

  // 传递 token 到默认的渲染器。
  return defaultRenderLink(tokens, idx, options, env, self);
}

markdownIt.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  const titleIndex = token.attrIndex('title');

  if (titleIndex >= 0) {
    return `
      <figure class="figure-image">
        <img src="${token.attrs[srcIndex][1]}" title="${token.attrs[titleIndex][1]}" alt="${token.content}" loading="lazy" />
        <figcaption>${token.attrs[titleIndex][1]}</figcaption>
      </figure>
    `
  }

  token.attrPush(['loading', 'lazy']);

  return defaultRenderImage(tokens, idx, options, env, self);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventySyntaxHighlightPlugin);

  // ADD CUSTOM DATA FILE FORMATS
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // watch _assets/scss _assets/ts
  eleventyConfig.addWatchTarget("_assets/scss/");
  eleventyConfig.addWatchTarget("_assets/ts/");

  // move public source
  eleventyConfig.addPassthroughCopy({ "public": "/" })
  // move assets/images
  eleventyConfig.addPassthroughCopy({ "_assets/images": "images" });

  // Add custom collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob('posts/*.md')
  });

  // Add date filter
  eleventyConfig.addFilter("textDate", dateObj => {
    return dayjs(dateObj).format('MMM DD, YYYY')
  });

  eleventyConfig.addFilter("htmlDate", dateObj => {
    return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
  });

  eleventyConfig.addFilter("linkDate", dateObj => {
    return dayjs(dateObj).format('YYYY/MM/DD/HHmmss')
  })

  eleventyConfig.addFilter("slugify", input => {
    return slugify(input, {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true
    });
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) return [];
    if( n < 0 ) return array.slice(n);
    return array.slice(0, n);
  });

  eleventyConfig.setLibrary('md', markdownIt.use(markdownItEmoji).use(markdownItContainer, "tip"));

  eleventyConfig.on('beforeBuild', () => {
    buildStyle()
    buildScript()
  });

  // Return your Object options:
  return {
    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  }
};