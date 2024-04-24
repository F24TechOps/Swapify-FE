import "./css/body.css";

const Preview = () => {
    console.log(window.location.origin)
  return (
    <div id='preview'>
      <button>Start</button>
      <iframe
        src={`${window.location.origin}/html/microsite/base1/template.html`}
        frameborder="0"
      >
        HTML PREVIEW
      </iframe>
    </div>
  );
};

export default Preview;
