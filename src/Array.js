// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import type { Node } from 'react';
import Group from './Group';

type Props = {
  name: string,
  onChange?: ([]) => void,
  onItemChange?: (number, {}) => void,
  autoTrim: boolean,
  children: Node,
}

function generateKey(value, idx) {
  if (value && value.id) {
    return value.id;
  }

  // Will we need the total array length here ?
  // Might be if the items are not re-rendering
  return `${idx}`;
}

export function injectItem(Comp) {
  const ArrayItem = (props, context) => {
    const item = {
      getObject: context.getObject,
      getArray: context.getArray,
      getIndex: context.getIndex,
      remove: () => {
        const idx = item.getIndex();
        context.setArray(item.getArray().filter((o, i) => i !== idx));
      },
      add: (obj) => {
        context.setArray(item.getArray().concat(obj));
      },
      insertBefore: (obj) => {
        const idx = item.getIndex();
        const res = context.getArray().slice();
        res.splice(idx, 0, obj);
        context.setArray(res);
      },
      insertAfter: (obj) => {
        const idx = item.getIndex() + 1;
        const res = context.getArray().slice();
        res.splice(idx, 0, obj);
        context.setArray(res);
      },
    };

    return (
      <Comp {...props} arrayItem={item} />
    );
  };

  ArrayItem.contextTypes = {
    getArray: PropTypes.func.isRequired,
    getObject: PropTypes.func.isRequired,
    getIndex: PropTypes.func.isRequired,
    setArray: PropTypes.func.isRequired,
  };

  return ArrayItem;
}

class ArrayGroup extends Component<Props> {
  static defaultProps = {
    autoTrim: false,
  }

  static childContextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,

    getArray: PropTypes.func.isRequired,
    setArray: PropTypes.func.isRequired,
  }

  static contextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      getFormValue: index => this.getter()[index],
      setFormValue: (index, value) => this.setter(value, index),

      getArray: () => this.getter(),
      setArray: arr => this.updateForm(arr),
    };
  }

  getter() {
    const { name } = this.props;
    const v = this.context.getFormValue(name);
    if (v === undefined) {
      return [];
    }

    if (!Array.isArray(v)) {
      console.error(`Invalid form value. Expected an array but got ${v} for ${name}`);
    }

    return v;
  }

  setter(value, index) {
    const { autoTrim } = this.props;
    const v = this.getter().slice();
    v[index] = value;

    if (autoTrim) {
      const filtered = v.filter(k => k !== null && k !== undefined);
      this.updateForm(filtered);
    } else {
      this.updateForm(v);
    }
  }

  updateForm(newValue) {
    const { name, onChange } = this.props;
    const v = newValue.length === 0 ? [null] : newValue;

    if (onChange) {
      onChange(v);
    }
    this.context.setFormValue(name, v);
  }

  render() {
    const { onItemChange, children } = this.props;

    const value = this.getter();

    return (
      value.map((val, idx) => (
        <Group
          key={generateKey(val, idx)}
          name={idx}
          value={val}
          onChange={onItemChange && ((...args) => onItemChange(idx, ...args))}
        >
          {children}
        </Group>
      ))
    );
  }
}

export default ArrayGroup;
