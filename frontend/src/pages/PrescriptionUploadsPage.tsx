import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import "../prescriptionUploads.css";

type Upload = {
  id: number;
  originalName: string;
  mimeType: string;
  patientNote?: string;
  prepareRequested: boolean;
  orderedForSelf: boolean;
  recipientName?: string;
  recipientRelationship?: string;
  recipientDateOfBirth?: string;
  status: string;
  availabilityNotes?: string;
  estimatedTotal?: string;
  estimateDetails?: {
    input?: {
      items?: { productId: number; quantity: number }[];
      retailItems?: { productId: number; quantity: number }[];
      couponCode?: string | null;
      containerFee?: number;
      bottleCount?: number;
      bottleFeePerBottle?: number;
      tax?: number;
    };
    quote?: any;
    savedAt?: string;
  };
  reviewedAt?: string;
  createdAt: string;
  deleteAt?: string;
  patient: {
    id: number;
    fullName: string;
    email: string;
    patientProfile?: { id: number; patientNumber: string };
  };
  reviewedBy?: { id: number; fullName: string; role: string };
  prescription?: { id: number; prescriptionNumber: string; status: string };
};

const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dobFromAge = (age: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  return date.toISOString().slice(0, 10);
};
const ageFromDob = (dob?: string) => {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age -= 1;
  return String(age);
};
const liquidUnits = ["ml", "millilitre", "milliliter", "l", "litre", "liter"];
const isLiquidProduct = (product: any) =>
  liquidUnits.includes(String(product?.unit || "").toLowerCase()) ||
  /syrup|suspension|solution|elixir|liquid/i.test(
    String(product?.dosageForm || ""),
  );
const usableStock = (product: any) =>
  product.batches
    .filter((batch: any) => new Date(batch.expiryDate) >= new Date())
    .reduce(
      (sum: number, batch: any) => sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0),
      0,
    );
const emptyEstimate = () => ({
  items: [{ productId: "", quantity: 1 }],
  retailItems: [],
  couponCode: "",
  tax: 0,
  addBottleFee: false,
  bottleCount: 1,
  bottleFeePerBottle: 0,
  containerFee: 0,
});

