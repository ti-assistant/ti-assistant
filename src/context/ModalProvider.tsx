"use client";

import { PropsWithChildren, ReactNode, useState } from "react";
import GenericModal from "../components/GenericModal/GenericModal";
import { ModalContext } from "./contexts";

const useModals = () => {
  const [modals, setModals] = useState<ReactNode[]>([]);

  function openModal(content: ReactNode) {
    setModals((modals) => [...modals, content]);
  }

  function popModal() {
    setModals((modals) => modals.slice(0, -1));
  }

  return {
    modals,
    openModal,
    popModal,
  };
};

export default function ModalProvider({ children }: PropsWithChildren) {
  const { modals, openModal, popModal } = useModals();

  console.log("Rendering provider");

  return (
    <>
      <Modals modals={modals} popModal={popModal} />
      <ModalContext.Provider value={{ openModal, popModal }}>
        {children}
      </ModalContext.Provider>
    </>
  );
}

function Modals({
  modals,
  popModal,
}: {
  modals: ReactNode[];
  popModal: () => void;
}) {
  return (
    <>
      <GenericModal visible={modals.length > 0} level={1} closeMenu={popModal}>
        {modals[0] ?? null}
      </GenericModal>
      <GenericModal visible={modals.length > 1} level={2} closeMenu={popModal}>
        {modals[1] ?? null}
      </GenericModal>
      <GenericModal visible={modals.length > 2} level={3} closeMenu={popModal}>
        {modals[2] ?? null}
      </GenericModal>
    </>
  );
}
