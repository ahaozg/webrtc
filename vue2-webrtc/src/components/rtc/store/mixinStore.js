import debounce from './../common/directive/debounce';
import storeAuths from './auths';
import storeRoom from './room';
import storeDevice from './device';

export default {
  directives: {debounce},
  data() {
    return {
      storeAuths,
      storeRoom,
      storeDevice,
    };
  },
};
