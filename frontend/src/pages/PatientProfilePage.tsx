// MY PROFILE (patient)
// A patient sees and updates their own details and notices from the pharmacy.

import { personNameInputProps } from '../utils/personName';
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { sessionToken } from "../auth/authStorage";
import { Alert } from "../components/Ui";

export function PatientProfilePage() {
  const { user, acceptSession } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.patientProfile?.dateOfBirth ? user.patientProfile.dateOfBirth.slice(0, 10) : "");
  const [address, setAddress] = useState(user?.patientProfile?.address || "");
  const [allergies, setAllergies] = useState(user?.patientProfile?.allergies || "");
  const [chronicConditions, setChronicConditions] = useState(user?.patientProfile?.chronicConditions || "");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVersion, setEditVersion] = useState(user?.updatedAt);
  const restore = useCallback(() => {
    setFullName(user?.fullName || ''); setPhone(user?.phone || '');
    setDateOfBirth(user?.patientProfile?.dateOfBirth?.slice(0, 10) || '');
    setAddress(user?.patientProfile?.address || ''); setAllergies(user?.patientProfile?.allergies || '');
    setChronicConditions(user?.patientProfile?.chronicConditions || '');
  }, [user]);
  useEffect(() => { if (!editing) restore(); }, [restore, editing]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing || busy) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.patch("/auth/profile", {
        expectedUpdatedAt: editVersion,
        fullName,
        phone,
        dateOfBirth: dateOfBirth || null,
        address,
        allergies,
        chronicConditions
      });
      
      const token = sessionToken() || "";
      acceptSession({ token, user: response.data.user });
      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>My Profile</h2>
          <p>Manage your personal profile details, contact information, and medical allergies.</p>
        </div>
      </div>
      
      <Alert message={error} />
      {success && <div className="alert alert-success">{success}</div>}

      <div className="panel max-width-md" style={{ maxWidth: '720px' }}>
        <div className="panel-header">
          <h3>Personal Details</h3>
        </div>
        
        <form onSubmit={save} className="p-3">
          <fieldset disabled={!editing || busy}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-secondary">Patient Number</label>
              <input
                className="form-control bg-light text-secondary"
                value={user?.patientProfile?.patientNumber || "N/A"}
                disabled
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-secondary">Email Address</label>
              <input
                className="form-control bg-light text-secondary"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="profile-full-name">Full Name</label>
              <input
                id="profile-full-name"
                className="form-control"
                value={fullName}
                {...personNameInputProps(setFullName)}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                pattern="(?:0[0-9]{9}|\+94[0-9]{9})"
                maxLength={12}
                placeholder="0701234567 or +94701234567"
                className="form-control"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                className="form-control"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Home Address</label>
              <input
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label text-danger">Allergies &amp; Drug Warnings</label>
              <textarea
                className="form-control border-danger-subtle"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="List any known allergies to medicines, foods, or substances."
                rows={3}
              />
            </div>

            <div className="col-12">
              <label className="form-label text-warning-emphasis">Chronic Conditions</label>
              <textarea
                className="form-control border-warning-subtle"
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                placeholder="List any chronic medical conditions (e.g., Hypertension, Diabetes, Asthma)."
                rows={3}
              />
            </div>
          </div>

          </fieldset>
          <div className="d-flex justify-content-end gap-2 mt-4">
            {!editing ? <button type="button" className="btn btn-primary" onClick={() => { restore(); setEditVersion(user?.updatedAt); setError(''); setSuccess(''); setEditing(true); }}>Edit profile</button> : <>
            <button type="button" className="btn btn-light" disabled={busy} onClick={() => { restore(); setError(''); setEditing(false); }}>Cancel</button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={busy}
            >
              {busy ? "Saving Changes..." : "Save Changes"}
            </button>
            </>}
          </div>
        </form>
      </div>
    </>
  );
}
