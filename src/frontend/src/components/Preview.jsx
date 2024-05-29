import '../css/body.css'
import { useEffect, useState } from 'react'
import { getTemplate } from '../services/api';
import { createMappingData } from '../services/api';

const Preview = ({type, company}) => {
  const [preview, setPreview] = useState('...loading')

  useEffect(() => {
    getTemplate(type).then((res) => {
      setPreview(res.data)
    }).catch(err => {
      console.error('Error fetching template', err)
      setPreview('Error Loading file')
    })

    // getImages(imgName).then((res) => {
    //   setImage(res.data)
    // }).catch(err => {
    //   console.error(`Error fetching ${imgName}`, err)
    //   setImage(`Error Loading Image`)
    // })
  }, [type])

  const createMapping = () => {
    createMappingData(type, company);
    location.reload()
  }

  return (
    <div id='preview'>
      <button onClick={(e) => createMapping(e)}>Start</button>
      <iframe
        srcDoc={preview}
        style={{ width: '100%', height: '100%' }}
      >
      </iframe>
    </div>
  );
};

export default Preview;