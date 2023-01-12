export function NumberedItem({ children }) {
  return <li style={{fontFamily: "Myriad Pro", fontWeight: "bold"}}>
    <div style={{fontFamily: "Slider", fontWeight: "normal"}}>
      {children}
    </div>
  </li>;
}