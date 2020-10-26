export function actionAdminModuleActivate() {
  return { type: "ACTION_ADMIN_MODULE_ACTIVATE" };
}
export function actionAdminModuleDeactivate() {
  return { type: "ACTION_ADMIN_MODULE_DEACTIVATE" };
}

export function actionLogin(user) {
  return { type: "ACTION_LOGIN", user };
}
export function actionLogout() {
  return { type: "ACTION_LOGOUT" };
}

export function actionSetOrders(orders) {
  return { type: "ACTION_SET_ORDERS", orders };
}
export function actionSetOrder(order) {
  return { type: "ACTION_SET_ORDER", order };
}
export function actionClearOrders() {
  return { type: "ACTION_CLEAR_ORDERS" };
}