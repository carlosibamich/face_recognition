import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div className="white">
      <div>
        <p className="center f3">
          {`${name}, your current entry count is...`}
        </p>
      </div>
      <div>
        <p className="center f1" style={{ marginTop: 0, marginBottom: 35 }}>
          {entries}
        </p>
      </div>
    </div>
  )
}


export default Rank;
