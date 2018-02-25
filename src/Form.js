// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

type Props = {
  onSubmit: ({}) => void,
  onChange: ({}) => void;
  children: any,
  value: { [string]: any },
};

type State = { [string]: any };

const hideStyle = {
  position: 'absolute',
  visibility: 'hidden',
};

class Form extends Component<Props, State> {
  static defaultProps = {
    value: {},
  };

  static childContextTypes = {
    getFormValue: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
  };

  state = {
    data: this.props.value,
  };

  getChildContext() {
    return {
      getFormValue: name => this.state.data[name],
      setFormValue: (name, value) => {
        const next = {
          ...this.state.data,
          [name]: value,
        };

        // Trigger the change event
        if (this.props.onChange) {
          this.props.onChange(next);
        }

        this.setState({ data: next });
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value,
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { data } = this.state;
    this.props.onSubmit(data);
  }

  render() {
    const {
      onSubmit, onChange, value, ...other
    } = this.props;

    return (
      <form onSubmit={this.onSubmit} {...other}>
        <input type="submit" style={hideStyle} />
        {this.props.children}
      </form>
    );
  }
}

export default Form;
