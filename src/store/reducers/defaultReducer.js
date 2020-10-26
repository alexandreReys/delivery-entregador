const INITIAL_STATE = {
  appTitle: "Adega da Vila",
  loadingText: "Acessando dados ...",
  errorMsgText: "Verificando ...",
  adminModule: false,
};

export default function defaultReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_ADMIN_MODULE_ACTIVATE":
      return { ...state, adminModule: true };
    case "ACTION_ADMIN_MODULE_DEACTIVATE":
      return { ...state, adminModule: false };
    default:
      return state;
  }
}
