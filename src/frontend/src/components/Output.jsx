import { useEffect, useState } from 'react';
import '../css/body.css'
import { getFinal } from '../services/api';

const Output = ({type, company}) => {
  const [output, setOutput] = useState('...loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    getFinal(type, company).then((res) => {
      setOutput(res.data);
      setError(null)
    }).catch((err) => {
      if (err.response && err.response.status === 404) {
        setError('Template not found')
      } else {
        setError('An error occurred while fetching template')
      }
    })
  }, [])

  if (!output) {
    return <div>Press submit to create an output</div>;
  }

  return (
    <div id='output-body'>
      <iframe srcDoc={output} style={{ width: '100%', height: '100vh' }}></iframe>
    </div>
  );
};

export default Output;