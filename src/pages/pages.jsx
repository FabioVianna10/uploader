
import React from 'react';

export async function getStaticPaths() {

  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
 
  ];

  return {
    paths,
    fallback: false, // ou true se você estiver usando fallback
  };
}

export async function getStaticProps({ params }) {
 
  const data = 

  return {
    props: {
      data,
    },
  };
}

const ProdutoPage = ({ data }) => {
 
  return (
    <div>
      <h1>{data.title}</h1>
      {}
    </div>
  );
}

export default getStaticPaths;
