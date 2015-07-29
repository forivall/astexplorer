"use strict";

var React = require('react/addons');

var cloneWithProps = React.addons.cloneWithProps;
var classNames = require('classnames');

/**
 * Creates a left-right split pane inside its container.
 */
var SplitPane = React.createClass({
  getInitialState: function() {
    return {
      dividerPosition: 50,
      horizResize: true
    };
  },

  _onMouseDown: function() {
    var width = global.innerWidth;
    var height = global.innerHeight;
    global.document.body.style.cursor = this.state.horizResize ? 'col-resize' : 'row-resize';
    var moveHandler = function(event) {
      event.preventDefault();
      this.setState({dividerPosition: (this.state.horizResize ? (event.pageX / width) : (event.pageY / height)) * 100});
    }.bind(this);
    var upHandler = function() {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      global.document.body.style.cursor = '';

      if (this.props.onResize) {
        this.props.onResize();
      }
    }.bind(this);

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  },

  _onDoubleClick: function() {
    this.setState({horizResize: !this.state.horizResize});
  },

  render: function() {
    var dividerPos = this.state.dividerPosition;
    if (this.state.horizResize) {
      var baseStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        boxSizing: 'border-box'
      };
      var styleFirst = {
        ...baseStyle,
        left: 0,
        width: dividerPos + '%',
        paddingRight: 3
      };
      var styleSecond = {
        ...baseStyle,
        right: 0,
        width: (100 - dividerPos) + '%',
        paddingLeft: 3
      };
      var dividerStyle = {
        ...baseStyle,
        left: dividerPos + '%',
        width: 5,
        marginLeft: -2.5,
        zIndex: 100
      };
    } else {
      var baseStyle = {
        position: 'absolute',
        left: 0,
        right: 0,
        boxSizing: 'border-box'
      };
      var styleFirst = {
        ...baseStyle,
        top: 0,
        height: dividerPos + '%',
        paddingBottom: 3
      };
      var styleSecond = {
        ...baseStyle,
        bottom: 0,
        height: (100 - dividerPos) + '%',
        paddingTop: 3
      };
      var dividerStyle = {
        ...baseStyle,
        top: dividerPos + '%',
        height: 5,
        marginTop: -2.5,
        zIndex: 100
      };
    }

    return (
      <div className={this.props.className}>
        <div style={styleFirst}>
          {this.props.children[0]}
        </div>
        <div
          className={classNames("splitpane-divider", {
            "splitpane-divider-col": this.state.horizResize,
            "splitpane-divider-row": !this.state.horizResize
          })}
          onMouseDown={this._onMouseDown}
          onDoubleClick={this._onDoubleClick}
          style={dividerStyle}
        />
        <div style={styleSecond}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }
});

module.exports = SplitPane;
