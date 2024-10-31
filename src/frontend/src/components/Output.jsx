import { useEffect, useState } from "react";
import "../css/body.css";
import { getFinal } from "../services/api";
import Loading from "./Loading";

const Output = ({ type, company , dataVersion}) => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchOutput = async () => {
      setLoading(true)
      try {
        const res = await getFinal(type, company);
        setOutput(res.data);
        setError(false);
      } catch (err) {
        // console.error('Error fetching final template', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOutput();
  }, [type, company, dataVersion]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return null; 
  }

  return (
    <div className="iframe-container" id="output-body">
      <iframe
        srcDoc={output}
        style={{ width: "100%", height: "100vh" }}
      ></iframe>
    </div>
  );
};

export default Output;
