// @flow
import { Component } from 'react';
import PropTypes from 'prop-types';

type Props = {
  name: string,
  content?: (any) => string,
};

type State = {
  content: string,
};

function undefinedToNull(value) {
  if (value === undefined) {
    return null;
  }
  return value;
}

class Tracker extends Component<Props, State> {
  static contextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const original = undefinedToNull(context.getFormValue(props.name));
    this.state = {
      content: props.content ? props.content(original) : original,
    };
  }

  componentWillReceiveProps(nextProps) {
    const newContent = undefinedToNull(this.context.getFormValue(nextProps.name));
    this.setState({
      content: nextProps.content ? nextProps.content(newContent) : newContent,
    });
  }

  render() {
    return this.state.content;
  }
}

export default Tracker;
