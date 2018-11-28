import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

function truncate(n, useWordBoundary) {
  if (this.length <= n) {
    return this
  }
  const subString = this.substr(0, n - 1)
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + '...'
  )
}

const query = graphql`
  query {
    dataYaml {
      title
      tagline
      description
      url
      email
      img {
        childImageSharp {
          resize(width: 980) {
            src
          }
        }
      }
      social {
        Email
        Blog
        GitHub
      }
    }
  }
`

const SEO = ({ project }) => (
  <StaticQuery
    query={query}
    render={data => {
      const meta = data.dataYaml

      const title = project.title || meta.title
      const tagline = meta.tagline
      const description = project.description
        ? truncate.apply(project.description, [320, true])
        : truncate.apply(meta.description, [320, true])
      const image = project.img
        ? project.img.childImageSharp.twitterImage.src
        : meta.img.childImageSharp.resize.src
      const url = project.slug ? `${meta.url}${project.slug}` : meta.url

      return (
        <Helmet
          defaultTitle={`${title.toLowerCase()} { ${tagline.toLowerCase()} }`}
          titleTemplate={`%s // ${title.toLowerCase()} { ${tagline.toLowerCase()} }`}
        >
          <html lang="en" />

          <title>{title}</title>

          {/* General tags */}
          <meta name="description" content={description} />
          <meta name="image" content={`${meta.url}${image}`} />
          <link rel="canonical" href={url} />

          {/* OpenGraph tags */}
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={`${meta.url}${image}`} />

        </Helmet>
      )
    }}
  />
)

SEO.propTypes = {
  project: PropTypes.object
}

SEO.defaultProps = {
  project: {}
}

export default SEO