export function PrescriptionUploadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patient = user!.role === "PATIENT";
  const admin = user!.role === "ADMIN";
  const [rows, setRows] = useState<Upload[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [review, setReview] = useState<Upload | null>(null);
  const [reviewUrl, setReviewUrl] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [documentViewerHeight, setDocumentViewerHeight] = useState(620);
  const [preview, setPreview] = useState<{ item: Upload; url: string; text?: string } | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [uploadForm, setUploadForm] = useState<{
    file: File | null;
    prescriptionText: string;
    patientNote: string;
    prepareRequested: boolean;
    orderedForSelf: boolean;
    recipientName: string;
    recipientRelationship: string;
    recipientDateOfBirth: string;
  }>({ file: null, prescriptionText: "", patientNote: "", prepareRequested: true, orderedForSelf: true, recipientName: "", recipientRelationship: "", recipientDateOfBirth: "" });
  const [reviewForm, setReviewForm] = useState({
    status: "AVAILABLE",
    availabilityNotes: "",
    estimatedTotal: "",
  });
  const [estimateForm, setEstimateForm] = useState<any>(emptyEstimate());
  const [estimateQuote, setEstimateQuote] = useState<any>(null);
  const [estimateBusy, setEstimateBusy] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [retentionDays, setRetentionDays] = useState(30);
  const load = useCallback(async () => {
    try {
      setError("");
      const response = await api.get("/prescription-uploads");
      setRows(response.data.data);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
    if (!patient)
      api
        .get("/catalog/products")
        .then((response) => {
          const activeProducts = response.data.data.filter(
            (product: any) => product.active,
          );
          setProducts(
            activeProducts.filter(
              (product: any) => product.productType === "MEDICINE",
            ),
          );
          setRetailProducts(
            activeProducts.filter(
              (product: any) =>
                !product.prescriptionRequired && usableStock(product) > 0,
            ),
          );
        })
        .catch((caught) => setError(errorMessage(caught)));
    if (admin)
      api
        .get("/prescription-uploads/retention")
        .then((response) => setRetentionDays(response.data.data.days))
        .catch(() => undefined);
  }, [load, admin, patient]);
  const saveRetention = async () => {
    setBusy(true);
    setError("");
    try {
      await api.put("/prescription-uploads/retention", { days: retentionDays });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const acceptEstimate = async (item: Upload) => {
    try {
      await api.put(`/prescription-uploads/${item.id}/accept`);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const saveDeadline = async (item: Upload, value: string) => {
    try {
      await api.put(`/prescription-uploads/${item.id}/deletion-deadline`, {
        deleteAt: `${value}T23:59:59`,
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };

  const submitUpload = async (event: FormEvent) => {
    event.preventDefault();
    const typedText = uploadForm.prescriptionText.trim();
    if (!uploadForm.file && !typedText)
      return setError("Upload a prescription file, type the prescription and retail items, or both.");
    if (!uploadForm.file && typedText.length < 10)
      return setError("Type at least 10 characters describing the prescription or requested retail items.");
    const file =
      uploadForm.file ||
      new File([typedText], `typed-prescription-${Date.now()}.txt`, { type: "text/plain" });
    if (file.size > 2_500_000)
      return setError("Prescription files must be 2.5 MB or smaller.");
    if (
      !["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"].includes(
        file.type,
      )
    )
      return setError("Upload a PDF, JPEG, PNG, or WebP prescription, or enter it as text.");
    const patientNote = [
      uploadForm.file && typedText ? `Typed request:\n${typedText}` : null,
      uploadForm.patientNote || null,
    ]
      .filter(Boolean)
      .join("\n\n");
    setBusy(true);
    setError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      await api.post("/prescription-uploads", {
        originalName: file.name,
        mimeType: file.type,
        fileBase64: dataUrl.split(",")[1],
        patientNote: patientNote || null,
        prepareRequested: uploadForm.prepareRequested,
        orderedForSelf: uploadForm.orderedForSelf,
        recipientName: uploadForm.orderedForSelf ? null : uploadForm.recipientName,
        recipientRelationship: uploadForm.orderedForSelf ? null : uploadForm.recipientRelationship,
        recipientDateOfBirth: uploadForm.orderedForSelf ? null : uploadForm.recipientDateOfBirth,
      });
      setUploadOpen(false);
      setUploadForm({ file: null, prescriptionText: "", patientNote: "", prepareRequested: true, orderedForSelf: true, recipientName: "", recipientRelationship: "", recipientDateOfBirth: "" });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const openFile = async (item: Upload) => {
    try {
      const response = await api.get(`/prescription-uploads/${item.id}/file`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const text = item.mimeType === "text/plain" ? await response.data.text() : undefined;
      if (preview) URL.revokeObjectURL(preview.url);
      setPreview({ item, url, text });
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const closeReview = () => {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl("");
    setReviewText("");
    setReview(null);
  };
  const openReview = async (item: Upload) => {
    setError("");
    setReview(item);
    setReviewForm({
      status: item.status === "PENDING" ? "AVAILABLE" : item.status,
      availabilityNotes: item.availabilityNotes || "",
      estimatedTotal: item.estimatedTotal || "",
    });
    const savedInput = item.estimateDetails?.input;
    setEstimateForm(
      savedInput
        ? {
            ...emptyEstimate(),
            items: savedInput.items?.length
              ? savedInput.items
              : emptyEstimate().items,
            retailItems: savedInput.retailItems || [],
            couponCode: savedInput.couponCode || "",
            tax: Number(savedInput.tax || 0),
            addBottleFee: Number(savedInput.containerFee || 0) > 0,
            bottleCount: Number(savedInput.bottleCount || 1),
            bottleFeePerBottle: Number(
              savedInput.bottleFeePerBottle || 0,
            ),
            containerFee: Number(savedInput.containerFee || 0),
          }
        : emptyEstimate(),
    );
    setEstimateQuote(item.estimateDetails?.quote || null);
    setEstimateError("");
    try {
      const response = await api.get(`/prescription-uploads/${item.id}/file`, {
        responseType: "blob",
      });
      setReviewUrl(URL.createObjectURL(response.data));
      setReviewText(item.mimeType === "text/plain" ? await response.data.text() : "");
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const updateEstimateItem = (
    index: number,
    field: "productId" | "quantity",
    value: string | number,
  ) => {
    const items = [...estimateForm.items];
    items[index] = { ...items[index], [field]: value };
    setEstimateForm({ ...estimateForm, items });
    setEstimateQuote(null);
    setEstimateError("");
  };
  const updateEstimateRetailItem = (
    index: number,
    field: "productId" | "quantity",
    value: string | number,
  ) => {
    const retailItems = [...estimateForm.retailItems];
    retailItems[index] = { ...retailItems[index], [field]: value };
    setEstimateForm({ ...estimateForm, retailItems });
    setEstimateQuote(null);
    setEstimateError("");
  };
  const updateBottleFee = (
    bottleCount: number,
    bottleFeePerBottle: number,
    enabled = estimateForm.addBottleFee,
  ) => {
    setEstimateForm({
      ...estimateForm,
      addBottleFee: enabled,
      bottleCount,
      bottleFeePerBottle,
      containerFee: enabled
        ? Number((bottleCount * bottleFeePerBottle).toFixed(2))
        : 0,
    });
    setEstimateQuote(null);
  };
  const selectedEstimateProducts = estimateForm.items
    .map((item: any) =>
      products.find(
        (product) => Number(product.id) === Number(item.productId),
      ),
    )
    .filter(Boolean);
  const estimateHasLiquid = selectedEstimateProducts.some(isLiquidProduct);
  const calculateEstimate = async () => {
    if (!review) return;
    const items = estimateForm.items
      .filter((item: any) => item.productId && Number(item.quantity) > 0)
      .map((item: any) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }));
    const retailItems = estimateForm.retailItems
      .filter((item: any) => item.productId && Number(item.quantity) > 0)
      .map((item: any) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }));
    if (!items.length) {
      setEstimateError("Add at least one medicine and quantity.");
      return;
    }
    setEstimateBusy(true);
    setEstimateError("");
    try {
      const response = await api.post(
        `/prescription-uploads/${review.id}/estimate-quote`,
        {
          items,
          retailItems,
          couponCode: estimateForm.couponCode || null,
          containerFee: estimateHasLiquid && estimateForm.addBottleFee
            ? Number(estimateForm.containerFee)
            : 0,
          bottleCount: Number(estimateForm.bottleCount || 1),
          bottleFeePerBottle: Number(
            estimateForm.bottleFeePerBottle || 0,
          ),
          tax: Number(estimateForm.tax),
        },
      );
      setEstimateQuote(response.data.data);
      const estimateDetails = {
        input: {
          items,
          retailItems,
          couponCode: estimateForm.couponCode || null,
          containerFee:
            estimateHasLiquid && estimateForm.addBottleFee
              ? Number(estimateForm.containerFee)
              : 0,
          bottleCount: Number(estimateForm.bottleCount || 1),
          bottleFeePerBottle: Number(
            estimateForm.bottleFeePerBottle || 0,
          ),
          tax: Number(estimateForm.tax),
        },
        quote: response.data.data,
        savedAt: new Date().toISOString(),
      };
      setReviewForm((current) => ({
        ...current,
        estimatedTotal: String(response.data.data.total),
      }));
      setReview((current) =>
        current
          ? {
              ...current,
              estimatedTotal: String(response.data.data.total),
              estimateDetails,
            }
          : current,
      );
      setRows((current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,
                estimatedTotal: String(response.data.data.total),
                estimateDetails,
              }
            : item,
        ),
      );
    } catch (caught) {
      setEstimateQuote(null);
      setEstimateError(errorMessage(caught));
    } finally {
      setEstimateBusy(false);
    }
  };
  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!review) return;
    setBusy(true);
    setError("");
    try {
      await api.put(`/prescription-uploads/${review.id}/review`, {
        ...reviewForm,
        estimatedTotal:
          ["UNAVAILABLE", "REJECTED"].includes(reviewForm.status)
            ? null
            : Number(reviewForm.estimatedTotal),
      });
      closeReview();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const rejectUpload = async () => {
    if (!review) return;
    if (reviewForm.availabilityNotes.trim().length < 3) {
      setError("Enter a rejection reason in the notes before rejecting this upload.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.put(`/prescription-uploads/${review.id}/review`, {
        status: "REJECTED",
        availabilityNotes: reviewForm.availabilityNotes.trim(),
        estimatedTotal: null,
      });
      closeReview();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const filtered = statusFilter
    ? rows.filter((item) => item.status === statusFilter)
    : rows;
  if (loading) return <Loading />;

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Uploaded prescriptions</h2>
          <p>
            {patient
              ? "Send your prescription directly to the pharmacy for availability review, pricing, cashier payment, and collection."
              : "Review remotely submitted prescriptions and convert them into structured pharmacy orders."}
          </p>
        </div>
        {patient && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError("");
              setUploadForm({
                file: null,
                prescriptionText: "",
                patientNote: "",
                prepareRequested: true,
                orderedForSelf: true,
                recipientName: "",
                recipientRelationship: "",
                recipientDateOfBirth: "",
              });
              setUploadOpen(true);
            }}
          >
            <i className="bi bi-cloud-arrow-up me-2" />
            Upload prescription
          </button>
        )}
      </div>
      <Alert message={error} />
      {admin && (
        <div className="panel mb-3">
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div>
              <label className="form-label">Default upload retention</label>
              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  max="365"
                  value={retentionDays}
                  onChange={(event) =>
                    setRetentionDays(Number(event.target.value))
                  }
                />
                <span className="input-group-text">days</span>
              </div>
            </div>
            <button
              className="btn btn-outline-primary"
              disabled={busy}
              onClick={saveRetention}
            >
              Save retention policy
            </button>
            <small className="text-secondary">
              New uploads use this automatic deletion deadline. Individual
              deadlines can be changed on each card.
            </small>
          </div>
        </div>
      )}
      <div className="panel upload-filter">
        <label className="form-label mb-0">Status</label>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Awaiting review</option>
          <option value="AVAILABLE">Available</option>
          <option value="PARTIALLY_AVAILABLE">Partially available</option>
          <option value="UNAVAILABLE">Unavailable</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <span>{filtered.length} request(s)</span>
      </div>
      <div className="upload-grid">
        {filtered.map((item) => (
          <article className="panel upload-card" key={item.id}>
            <div className="upload-card-heading">
              <div className="upload-file-icon">
                <i
                  className={`bi bi-file-earmark-${item.mimeType === "application/pdf" ? "pdf" : item.mimeType === "text/plain" ? "text" : "image"}`}
                />
              </div>
              <div>
                <strong>{item.originalName}</strong>
                <small>
                  {patient
                    ? new Date(item.createdAt).toLocaleString()
                    : `${item.patient.fullName} · ${item.patient.email} · ${new Date(item.createdAt).toLocaleString()}`}
                </small>
              </div>
              <Status value={item.status} />
            </div>
            {item.patientNote && (
              <div className="upload-note">
                <small>Patient note</small>
                <p>{item.patientNote}</p>
              </div>
            )}
            <div
              className={`preparation-preference ${item.prepareRequested ? "prepare" : "quote-only"}`}
            >
              <i
                className={`bi bi-${item.prepareRequested ? "bag-check" : "clipboard-data"}`}
              />
              <div>
                <small>Customer request</small>
                <strong>
                  {item.prepareRequested
                    ? "Prepare medicines for collection"
                    : "Availability and price review only"}
                </strong>
              </div>
            </div>
            <div className="availability-box">
              <div>
                <small>Medicine availability</small>
                <strong>
                  {item.status === "PENDING"
                    ? "Waiting for pharmacist review"
                    : item.status.replaceAll("_", " ").toLowerCase()}
                </strong>
              </div>
              <div>
                <small>Estimated final invoice</small>
                <strong>
                  {item.estimatedTotal != null
                    ? money(item.estimatedTotal)
                    : "Not available"}
                </strong>
              </div>
            </div>
            {patient && item.estimatedTotal != null && (
              <div className="alert alert-warning small mt-2 mb-0">
                <i className="bi bi-exclamation-triangle me-2" />
                This amount is an estimate based on current prices, stock,
                discounts, and fees. It may change after the pharmacist's final
                review and is not guaranteed until the final invoice is issued.
              </div>
            )}
            {patient &&
              item.estimatedTotal != null &&
              !item.prepareRequested &&
              ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(item.status) && (
                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={() => acceptEstimate(item)}
                >
                  <i className="bi bi-check-circle me-1" />
                  Accept — prepare my medicines
                </button>
              )}
            {item.availabilityNotes && (
              <p className="review-note">{item.availabilityNotes}</p>
            )}
            {item.reviewedBy && (
              <small className="reviewed-by">
                Reviewed by {item.reviewedBy.fullName}
                {item.reviewedAt
                  ? ` on ${new Date(item.reviewedAt).toLocaleString()}`
                  : ""}
              </small>
            )}
            <div className="mt-2">
              <small className="text-secondary">
                Automatic deletion:{" "}
                {item.deleteAt
                  ? new Date(item.deleteAt).toLocaleString()
                  : "Not scheduled"}
              </small>
              {admin && (
                <input
                  className="form-control form-control-sm mt-1"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={item.deleteAt?.slice(0, 10) || ""}
                  onChange={(event) => saveDeadline(item, event.target.value)}
                />
              )}
            </div>
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => openFile(item)}
              >
                <i className="bi bi-eye me-1" />
                View prescription
              </button>
              {!patient && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openReview(item)}
                >
                  <i className="bi bi-clipboard-check me-1" />
                  Review availability
                </button>
              )}
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="panel">
            <Empty
              text={
                patient
                  ? "You have not uploaded a prescription yet."
                  : "No prescription uploads match this status."
              }
            />
          </div>
        )}
      </div>

      {uploadOpen && (
        <Modal
          title="Upload prescription"
          onClose={() => setUploadOpen(false)}
          size="sm"
        >
          <form onSubmit={submitUpload}>
            <div className="alert alert-info small">
              Upload a clear PDF/image, type the prescription and retail-item request, or both. The pharmacy will review it; the estimate is not a final invoice.
            </div>
            <label className="form-label">Prescription file (optional)</label>
            <input className="form-control" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setUploadForm({ ...uploadForm, file: event.target.files?.[0] || null })} />
            <label className="form-label mt-3">Type prescription / retail items (optional)</label>
            <textarea className="form-control" rows={6} maxLength={5000} value={uploadForm.prescriptionText} onChange={(event) => setUploadForm({ ...uploadForm, prescriptionText: event.target.value })} placeholder={'Type each prescribed medicine and direction on a new line.\n\nRetail items (optional): include product name and quantity.'} />
            <small className="text-secondary">Provide a file, type the details, or both — include medicine names, strengths, directions, and any non-prescription retail products with quantities.</small>
            <label className="form-label mt-3">
              Message to pharmacist (optional)
            </label>
            <textarea
              className="form-control"
              maxLength={500}
              value={uploadForm.patientNote}
              onChange={(event) =>
                setUploadForm({
                  ...uploadForm,
                  patientNote: event.target.value,
                })
              }
              placeholder="For example: please confirm whether all medicines are available."
            />
            <fieldset className="mt-3">
              <legend className="form-label">Who is this prescription for?</legend>
              <div className="recipient-choice-grid">
                <label className={`preparation-choice ${uploadForm.orderedForSelf ? "selected" : ""}`}><input type="radio" name="recipient" checked={uploadForm.orderedForSelf} onChange={() => setUploadForm({ ...uploadForm, orderedForSelf: true })} /><span><strong>For me</strong><small>I am the patient named on this prescription.</small></span></label>
                <label className={`preparation-choice ${!uploadForm.orderedForSelf ? "selected" : ""}`}><input type="radio" name="recipient" checked={!uploadForm.orderedForSelf} onChange={() => setUploadForm({ ...uploadForm, orderedForSelf: false })} /><span><strong>For someone else</strong><small>I am uploading this on behalf of another person.</small></span></label>
              </div>
              {!uploadForm.orderedForSelf && <div className="row g-2 mt-1"><div className="col-sm-5"><label className="form-label">Recipient full name</label><input className="form-control" placeholder="Full name" value={uploadForm.recipientName} onChange={(event) => setUploadForm({ ...uploadForm, recipientName: event.target.value })} required /></div><div className="col-sm-3"><label className="form-label">Relationship</label><input className="form-control" placeholder="e.g. Child" value={uploadForm.recipientRelationship} onChange={(event) => setUploadForm({ ...uploadForm, recipientRelationship: event.target.value })} required /></div><div className="col-sm-4"><label className="form-label">Recipient age (years)</label><input className="form-control" type="number" min={0} max={130} step={1} value={ageFromDob(uploadForm.recipientDateOfBirth)} onChange={(event) => setUploadForm({ ...uploadForm, recipientDateOfBirth: event.target.value === "" ? "" : dobFromAge(Number(event.target.value)) })} required /><small className="text-secondary">Used for medicine age checks.</small></div></div>}
            </fieldset>
            <fieldset className="mt-3">
              <legend className="form-label">
                What should the pharmacy do after reviewing it?
              </legend>
              <label
                className={`preparation-choice ${uploadForm.prepareRequested ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="prepareRequested"
                  checked={uploadForm.prepareRequested}
                  onChange={() =>
                    setUploadForm({ ...uploadForm, prepareRequested: true })
                  }
                />
                <span>
                  <strong>✓ Ask the pharmacy to prepare my medicines in advance so I can collect quickly.</strong>
                  <small>
                    The pharmacy team will prepare, package, and quote this request so you can pay and collect quickly.
                  </small>
                </span>
              </label>
              <label
                className={`preparation-choice ${!uploadForm.prepareRequested ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="prepareRequested"
                  checked={!uploadForm.prepareRequested}
                  onChange={() =>
                    setUploadForm({ ...uploadForm, prepareRequested: false })
                  }
                />
                <span>
                  <strong>Review and quote only</strong>
                  <small>
                    Tell me availability and estimated cost, but do not prepare
                    the order yet.
                  </small>
                </span>
              </label>
            </fieldset>
            <Alert message={error} />
            <ModalActions
              onClose={() => setUploadOpen(false)}
              submitLabel="Upload prescription"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {review && (
        <Modal
          title={`Review ${review.patient.fullName}'s prescription`}
          onClose={closeReview}
          size="xl"
        >
          <div className="prescription-review-split">
            <div className="prescription-document-pane">
              <div className="d-flex justify-content-between align-items-center gap-2 mb-2 flex-wrap">
                <strong>Submitted prescription</strong>
                <div className="btn-group btn-group-sm" aria-label="Document size">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.max(320, height - 140))} title="Make viewer shorter"><i className="bi bi-dash-lg" /></button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight(620)}>Fit</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.min(1000, height + 140))} title="Make viewer taller"><i className="bi bi-plus-lg" /></button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => openFile(review)} title="Open full size"><i className="bi bi-arrows-fullscreen" /></button>
                </div>
              </div>
              {reviewText ? (
                <pre className="prescription-text-viewer" style={{ height: documentViewerHeight }}>{reviewText}</pre>
              ) : reviewUrl ? (
                <iframe src={reviewUrl} title={review.originalName} style={{ height: documentViewerHeight }} />
              ) : (
                <div className="loading">Loading prescription…</div>
              )}
            </div>
            <form onSubmit={submitReview} className="prescription-review-form">
              {!review.orderedForSelf && (
                <div className="alert alert-info small">
                  <strong>Medicine recipient:</strong> {review.recipientName} · {review.recipientRelationship}
                  <br />
                  <strong>Age:</strong>{" "}
                  {review.recipientDateOfBirth
                    ? `${ageFromDob(review.recipientDateOfBirth)} years`
                    : "Not provided"}
                </div>
              )}
              {review.prepareRequested && (
                <div className="upload-review-steps-indicator mb-3 p-2 bg-light border rounded d-flex justify-content-around text-center small">
                  <div className="step-item text-primary fw-bold">
                    <span className="badge rounded-circle bg-primary me-1">1</span>
                    Review scan
                  </div>
                  <div className="step-divider text-secondary align-self-center">&rarr;</div>
                  <div className="step-item text-primary fw-bold">
                    <span className="badge rounded-circle bg-primary me-1">2</span>
                    Build estimate
                  </div>
                  <div className="step-divider text-secondary align-self-center">&rarr;</div>
                  <div className="step-item text-primary fw-bold">
                    <span className="badge rounded-circle bg-primary me-1">3</span>
                    Create prescription
                  </div>
                </div>
              )}
              <div className="alert alert-light border small">
                <strong>Sender:</strong> {review.patient.fullName}
                <br />
                <span>
                  {review.patient.patientProfile?.patientNumber ||
                    "Patient profile"}{" "}
                  · {review.patient.email}
                </span>
              </div>
              <div
                className={`preparation-preference ${review.prepareRequested ? "prepare" : "quote-only"}`}
              >
                <i
                  className={`bi bi-${review.prepareRequested ? "bag-check" : "clipboard-data"}`}
                />
                <div>
                  <small>Customer instruction</small>
                  <strong>
                    {review.prepareRequested
                      ? "Prepare medicines after approval and payment"
                      : "Review and quote only — do not prepare yet"}
                  </strong>
                </div>
              </div>
              {reviewForm.status !== "UNAVAILABLE" && (
                <section className="estimate-calculator">
                  <div className="estimate-calculator-heading">
                    <div>
                      <strong>Expected invoice calculator</strong>
                      <small>
                        Uses current prices, usable stock, discounts, coupon,
                        bottle fees, and tax. No stock is deducted.
                      </small>
                    </div>
                    <i className="bi bi-calculator" />
                  </div>
                  <div className="estimate-lines">
                    {estimateForm.items.map((item: any, index: number) => {
                      const selectedIds = estimateForm.items
                        .map((candidate: any) => Number(candidate.productId))
                        .filter(Boolean);
                      const selectedProduct = products.find(
                        (product) =>
                          Number(product.id) === Number(item.productId),
                      );
                      return (
                        <div className="estimate-line" key={index}>
                          <div>
                            <label className="form-label">Medicine</label>
                            <SearchableSelect
                              options={products
                                .filter(
                                  (product) =>
                                    Number(product.id) ===
                                      Number(item.productId) ||
                                    !selectedIds.includes(Number(product.id)),
                                )
                                .map((product) => ({
                                  value: product.id,
                                  label:
                                    `${product.genericName} ${product.strength}`.trim(),
                                  description: `${product.sku} · ${money(product.sellingPrice)} per ${product.unit} · Usable stock ${usableStock(product)}`,
                                }))}
                              value={item.productId}
                              onChange={(productId) =>
                                updateEstimateItem(
                                  index,
                                  "productId",
                                  productId,
                                )
                              }
                              placeholder="Search medicine, SKU or brand"
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label">
                              Quantity{" "}
                              {selectedProduct
                                ? `(${selectedProduct.unit})`
                                : ""}
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={item.quantity}
                              onChange={(event) =>
                                updateEstimateItem(
                                  index,
                                  "quantity",
                                  Number(event.target.value),
                                )
                              }
                              required
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger estimate-remove"
                            title="Remove medicine"
                            disabled={estimateForm.items.length === 1}
                            onClick={() => {
                              setEstimateForm({
                                ...estimateForm,
                                items: estimateForm.items.filter(
                                  (_candidate: any, itemIndex: number) =>
                                    itemIndex !== index,
                                ),
                              });
                              setEstimateQuote(null);
                            }}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={estimateForm.items.length >= 50}
                    onClick={() =>
                      setEstimateForm({
                        ...estimateForm,
                        items: [
                          ...estimateForm.items,
                          { productId: "", quantity: 1 },
                        ],
                      })
                    }
                  >
                    <i className="bi bi-plus-lg me-1" />
                    Add medicine
                  </button>

                  <div className="estimate-retail-section">
                    <div className="estimate-retail-heading">
                      <div>
                        <span className="estimate-retail-icon">
                          <i className="bi bi-bag-plus" />
                        </span>
                        <span>
                          <strong>Additional retail items</strong>
                          <small>
                            Optional OTC medicines and pharmacy goods requested
                            by the customer. These are included in the same
                            expected invoice.
                          </small>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={estimateForm.retailItems.length >= 50}
                        onClick={() => {
                          setEstimateForm({
                            ...estimateForm,
                            retailItems: [
                              ...estimateForm.retailItems,
                              { productId: "", quantity: 1 },
                            ],
                          });
                          setEstimateQuote(null);
                        }}
                      >
                        <i className="bi bi-plus-lg me-1" />
                        Add retail item
                      </button>
                    </div>
                    {!estimateForm.retailItems.length ? (
                      <div className="estimate-retail-empty">
                        No retail items added to this estimate.
                      </div>
                    ) : (
                      <div className="estimate-lines mb-0">
                        {estimateForm.retailItems.map(
                          (item: any, index: number) => {
                            const selectedIds = estimateForm.retailItems
                              .map((candidate: any) =>
                                Number(candidate.productId),
                              )
                              .filter(Boolean);
                            const selectedProduct = retailProducts.find(
                              (product) =>
                                Number(product.id) === Number(item.productId),
                            );
                            return (
                              <div
                                className="estimate-line"
                                key={`retail-${index}`}
                              >
                                <div>
                                  <label className="form-label">
                                    Retail item
                                  </label>
                                  <SearchableSelect
                                    options={retailProducts
                                      .filter(
                                        (product) =>
                                          Number(product.id) ===
                                            Number(item.productId) ||
                                          !selectedIds.includes(
                                            Number(product.id),
                                          ),
                                      )
                                      .map((product) => ({
                                        value: product.id,
                                        label: `${product.genericName}${product.strength && product.strength !== "N/A" ? ` ${product.strength}` : ""}`,
                                        description: `${product.sku}${product.barcode ? ` · ${product.barcode}` : ""} · ${money(product.sellingPrice)} per ${product.unit} · Usable stock ${usableStock(product)}`,
                                      }))}
                                    value={item.productId}
                                    onChange={(productId) =>
                                      updateEstimateRetailItem(
                                        index,
                                        "productId",
                                        productId,
                                      )
                                    }
                                    placeholder="Search item, SKU or barcode"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="form-label">
                                    Quantity{" "}
                                    {selectedProduct
                                      ? `(${selectedProduct.unit})`
                                      : ""}
                                  </label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    min="0.001"
                                    max={
                                      selectedProduct
                                        ? usableStock(selectedProduct)
                                        : undefined
                                    }
                                    step="0.001"
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateEstimateRetailItem(
                                        index,
                                        "quantity",
                                        Number(event.target.value),
                                      )
                                    }
                                    required
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger estimate-remove"
                                  title="Remove retail item"
                                  onClick={() => {
                                    setEstimateForm({
                                      ...estimateForm,
                                      retailItems:
                                        estimateForm.retailItems.filter(
                                          (
                                            _candidate: any,
                                            itemIndex: number,
                                          ) => itemIndex !== index,
                                        ),
                                    });
                                    setEstimateQuote(null);
                                  }}
                                >
                                  <i className="bi bi-trash" />
                                </button>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`bottle-fee-box ${!estimateHasLiquid ? "bottle-fee-disabled" : ""}`}
                  >
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={
                            estimateHasLiquid && estimateForm.addBottleFee
                          }
                          disabled={!estimateHasLiquid}
                          onChange={(event) =>
                            updateBottleFee(
                              Number(estimateForm.bottleCount),
                              Number(estimateForm.bottleFeePerBottle),
                              event.target.checked,
                            )
                          }
                        />
                        <span className="form-check-label">
                          Add a bottle / liquid container fee
                        </span>
                      </label>
                      {!estimateHasLiquid && (
                        <small className="bottle-fee-help">
                          Select a liquid medicine first. The option will then
                          become available.
                        </small>
                      )}
                      {estimateHasLiquid && estimateForm.addBottleFee && (
                        <div className="bottle-fee-inputs">
                          <div>
                            <label className="form-label">
                              Number of bottles
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min="1"
                              step="1"
                              value={estimateForm.bottleCount}
                              onChange={(event) =>
                                updateBottleFee(
                                  Math.max(1, Number(event.target.value)),
                                  Number(estimateForm.bottleFeePerBottle),
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="form-label">Fee per bottle</label>
                            <div className="input-group">
                              <span className="input-group-text">Rs.</span>
                              <input
                                className="form-control"
                                type="number"
                                min="0"
                                step="0.01"
                                value={estimateForm.bottleFeePerBottle}
                                onChange={(event) =>
                                  updateBottleFee(
                                    Number(estimateForm.bottleCount),
                                    Math.max(0, Number(event.target.value)),
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="bottle-fee-total">
                            <small>Total bottle fee</small>
                            <strong>{money(estimateForm.containerFee)}</strong>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="estimate-options">
                    <div>
                      <label className="form-label">
                        Coupon code (optional)
                      </label>
                      <input
                        className="form-control text-uppercase"
                        value={estimateForm.couponCode}
                        onChange={(event) => {
                          setEstimateForm({
                            ...estimateForm,
                            couponCode: event.target.value.toUpperCase(),
                          });
                          setEstimateQuote(null);
                        }}
                      />
                    </div>
                    <div>
                      <label className="form-label">Tax</label>
                      <div className="input-group">
                        <span className="input-group-text">Rs.</span>
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          step="0.01"
                          value={estimateForm.tax}
                          onChange={(event) => {
                            setEstimateForm({
                              ...estimateForm,
                              tax: Math.max(0, Number(event.target.value)),
                            });
                            setEstimateQuote(null);
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={estimateBusy}
                      onClick={calculateEstimate}
                    >
                      <i className="bi bi-calculator me-1" />
                      {estimateBusy ? "Calculating…" : "Calculate estimate"}
                    </button>
                  </div>
                  {estimateError && (
                    <div className="alert alert-danger py-2 mt-3 mb-0">
                      {estimateError}
                    </div>
                  )}
                  {estimateQuote && (
                    <div className="estimate-result">
                      <div className="estimate-stock-list">
                        {estimateQuote.lines.map((line: any) => (
                          <div key={`${line.source}-${line.productId}`}>
                            <span>
                              <span
                                className={`estimate-source estimate-source-${String(line.source || "PRESCRIPTION").toLowerCase()}`}
                              >
                                {line.source === "RETAIL"
                                  ? "Retail"
                                  : "Medicine"}
                              </span>
                              {line.name} · {line.quantity} {line.unit}
                            </span>
                            <span>
                              {money(line.lineTotal)}
                              <small
                                className={
                                  line.sufficientStock
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {line.sufficientStock
                                  ? "In stock"
                                  : `Only ${line.availableQuantity} ${line.unit} available`}
                              </small>
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="estimate-totals">
                        <span>
                          Subtotal <strong>{money(estimateQuote.subtotal)}</strong>
                        </span>
                        <span className="text-success">
                          Discount{" "}
                          <strong>− {money(estimateQuote.discount)}</strong>
                        </span>
                        <span>
                          Bottle / container fee{" "}
                          <strong>{money(estimateQuote.containerFee)}</strong>
                        </span>
                        <span>
                          Tax <strong>{money(estimateQuote.tax)}</strong>
                        </span>
                        <span className="estimate-grand-total">
                          Expected final invoice{" "}
                          <strong>{money(estimateQuote.total)}</strong>
                        </span>
                      </div>
                      {estimateQuote.appliedDiscounts?.length > 0 && (
                        <small className="text-success">
                          Applied:{" "}
                          {estimateQuote.appliedDiscounts
                            .map(
                              (discount: any) =>
                                `${discount.ruleName} (${money(discount.amount)})`,
                            )
                            .join(", ")}
                        </small>
                      )}
                    </div>
                  )}
                </section>
              )}
              <div className="form-grid">
                <div>
                  <label className="form-label">Medicine availability</label>
                  <select
                    className="form-select"
                    value={reviewForm.status}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="AVAILABLE">
                      All listed medicines available
                    </option>
                    <option value="PARTIALLY_AVAILABLE">
                      Some medicines available
                    </option>
                    <option value="UNAVAILABLE">Medicines unavailable</option>
                    <option value="REJECTED">Rejected upload</option>
                  </select>
                </div>
                {!['UNAVAILABLE', 'REJECTED'].includes(reviewForm.status) && (
                  <div>
                    <label className="form-label">Expected final invoice</label>
                    <div className="input-group">
                      <span className="input-group-text">Rs.</span>
                      <input
                        className="form-control"
                        type="number"
                        min="0"
                        step="0.01"
                        value={reviewForm.estimatedTotal}
                        onChange={(event) =>
                          setReviewForm({
                            ...reviewForm,
                            estimatedTotal: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <small className="text-secondary">
                      Filled automatically by the calculator. A pharmacist can
                      still override it when an external charge or exclusion
                      applies.
                    </small>
                  </div>
                )}
                <div className="full">
                  <label className="form-label">
                    Availability and estimate notes{" "}
                    {reviewForm.status === "AVAILABLE" && "(optional)"}
                  </label>
                  <textarea
                    className="form-control"
                    minLength={
                      reviewForm.status === "AVAILABLE" ? undefined : 3
                    }
                    maxLength={1000}
                    value={reviewForm.availabilityNotes}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        availabilityNotes: event.target.value,
                      })
                    }
                    placeholder={
                      reviewForm.status === "AVAILABLE"
                        ? "Optional note for the patient."
                        : "Explain which medicines are unavailable, substitutions to discuss, and anything excluded from the estimate."
                    }
                    required={reviewForm.status !== "AVAILABLE"}
                  />
                </div>
              </div>
              <div className="alert alert-warning small mt-3 mb-0">
                This is an availability estimate only. The final invoice is
                created after pharmacist verification and dispensing.
              </div>
              {review.prescription ? (
                <div className="alert alert-success small mt-3">
                  Structured order:{" "}
                  <strong>{review.prescription.prescriptionNumber}</strong> ·{" "}
                  {review.prescription.status}
                </div>
              ) : review.prepareRequested ? (
                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() =>
                    navigate(
                      `/prescriptions?uploadId=${review.id}&patientUserId=${review.patient.id}&orderedForSelf=${review.orderedForSelf ? "1" : "0"}&recipientName=${encodeURIComponent(review.recipientName || "")}&recipientRelationship=${encodeURIComponent(review.recipientRelationship || "")}&recipientDateOfBirth=${encodeURIComponent(review.recipientDateOfBirth ? review.recipientDateOfBirth.slice(0, 10) : "")}`,
                    )
                  }
                >
                  <i className="bi bi-file-medical me-2" />
                  Create prescription and prepare cashier invoice
                </button>
              ) : (
                <div className="alert alert-secondary small mt-3">
                  <i className="bi bi-info-circle me-2" />
                  The customer requested a quotation only. Confirm with the
                  customer before creating a prepared order.
                </div>
              )}
              <Alert message={error} />
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                <button type="button" className="btn btn-outline-danger" disabled={busy} onClick={rejectUpload}>
                  <i className="bi bi-x-octagon me-2" />Reject upload
                </button>
                <div className="flex-grow-1"><ModalActions onClose={closeReview} submitLabel="Save review" busy={busy} /></div>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {preview && (
        <Modal
          title={`Prescription — ${preview.item.patient.fullName}`}
          onClose={closePreview}
          size="xl"
        >
          <div className="prescription-popup-heading">
            <div>
              <strong>{preview.item.originalName}</strong>
              <small>{new Date(preview.item.createdAt).toLocaleString()}</small>
            </div>
            <Status value={preview.item.status} />
          </div>
          <div className="d-flex justify-content-end mb-2">
            <div className="btn-group btn-group-sm" aria-label="Document size">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.max(320, height - 140))}><i className="bi bi-dash-lg" /></button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight(620)}>Fit</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.min(1000, height + 140))}><i className="bi bi-plus-lg" /></button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.open(preview.url, "_blank", "noopener,noreferrer")} title="Open full size"><i className="bi bi-arrows-fullscreen" /></button>
            </div>
          </div>
          {preview.text ? (
            <pre className="prescription-text-viewer" style={{ height: documentViewerHeight }}>{preview.text}</pre>
          ) : (
            <iframe
              className="prescription-popup-viewer"
              src={preview.url}
              title={preview.item.originalName}
              style={{ height: documentViewerHeight }}
            />
          )}
          <div className="d-flex justify-content-end mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={closePreview}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
