import cowsay from 'cowsay-browser';

function CowsayHi() {
  return <pre>{cowsay.say({ text: 'hi there!' })}</pre>;
}

export default CowsayHi;
