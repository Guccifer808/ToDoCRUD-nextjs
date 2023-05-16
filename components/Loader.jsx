import React from 'react';
import Image from 'next/image';
const Loader = () => {
  return (
    <div className='text-main fixed w-full h-full top-0 left-0 flex justify-center items-center'>
      <Image width={100} height={100} src='/loader.svg' alt='Loader' />
    </div>
  );
};

export default Loader;
