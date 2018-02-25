// @flow
import { Component } from 'react';
import PropTypes from 'prop-types';
import type { Node } from 'react';

type Props = {
  name: string,
  children: Node,
  onChange?: ({}) => void,
}

type State = {
  [string]: any,
};

const EMPTY = {};

function getUndefined(value) {
  if (value === undefined || value === null) {
    return EMPTY;
  }
  // Cannot have any value other than object for a group
  if (typeof value !== 'object') {
    console.error(`Invalid form value. Expected object, but got <${value}>.`);
  }

  return value;
}

function setUndefined(value) {
  if (Object.keys(value).length === 0) {
    return undefined;
  }
  return value;
}

class Group extends Component<Props, State> {
  static defaultValues = {
    array: false,
  }

  static childContextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,

    getObject: PropTypes.func.isRequired,
    setObject: PropTypes.func.isRequired,

    getIndex: PropTypes.func.isRequired,
  }

  static contextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.prevValue = context.getFormValue(props.name);
  }

  getChildContext() {
    return {
      getFormValue: this.getFormValue,
      setFormValue: this.setFormValue,
      getObject: () => getUndefined(this.context.getFormValue(this.props.name)),
      setObject: (obj) => { this.context.setFormValue(this.props.name, obj); },

      getIndex: () => parseInt(this.props.name, 10),
    };
  }

  getFormValue = (name) => {
    const parentValue = getUndefined(this.context.getFormValue(this.props.name));

    return parentValue[name];
  }

  setFormValue = (name, value) => {
    // First get the orignal value;
    const original = getUndefined(this.context.getFormValue(this.props.name));
    const newValue = { ...original };
    if (value === undefined) {
      delete newValue[name];
    } else {
      newValue[name] = value;
    }

    if (this.props.onChange) {
      this.props.onChange(newValue, original);
    }

    this.context.setFormValue(this.props.name, setUndefined(newValue));
  }

  render() {
    return this.props.children;
  }
}

export default Group;
