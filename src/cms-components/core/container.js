import React from 'react';
import CmsContainerItem from './container-item';
import { addBeginComment, addEndComment } from '../../utils/add-html-comment';
import { PreviewContext } from '../../context';

export default class CmsContainer extends React.Component {
  renderContainerWrapper(configuration, preview) {
    // based on the name of the container, render a different wrapper
    switch (configuration.name) {
      // add additional cases here if you need custom HTML for a container
      default:
        return (
          // need to wrap container inside a div instead of React.Fragment because otherwise HTML comments are not removed
          <div>
            <div className="hst-container"
                 ref={(containerElm) => { this.addMetaData(containerElm, configuration, preview); }}>
              { this.renderContainer(configuration) }
            </div>
          </div>
        );
    }
  }

  renderContainer(configuration = { components: [] }) {
    if (configuration.components && configuration.components.length > 0) {
      // render all of the container-item-components
      return configuration.components.map((component) => {
        return (
          <CmsContainerItem configuration={component} key={component.id} />
        );
      });
    }
  }

  addMetaData(htmlElm, configuration, preview) {
    addBeginComment(htmlElm, 'beforebegin', configuration, preview);
    addEndComment(htmlElm, 'afterend', configuration, preview);
  }

  render() {
    if (!this.props.configuration) {
      return null;
    }

    return (
      <PreviewContext.Consumer>
        { preview =>
          <React.Fragment>
            { this.renderContainerWrapper(this.props.configuration, preview) }
          </React.Fragment>
        }
      </PreviewContext.Consumer>
    );
  }
}