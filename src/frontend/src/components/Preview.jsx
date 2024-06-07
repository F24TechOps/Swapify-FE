import '../css/body.css'
import { useEffect, useState } from 'react'
import { getTemplate } from '../services/api';

const Preview = ({type, company}) => {
  const [preview, setPreview] = useState('...loading')

  useEffect(() => {
    getTemplate(type).then((res) => {
      setPreview(res.data)
    }).catch(err => {
      console.error('Error fetching template', err)
      setPreview('Error Loading file')
    })
  }, [type])

  return (
    <div id='preview'>
      <div className='iframe-container'>
      <iframe
        srcDoc={preview}
        style={{ width: '100%', height: '100%' }}
      >
      </iframe>
      </div>
    </div>
  );
};

export default Preview;