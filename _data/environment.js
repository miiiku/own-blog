module.exports = function () {
  const environment = process.env.ELEVENTY_ENV
  const data = { environment }

  /** add var baseUrl */
  if (environment === 'production') {
    data.baseUrl = 'https://sukoshi.xyz/'
  } else {
    data.baseUrl = '/'
  }
  
  return data
}