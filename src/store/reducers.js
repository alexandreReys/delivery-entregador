import { combineReducers } from "redux";

import defaultReducer from "./reducers/defaultReducer";
import loginReducer from "./reducers/loginReducer";
import orderReducer from "./reducers/orderReducer";

export default combineReducers({
  defaultState: defaultReducer,
  loginState: loginReducer,
  orderState: orderReducer,
});
