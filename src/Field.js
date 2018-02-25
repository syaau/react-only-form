// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

type Props = {
  name: string;
};

const getUndefined = v => (v === undefined || v === null ? '' : v);
const setUndefined = v => (v === '' ? undefined : v);

const defaultInjector = (getter, setter) => ({
  value: getUndefined(getter()),
  onChange: e => setter(setUndefined(e.target.value)),
});

export default function createField(Input, injector = defaultInjector) {
  class Field extends Component<Props> {
    static contextTypes = {
      getFormValue: PropTypes.func.isRequired,
      setFormValue: PropTypes.func.isRequired,
    }

    getter = () => this.context.getFormValue(this.props.name)

    setter = value => this.context.setFormValue(this.props.name, value)

    render() {
      const injectProps = injector(this.getter, this.setter);
      return (<Input {...this.props} {...injectProps} />);
    }
  }

  return Field;
}
