import React from 'react';
import Error from 'next/error';
import Link from 'next/link';
import { withRouter } from 'next/router';

import fetch from 'isomorphic-unfetch';
import { getApiUrl, CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk';

import Banner from '../components/banner';
import Content from '../components/content';
import NewsItem from '../components/news-item';
import NewsList from '../components/news-list';

const cmsUrls = {
  cmsPort: 9080
};

const componentDefinitions = {
  "Banner": { component: Banner, wrapInContentComponent: true },
  "Content": { component: Content, wrapInContentComponent: true },
  "News List": { component: NewsList },
  "News Item": { component: NewsItem, wrapInContentComponent: true }
};

const createLink = (href, linkText, className) => {
  return (<Link href={href}><a className={className}>{linkText()}</a></Link>)
};

export class Index extends React.Component {
  static async getInitialProps ({ req, asPath }) {
    // setting pageModel to empty list instead of null value,
    // as otherwise the API will be fetched client-side again after server-side fetch errors
    let pageModel = {};

    const url = getApiUrl(asPath, cmsUrls);
    const response = await fetch(url, {headers: {'Cookie': req.headers.cookie}});

    if (response.ok) {
      try {
        pageModel = await response.json();
      } catch (err) {
        console.log(`Error! Could not convert response to JSON for URL: ${url}`);
        console.log(err);
      }
    } else {
      console.log(`Error! Status code ${response.status} while fetching CMS page data for URL: ${url}`);
    }

    return {
      pageModel: pageModel,
      errorCode: !response.ok ? response.status : null
    };
  }

  render () {
    const { errorCode, router } = this.props;

    if (errorCode) {
      return (<Error statusCode={errorCode} />);
    }

    return (
      <CmsPage componentDefinitions={componentDefinitions} cmsUrls={cmsUrls} pageModel={this.props.pageModel}
               urlPath={router.asPath} createLink={createLink}>
        { () =>
          <React.Fragment>
            <div id='header'>
              <nav className='navbar navbar-expand-md navbar-dark fixed-top bg-dark'>
                <span className='navbar-brand'>Server-side React Demo</span>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarCollapse'
                        aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>
                  <span className='navbar-toggler-icon' />
                </button>
                <div className='collapse navbar-collapse' id='navbarCollapse'>
                  <RenderCmsComponent path='menu' />
                </div>
              </nav>
            </div>
            <div className='container marketing'>
              <RenderCmsComponent />
            </div>
          </React.Fragment>
        }
      </CmsPage>
    );
  }
}

export default withRouter(Index);
