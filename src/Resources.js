export function Resources({ resources, influence }) {
  return (
    <div className="resourceBlock">
      <div className="resourceSymbol">	
        &#9711;
      </div>
      <div className="resourceTextWrapper">
        {resources}
      </div>
      <div className="influenceSymbol">
        &#x2B21;
      </div>
      <div className="influenceTextWrapper">
        {influence}
      </div>
    </div>
  );
}
