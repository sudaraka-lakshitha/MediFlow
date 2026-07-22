import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { ActionsDropdown } from "../components/ActionsDropdown";
import { Modal, ModalActions } from "../components/Modal";
import { PasswordField } from "../components/PasswordField";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import { useDebouncedValue } from "../utils/useDebouncedValue";

type Patient = {
  id: number;
  patientNumber: string;
  dateOfBirth?: string;
  address?: string;
  allergies?: string;
  registrationSource: "SELF" | "ADMIN" | "PHARMACIST";
  registeredBy?: { fullName: string; role: string };
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    active: boolean;
    createdAt: string;
  };
};
const empty = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  dateOfBirth: "",
  address: "",
  allergies: "",
};
const prescriberLabel = (rx: { prescriberTitle?: string; prescriberName?: string }) =>
  [rx.prescriberTitle, rx.prescriberName].filter(Boolean).join(" ") || "Not mentioned";
export function PatientsPage() {
  const { user } = useAuth();
  const admin = user!.role === "ADMIN";
  const [rows, setRows] = useState<Patient[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | "reset" | "notice" | null>(null);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [credentials, setCredentials] = useState<{
    email: string;
    temporaryPassword: string;
  } | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [healthRecord, setHealthRecord] = useState<any>(null);
  const [showHealthRecord, setShowHealthRecord] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: "", message: "" });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebouncedValue(search);

  const viewHealthRecord = async (p: Patient) => {
    setBusy(true);
    setError("");
    try {
      const res = await api.get(`/patients/${p.id}/health-record`);
      setHealthRecord(res.data.data);
      setShowHealthRecord(true);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const load = useCallback(
    () =>
      api
        .get("/patients", { params: debouncedSearch ? { search: debouncedSearch } : {} })
        .then((r) => {
          setRows(r.data.data);
          setTotal(r.data.total ?? r.data.data.length);
        })
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false)),
    [debouncedSearch],
  );
  useEffect(() => {
    load();
  }, [load]);
  const openCreate = () => {
    setSelected(null);
    setForm({ ...empty });
    setModal("create");
  };
  const openEdit = (p: Patient) => {
    setSelected(p);
    setForm({
      fullName: p.user.fullName,
      email: p.user.email,
      phone: p.user.phone || "",
      password: "",
      dateOfBirth: p.dateOfBirth?.slice(0, 10) || "",
      address: p.address || "",
      allergies: p.allergies || "",
    });
    setModal("edit");
  };
  const openReset = (p: Patient) => {
    setSelected(p);
    setForm({ ...empty });
    setModal("reset");
  };
  const sendNotice = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    try {
      await api.post(`/patients/${selected.id}/notices`, noticeForm);
      setModal(null);
      setNoticeForm({ title: "", message: "" });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let response: any = null;
      if (modal === "create")
        response = await api.post("/patients", {
          ...form,
          dateOfBirth: form.dateOfBirth || null,
        });
      if (modal === "edit" && selected)
        await api.put(`/patients/${selected.id}`, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth || null,
          address: form.address,
          allergies: form.allergies,
        });
      if (modal === "reset" && selected)
        response = await api.post(`/patients/${selected.id}/reset-password`, {
          password: form.password,
        });
      if (response?.data?.data?.temporaryPassword)
        setCredentials({
          email:
            response.data.data.user?.email ||
            response.data.data.email ||
            form.email,
          temporaryPassword: response.data.data.temporaryPassword,
        });
      setModal(null);
      load();
    } catch (e2) {
      setError(errorMessage(e2));
    } finally {
      setBusy(false);
    }
  };
  const toggle = async (patient: Patient) => {
    try {
      await api.patch(`/patients/${patient.id}/active`, {
        active: !patient.user.active,
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  if (loading) return <Loading />;
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Patient accounts</h2>
          <p>
            Create patient logins, manage activation, and track who registered
            each account.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-person-plus me-2" />
          Create patient
        </button>
      </div>
      <Alert message={error} />
      <div className="panel">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
          <div className="search-select" style={{ maxWidth: 340 }}>
            <input
              className="form-control search-select-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, phone, email, or patient number"
            />
            <i className="bi bi-search search-select-icon" />
          </div>
          <span className="text-secondary small">
            Showing {rows.length} of {total} patient{total === 1 ? "" : "s"}
          </span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Registration source</th>
                <th>Allergies</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.user.fullName}</strong>
                    <br />
                    <small>{p.patientNumber}</small>
                  </td>
                  <td>
                    {p.user.email}
                    <br />
                    <small>{p.user.phone || "—"}</small>
                  </td>
                  <td>
                    <Status value={p.registrationSource} />
                    <br />
                    <small>
                      {p.registrationSource === "SELF"
                        ? "Patient self-registration"
                        : `Created by ${p.registeredBy?.fullName || p.registrationSource}`}
                    </small>
                  </td>
                  <td>{p.allergies || "Not recorded"}</td>
                  <td>
                    <Status value={p.user.active ? "ACTIVE" : "INACTIVE"} />
                  </td>
                  <td>
                    <ActionsDropdown
                      actions={[
                        {
                          label: "View health record",
                          icon: "file-medical",
                          onClick: () => viewHealthRecord(p),
                        },
                        {
                          label: "Edit patient",
                          icon: "pencil",
                          onClick: () => openEdit(p),
                        },
                        {
                          label: "Send notice",
                          icon: "bell",
                          onClick: () => { setSelected(p); setNoticeForm({ title: "", message: "" }); setModal("notice"); },
                        },
                        {
                          label: "Reset password",
                          icon: "key",
                          onClick: () => openReset(p),
                        },
                        ...(admin
                          ? [
                              {
                                label: p.user.active
                                  ? "Deactivate patient"
                                  : "Activate patient",
                                icon: p.user.active
                                  ? "person-dash"
                                  : "person-check",
                                danger: p.user.active,
                                  onClick: () => toggle(p),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <Empty text="No patient accounts found." />}
        </div>
      </div>
      {(modal === "create" || modal === "edit") && (
        <Modal
          title={
            modal === "create"
              ? "Create patient account"
              : "Edit patient account"
          }
          onClose={() => setModal(null)}
          size="lg"
        >
          <form onSubmit={save}>
            <div className="form-grid">
              {[
                ["fullName", "Full name", "text"],
                ["email", "Email address", "email"],
                ["phone", "Phone number", "tel"],
                ["dateOfBirth", "Date of birth", "date"],
                ["address", "Address", "text"],
                ["allergies", "Allergies / medicine warnings", "text"],
              ].map(([key, label, type]) => (
                <div
                  className={
                    ["address", "allergies"].includes(key) ? "full" : ""
                  }
                  key={key}
                >
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    type={type}
                    inputMode={key === "phone" ? "numeric" : undefined}
                    pattern={key === "phone" ? "0[0-9]{9}" : undefined}
                    maxLength={key === "phone" ? 10 : undefined}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]:
                          key === "phone"
                            ? e.target.value.replace(/\D/g, "").slice(0, 10)
                            : e.target.value,
                      })
                    }
                    required={[
                      "fullName",
                      "email",
                      "phone",
                      "dateOfBirth",
                    ].includes(key)}
                  />
                </div>
              ))}
              {modal === "create" && (
                <div className="full">
                  <PasswordField
                    value={form.password}
                    onChange={(password) => setForm({ ...form, password })}
                    label="Temporary password (optional)"
                  />
                  <small className="text-secondary">
                    Leave blank to generate a secure temporary password
                    automatically.
                  </small>
                </div>
              )}
            </div>
            <ModalActions
              onClose={() => setModal(null)}
              submitLabel={
                modal === "create" ? "Create patient" : "Save changes"
              }
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {modal === "notice" && selected && (
        <Modal title={`Send notice to ${selected.user.fullName}`} onClose={() => setModal(null)} size="sm">
          <form onSubmit={sendNotice}>
            <label className="form-label">Notice title</label>
            <input className="form-control mb-3" value={noticeForm.title} onChange={(event) => setNoticeForm({ ...noticeForm, title: event.target.value })} maxLength={150} required />
            <label className="form-label">Message</label>
            <textarea className="form-control" value={noticeForm.message} onChange={(event) => setNoticeForm({ ...noticeForm, message: event.target.value })} rows={5} maxLength={1000} required />
            <ModalActions onClose={() => setModal(null)} submitLabel="Send notice" busy={busy} />
          </form>
        </Modal>
      )}
      {modal === "reset" && selected && (
        <Modal
          title={`Reset password — ${selected.user.fullName}`}
          onClose={() => setModal(null)}
          size="sm"
        >
          <form onSubmit={save}>
            <PasswordField
              value={form.password}
              onChange={(password) => setForm({ ...form, password })}
              label="New temporary password (optional)"
            />
            <small className="text-secondary d-block mt-2">
              Leave blank to generate one automatically.
            </small>
            <ModalActions
              onClose={() => setModal(null)}
              submitLabel="Reset password"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {credentials && (
        <Modal
          title="Temporary patient login"
          onClose={() => setCredentials(null)}
          size="sm"
        >
          <div className="alert alert-warning">
            This password is shown only once. Give it directly to the patient
            and ask them to replace it at first login.
          </div>
          <label className="form-label">Email</label>
          <input className="form-control" value={credentials.email} readOnly />
          <label className="form-label mt-3">Temporary password</label>
          <div className="input-group">
            <input
              className="form-control"
              value={credentials.temporaryPassword}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(credentials.temporaryPassword)
              }
            >
              Copy
            </button>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setCredentials(null)}
            >
              Done
            </button>
          </div>
        </Modal>
      )}
      {showHealthRecord && healthRecord && (
        <Modal
          title={`Health Record - ${healthRecord.user.fullName}`}
          onClose={() => {
            setShowHealthRecord(false);
            setHealthRecord(null);
          }}
          size="lg"
        >
          <div className="patient-health-record-summary mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Patient Number:</strong> <code>{healthRecord.patientNumber}</code>
              </div>
              <div className="col-md-6">
                <strong>Date of Birth:</strong> {healthRecord.dateOfBirth ? new Date(healthRecord.dateOfBirth).toLocaleDateString() : "—"}
              </div>
              <div className="col-md-6">
                <strong>Contact Phone:</strong> {healthRecord.user.phone || "—"}
              </div>
              <div className="col-md-6">
                <strong>Email Address:</strong> {healthRecord.user.email}
              </div>
            </div>
            
            <div className="alert alert-danger mt-3 mb-2 py-2">
              <strong>Allergies &amp; Safety Warnings:</strong>
              <div className="mt-1">{healthRecord.allergies || "None recorded"}</div>
            </div>
            
            <div className="alert alert-warning py-2">
              <strong>Chronic Conditions:</strong>
              <div className="mt-1">{healthRecord.chronicConditions || "None recorded"}</div>
            </div>
          </div>

          <h4>Prescription History</h4>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Prescription Info</th>
                  <th>Status</th>
                  <th>Prescribed Items</th>
                  <th>Last Dispensed</th>
                </tr>
              </thead>
              <tbody>
                {healthRecord.prescriptions?.map((rx: any) => (
                  <tr key={rx.id}>
                    <td>
                      <strong>{rx.prescriptionNumber}</strong>
                      <br />
                      <small className="text-secondary">
                        {new Date(rx.prescriptionDate).toLocaleDateString()} by {prescriberLabel(rx)}
                      </small>
                    </td>
                    <td>
                      <Status value={rx.status} />
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0 small">
                        {rx.items?.map((item: any) => (
                          <li key={item.id}>
                            • {item.product.genericName} {item.product.strength} ({item.prescribedQuantity} {item.product.unit})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {rx.dispensings?.[0]?.dispensedAt ? new Date(rx.dispensings[0].dispensedAt).toLocaleString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!healthRecord.prescriptions || healthRecord.prescriptions.length === 0) && (
              <Empty text="No prescriptions found for this patient." />
            )}
          </div>
          
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary" onClick={() => {
              setShowHealthRecord(false);
              setHealthRecord(null);
            }}>
              Close Record
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
