import React, { useEffect, useState } from 'react';

export default function Index({ name = "Default" }) {

  const [state, setState] = useState(0);

  useEffect(() => {
  }, []);

  return (
    <div>
      <p
        className='text-2xl font-bold w-32 mx-auto bg-slate-400 my-4'
      >{state}</p>
      <p
        className='text-2xl font-bold w-32 mx-auto bg-slate-400 my-4'
      >{name}</p>
      <div
      >
        <button
          className='p-4 m-4 rounded-xl bg-blue-400'
          onClick={() => setState(state + 1)}
        > + </button>
        <button
          className='p-4 m-4 rounded-xl bg-blue-400'
          onClick={() => setState(state - 1)}
        > - </button>
      </div>
      <a href="/about">Link to About</a>
    </div>
  );
};