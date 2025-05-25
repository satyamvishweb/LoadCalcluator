import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../Scss/styles.scss";

const calculateCBM = (length, width, height, quantity) =>
  ((length * width * height * quantity) / 1000000).toFixed(2);

const containerSpecs = {
  "20ft": { volume: 33.2, maxWeight: 28000 },
  "40ft": { volume: 67.7, maxWeight: 30000 },
  "40HC": { volume: 76.3, maxWeight: 30000 },
};

const LoadSummary = ({ items, container }) => {
  const summaryRef = useRef();

  const totalCBM = items.reduce(
    (sum, item) =>
      sum +
      parseFloat(
        calculateCBM(item.length, item.width, item.height, item.quantity)
      ),
    0
  );
  const totalWeight = items.reduce(
    (sum, item) => sum + parseFloat(item.weight) * parseInt(item.quantity),
    0
  );

  const containerSpec = containerSpecs[container] || containerSpecs["20ft"];
  const cbmPercentage = Math.min(100, (totalCBM / containerSpec.volume) * 100);
  const weightPercentage = Math.min(
    100,
    (totalWeight / containerSpec.maxWeight) * 100
  );

  const handleExportPDF = async () => {
    const element = summaryRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("load-summary.pdf");
  };

  return (
    <div className="load-summary">
      <div ref={summaryRef}>
        <h2>Load Summary</h2>
        <div className="summary-item">
          <span>Total CBM:</span>
          <span>
            {totalCBM} m³ ({cbmPercentage.toFixed(1)}% of container)
          </span>
        </div>
        <div className="summary-item">
          <span>Total Weight:</span>
          <span>
            {totalWeight} kg ({weightPercentage.toFixed(1)}% of limit)
          </span>
        </div>
        <div className="summary-item">
          <span>Suggested Container:</span>
          <span>{container}</span>
        </div>
        <div className="progress-bars">
          <div className="progress-bar-container">
            <span className="progress-label">CBM Usage</span>
            <div className="progress-bar">
              <div
                className="progress-fill cbm-fill"
                style={{ width: `${cbmPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-bar-container">
            <span className="progress-label">Weight Usage</span>
            <div className="progress-bar">
              <div
                className="progress-fill weight-fill"
                style={{ width: `${weightPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {totalCBM > containerSpec.volume && (
          <div className="warning">
            Warning: CBM exceeds container capacity!
          </div>
        )}
        {totalWeight > containerSpec.maxWeight && (
          <div className="warning">
            Warning: Weight exceeds container limit!
          </div>
        )}
      </div>
      <button
        onClick={handleExportPDF}
        className="export-pdf-button btn btn-primary my-2"
      >
        📄 Export PDF
      </button>
    </div>
  );
};

export default LoadSummary;
