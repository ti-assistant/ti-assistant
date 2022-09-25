export function Tab({ selectTab, id, selectedId, content, extraContent }) {
  return (
    <div onClick={() => selectTab(id)} className={`tab ${selectedId === id ? "active" : ""}`}>
      {content}
      {selectedId === id ? extraContent : null}
    </div>
  );
}

export function TabBody({ id, selectedId, content }) {
  return <div style={{display: id === selectedId ? "block" : "none"}}>
    {content}
  </div>;
}
