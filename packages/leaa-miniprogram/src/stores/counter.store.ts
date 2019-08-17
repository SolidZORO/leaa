import { observable } from 'mobx';

const counterStore = observable({
  counter: 0,
  counterStore() {
    this.counter += 1;
  },
  increment() {
    this.counter += 1;
  },
  decrement() {
    this.counter -= 1;
  },
  incrementAsync() {
    setTimeout(() => {
      this.counter += 1;
    }, 1000);
  },
});
export default counterStore;
