export function Tab({ selectTab, id, selectedId, content, extraContent }) {
  return (
    <button onClick={() => selectTab(id)} className={selectedId === id ? "selected" : ""}>
      {content}
      {selectedId === id ? extraContent : null}
    </button>
    // <div onClick={() => selectTab(id)} className={`tab ${selectedId === id ? "active" : ""}`}>
    //   {content}
    //   {selectedId === id ? extraContent : null}
    // </div>
  );
}

export function TabBody({ id, selectedId, content, style }) {
  return <div style={{display: id === selectedId ? "block" : "none", ...style}}>
    {content}
  </div>;
}
