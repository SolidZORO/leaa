import React from 'react';
import { useRouter } from 'next/router';

export default () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Post: {id}</p>;
};
