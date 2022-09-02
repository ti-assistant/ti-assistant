export function Resources({ resources, influence }) {
  return (
    <div className="resourceBlock">
      <span className="resourceSymbol">
        &#x25CB;
      </span>
      <span className="resourceText">
        {resources}
      </span>
      <span className="influenceSymbol">
        &#x2B21;
      </span>
      <span className="influenceText">
        {influence}
      </span>
    </div>
  );
}
