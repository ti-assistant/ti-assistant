export function Tab({ selectTab, id, selectedId, content, extraContent }) {
  return (
    <div onClick={() => selectTab(id)} className={`tab ${selectedId === id ? "active" : ""}`}>
      {content}
      {selectedId === id ? extraContent : null}
    </div>
  );
}

export function TabBody({ id, selectedId, content }) {
  if (id !== selectedId) {
    return null;
  }
  return <div>
    {content}
  </div>;
}
