"use client";

import { ReactNode, useState } from "react";
import { useBetween } from "use-between";
import GenericModal from "../components/GenericModal/GenericModal";

const useModal = () => {
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

export const useSharedModal = () => useBetween(useModal);

export default function SharedModal() {
  const { modals, popModal } = useSharedModal();

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
