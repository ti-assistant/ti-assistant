"use client";

import { useSharedModal } from "../../data/SharedModal";
import SettingsSVG from "../../icons/ui/Settings";
import { rem } from "../../util/util";
import SettingsModal from "./SettingsModal";

export default function SettingsButton() {
  const { openModal } = useSharedModal();
  return (
    <button
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        padding: "unset",
      }}
      onClick={() => openModal(<SettingsModal />)}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        <SettingsSVG />
      </div>
    </button>
  );
}
