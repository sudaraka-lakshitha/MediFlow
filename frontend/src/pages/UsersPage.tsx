import { formatPharmacyDate, formatPharmacyDateTime } from "../utils/pharmacyTime";
import { personNameInputProps } from '../utils/personName';
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { ActionsDropdown } from "../components/ActionsDropdown";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal, ModalActions } from "../components/Modal";
import { PasswordField } from "../components/PasswordField";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import { Pagination } from "../components/Pagination";
import { useClientPagination } from "../utils/useClientPagination";

type UserRow = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "PHARMACIST" | "CASHIER";
  cashierAccess: boolean;
  pharmacyReconciliationAccess: boolean;
  deliveryRefundApprovalAccess: boolean;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
  passwordChangedAt?: string | null;
  createdAt: string;
};
const empty = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "PHARMACIST" as UserRow["role"],
  cashierAccess: false,
  pharmacyReconciliationAccess: false,
  deliveryRefundApprovalAccess: false,
};

export function UsersPage() {
  const { user: current } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | "reset" | null>(null);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [confirm, setConfirm] = useState<UserRow | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<UserRow | null>(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ ...empty });
  const [search, setSearch] = useState("");
  const load = useCallback(
    () =>
      api
        .get("/users", { params: { search } })
        .then((r) => setRows(r.data.data))
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false)),
    [search],
  );
  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [load]);
  const pagination = useClientPagination(rows, 25);
  const openCreate = () => {
    setError("");
    setSelected(null);
    setForm({ ...empty });
    setModal("create");
  };
  const openEdit = (row: UserRow) => {
    setError("");
    setSelected(row);
    setForm({
      fullName: row.fullName,
      email: row.email,
      phone: row.phone || "",
      password: "",
      role: row.role,
      cashierAccess: row.cashierAccess,
      pharmacyReconciliationAccess: Boolean(row.pharmacyReconciliationAccess),
      deliveryRefundApprovalAccess: Boolean(row.deliveryRefundApprovalAccess),
    });
    setModal("edit");
  };
  const openReset = (row: UserRow) => {
    setError("");
    setSelected(row);
    setForm({ ...empty, password: "" });
    setModal("reset");
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (modal === "create") await api.post("/users", form);
      if (modal === "edit" && selected)
        await api.put(`/users/${selected.id}`, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role,
          cashierAccess: form.cashierAccess,
          pharmacyReconciliationAccess: form.pharmacyReconciliationAccess,
          deliveryRefundApprovalAccess: form.deliveryRefundApprovalAccess,
        });
      if (modal === "reset" && selected)
        await api.post(`/users/${selected.id}/reset-password`, {
          password: form.password,
        });
      if (modal === "reset") setNotice("Password reset. Existing sessions were revoked and the staff member must replace the temporary password.");
      setModal(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const toggle = async (row: UserRow) => {
    try {
      setNotice("");
      await api.patch(`/users/${row.id}/active`, { active: !row.active });
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    setError("");
    try {
      await api.delete(`/users/${confirm.id}`);
      setConfirm(null);
      load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const revokeSessions = async () => {
    if (!revokeTarget) return;
    setBusy(true);
    setError("");
    try {
      const response = await api.post(`/users/${revokeTarget.id}/revoke-sessions`);
      setNotice(response.data.message);
      setRevokeTarget(null);
      load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  if (loading) return <Loading />;
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>User administration</h2>
          <p>
            Manage administrators, pharmacists, and cashiers. Patient accounts
            are managed separately in the Patients tab.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-person-plus me-2" />
          Add staff
        </button>
      </div>
      <Alert message={error} />
      {notice && <div className="alert alert-success py-2">{notice}</div>}
      <div className="panel">
        <div className="panel-header">
          <div className="toolbar">
            <PredictiveSearchInput
              placeholder="Search users…"
              value={search}
              onChange={setSearch}
              suggestions={rows.flatMap((row) => [
                row.fullName,
                row.email,
                row.phone || "",
              ])}
            />
            <span className="record-count">{rows.length} accounts</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created</th>
                <th>Last login</th>
                <th>Status</th>
                <th className="table-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.fullName}</strong>
                    <br />
                    <small>{row.email}</small>
                  </td>
                  <td>{row.phone || "—"}</td>
                  <td>
                    {row.role}
                    {row.role === "PHARMACIST" && row.cashierAccess && (
                      <small className="d-block text-success">
                        Cashier access granted
                      </small>
                    )}
                  </td>
                  <td>{formatPharmacyDate(row.createdAt)}</td>
                  <td>
                    {row.lastLoginAt ? formatPharmacyDateTime(row.lastLoginAt) : "Never"}
                    {row.mustChangePassword && (
                      <small className="d-block text-warning">
                        Temporary password pending
                      </small>
                    )}
                  </td>
                  <td>
                    <Status value={row.active ? "ACTIVE" : "INACTIVE"} />
                  </td>
                  <td>
                    <ActionsDropdown
                      actions={[
                        {
                          label: "View staff activity",
                          icon: "activity",
                          onClick: () => navigate(`/audit?staff=${row.id}`),
                        },
                        {
                          label: "Edit account",
                          icon: "pencil",
                          onClick: () => openEdit(row),
                        },
                        {
                          label: "Reset password",
                          icon: "key",
                          onClick: () => openReset(row),
                        },
                        {
                          label: "Force sign out everywhere",
                          icon: "shield-lock",
                          onClick: () => setRevokeTarget(row),
                          disabled: row.id === current!.id,
                        },
                        {
                          label: row.active ? "Deactivate" : "Activate",
                          icon: row.active ? "person-dash" : "person-check",
                          onClick: () => toggle(row),
                          disabled: row.id === current!.id,
                        },
                        {
                          label: "Delete account",
                          icon: "trash",
                          danger: true,
                          onClick: () => setConfirm(row),
                          disabled: row.id === current!.id,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <Empty />}
        </div>
        <Pagination page={pagination.page} pageCount={pagination.pageCount} total={rows.length} pageSize={pagination.pageSize} onPageChange={pagination.setPage} />
      </div>
      {(modal === "create" || modal === "edit") && (
        <Modal
          title={
            modal === "create" ? "Create staff account" : "Edit user account"
          }
          onClose={() => setModal(null)}
        >
          <form onSubmit={save}>
            <div className="form-grid">
              <div>
                <label className="form-label">Full name</label>
                <input
                  className="form-control"
                  value={form.fullName}
                  {...personNameInputProps((fullName) => setForm((previous) => ({ ...previous, fullName })))}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  type="tel"
                  inputMode="numeric"
                  pattern="0[0-9]{9}"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                />
                <small className="text-secondary">
                  10 digits starting with 0
                </small>
              </div>
              <div>
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={form.role}
                  disabled={selected?.id === current!.id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as UserRow["role"],
                      pharmacyReconciliationAccess: false,
                    })
                  }
                >
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="CASHIER">Cashier</option>
                  <option value="ADMIN">Administrator</option>
                </select>
                {selected?.id === current!.id && (
                  <small className="text-secondary">
                    Your own administrator role cannot be changed while signed in.
                  </small>
                )}
              </div>
              {form.role === "PHARMACIST" && (
                <div className="full">
                  <div className="form-check border rounded-3 p-3">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="cashierAccess"
                      checked={form.cashierAccess}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          cashierAccess: event.target.checked,
                          pharmacyReconciliationAccess: event.target.checked && form.pharmacyReconciliationAccess,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="cashierAccess">
                      <strong>
                        Allow this pharmacist to process cashier payments
                      </strong>
                      <small className="d-block text-secondary">
                        Admin-controlled permission. It is disabled for
                        pharmacists by default.
                      </small>
                    </label>
                  </div>
                </div>
              )}
              {(form.role === 'CASHIER' || (form.role === 'PHARMACIST' && form.cashierAccess)) && <div className="full form-check border rounded-3 p-3">
                <input id="pharmacyReconciliationAccess" className="form-check-input ms-0 me-2" type="checkbox" checked={form.pharmacyReconciliationAccess} onChange={event => setForm({ ...form, pharmacyReconciliationAccess: event.target.checked })} />
                <label className="form-check-label" htmlFor="pharmacyReconciliationAccess"><strong>Allow pharmacy-wide daily reconciliation</strong><small className="d-block text-secondary">View all cashiers’ receipts, refunds and bank references, and confirm the pharmacy-wide daily balance. Individual cashier confirmations are still required. Changing permissions signs this user out.</small></label>
              </div>}
              {form.role === 'ADMIN' && <p className="full text-secondary small">Administrators automatically have pharmacy-wide reconciliation access.</p>}
              <div className="full form-check border rounded-3 p-3"><input id="deliveryRefundApprovalAccess" type="checkbox" className="form-check-input ms-0 me-2" checked={form.deliveryRefundApprovalAccess} onChange={event => setForm({ ...form, deliveryRefundApprovalAccess: event.target.checked })} /><label htmlFor="deliveryRefundApprovalAccess">Allow exceptional delivery-fee refund approval<small className="d-block text-secondary">Administrators have this permission automatically. Approvers cannot approve their own requests. Payout still requires cashier access.</small></label></div>
              {modal === "create" && (
                <div className="full">
                  <PasswordField
                    value={form.password}
                    onChange={(password) => setForm({ ...form, password })}
                    label="Temporary password"
                  />
                </div>
              )}
            </div>
            <Alert message={error} />
            <ModalActions
              onClose={() => setModal(null)}
              submitLabel={
                modal === "create" ? "Create account" : "Save changes"
              }
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {modal === "reset" && selected && (
        <Modal
          title={`Reset password — ${selected.fullName}`}
          onClose={() => setModal(null)}
          size="sm"
        >
          <form onSubmit={save}>
            <PasswordField
              value={form.password}
              onChange={(password) => setForm({ ...form, password })}
              label="New temporary password"
            />
            <small className="text-secondary">
              Use at least 8 characters with a letter and number. All existing
              sessions will be revoked and this temporary password must be changed
              at the next sign-in.
            </small>
            <Alert message={error} />
            <ModalActions
              onClose={() => setModal(null)}
              submitLabel="Reset password"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {confirm && (
        <ConfirmModal
          title="Delete user account?"
          message={`${confirm.fullName} will lose access. Pharmacy history will be retained.`}
          confirmLabel="Delete account"
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          busy={busy}
        />
      )}
      {revokeTarget && (
        <ConfirmModal
          title="Force sign out on every device?"
          message={`${revokeTarget.fullName} will need to sign in again on every browser or laptop. Their password will not be changed.`}
          confirmLabel="Revoke sessions"
          onConfirm={revokeSessions}
          onClose={() => setRevokeTarget(null)}
          busy={busy}
        />
      )}
    </>
  );
}
