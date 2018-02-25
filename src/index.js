import Form from './Form';
import connectField from './Field';
import Group from './Group';
import Array, { injectItem as injectArrayItem } from './Array';
import Tracker from './Tracker';

const Input = connectField('input');


Form.connectField = connectField;
Form.Group = Group;
Form.Input = Input;
Form.Array = Array;
Form.injectArrayItem = injectArrayItem;
Form.Tracker = Tracker;

export {
  connectField,
  Group,
  Input,
  Array,
  injectArrayItem,
  Tracker,
};

export default Form;
