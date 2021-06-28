import { observable, action } from "mobx";
class Store {
  @observable address = "";
  @observable path = "";
  @observable proxy = "http://210.32.136.134:8080";
  @observable userInfo = {};
  @observable loading = false;
  @action
  changeAddress = (index) => {
    this.addressInfo = index;
    this.path = "/main";
  };
  @action
  loadingStart = () => {
    this.loading = true;
  };
  @action
  loadingEnd = () => {
    this.loading = false;
  };
}
const store = new Store();

export default store;

