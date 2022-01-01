import React, { createContext, useState } from "react";

export const ModalContext = createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {},
});

const ModalProvider = ({ children }) => {
  const showModal = (component, props = {}) => {
    setValue({
      ...value,
      component,
      props,
    });
  };

  const hideModal = () => {
    setValue({
      ...value,
      component: null,
      props: {},
    });
  };

  const [value, setValue] = useState({
    component: null,
    props: {},
    showModal,
    hideModal,
  });

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ModalProvider;
