import '../css/body.css'

const Preview = ({type}) => {
  return (
    <div id='preview'>
      <button>Start</button>
      <iframe
        src={`${window.location.origin}/html/${type}/base1/template.html`}
        frameborder="0"
      >
        HTML PREVIEW
      </iframe>
    </div>
  );
};

export default Preview;
