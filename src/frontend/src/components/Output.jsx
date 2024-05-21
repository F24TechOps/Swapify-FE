import { useEffect, useState } from 'react';
import '../css/body.css'
import { getFinal } from '../services/api';

const Output = ({type, company}) => {
  const [output, setOutput] = useState('...loading')

  useEffect(() => {
    getFinal(type, company).then((res) => {
      setOutput(res.data)
    })
  }, [])

  return (
    <div id='output-body'>
      <iframe srcDoc={output} frameborder="0" style={{ width: '100%', height: '100vh' }}></iframe>
    </div>
  );
};

export default Output;