// PATIENT HEALTH RECORD
// A patient's prescriptions and medicines given over time.

import { formatPharmacyDate, formatPharmacyDateTime } from "../utils/pharmacyTime";
import { useEffect, useState } from "react";
import { errorMessage } from "../api/client";
import { useHistoryPage } from "../api/useHistoryPage";
import { Alert, Empty, Loading, Status } from "../components/Ui";

const prescriberLabel = (rx: { prescriberTitle?: string; prescriberName?: string }) =>
  [rx.prescriberTitle, rx.prescriberName].filter(Boolean).join(" ") || "Not mentioned";

export function PatientHealthRecordPage() {
  const { get: readHistory, controls: historyControls } = useHistoryPage('Prescription history');
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readHistory("/patients/me/health-record", "prescriptions")
      .then((response) => setRecord(response.data.data))
      .catch((caught) => setError(errorMessage(caught)))
      .finally(() => setLoading(false));
  }, [readHistory]);

  if (loading) return <Loading />;
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>My health record</h2>
          <p>
            Your profile details on file with the pharmacy, and your full
            prescription history.
          </p>
        </div>
      </div>
      <Alert message={error} />
      {historyControls}
      {record && (
        <>
          <div className="panel patient-health-record-summary mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Patient Number:</strong>{" "}
                <code>{record.patientNumber}</code>
              </div>
              <div className="col-md-6">
                <strong>Date of Birth:</strong>{" "}
                {record.dateOfBirth
                  ? formatPharmacyDate(record.dateOfBirth)
                  : "—"}
              </div>
              <div className="col-md-6">
                <strong>Contact Phone:</strong> {record.user.phone || "—"}
              </div>
              <div className="col-md-6">
                <strong>Email Address:</strong> {record.user.email}
              </div>
            </div>

            <div className="alert alert-danger mt-3 mb-2 py-2">
              <strong>Allergies &amp; Safety Warnings:</strong>
              <div className="mt-1">{record.allergies || "None recorded"}</div>
            </div>

            <div className="alert alert-warning py-2 mb-0">
              <strong>Chronic Conditions:</strong>
              <div className="mt-1">
                {record.chronicConditions || "None recorded"}
              </div>
            </div>
          </div>

          <div className="panel">
            <h4>Prescription history</h4>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Prescription</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Last dispensed</th>
                  </tr>
                </thead>
                <tbody>
                  {record.prescriptions?.map((rx: any) => (
                    <tr key={rx.id}>
                      <td>
                        <strong>{rx.prescriptionNumber}</strong>
                        <br />
                        <small className="text-secondary">
                          {formatPharmacyDate(rx.prescriptionDate)}{" "}
                          by {prescriberLabel(rx)}
                        </small>
                      </td>
                      <td>
                        <Status value={rx.status} />
                      </td>
                      <td>
                        <ul className="list-unstyled mb-0 small">
                          {rx.items?.map((item: any) => (
                            <li key={item.id}>
                              • {item.product.genericName}{" "}
                              {item.product.strength} (
                              {item.prescribedQuantity} {item.product.unit})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        {rx.dispensings?.[0]?.dispensedAt
                          ? formatPharmacyDateTime(rx.dispensings[0].dispensedAt)
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!record.prescriptions || record.prescriptions.length === 0) && (
                <Empty text="You have no prescriptions on file yet." />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
