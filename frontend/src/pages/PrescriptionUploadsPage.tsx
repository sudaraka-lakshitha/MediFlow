import { personNameInputProps } from '../utils/personName';
import { uploadAttemptKey, completeUploadAttempt } from '../utils/uploadAttempt';
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { api, errorMessage } from "../api/client";
import { stockQuantityStep } from "../utils/unitMeasure";
import { useHistoryPage } from "../api/useHistoryPage";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import "../prescriptionUploads.css";

type UploadSlip = {
  id: number;
  status: string;
  declaredAmount: string;
  reference?: string;
  paidOn?: string;
  note?: string;
  originalName: string;
  mimeType: string;
  rejectionReason?: string;
  reviewedAt?: string;
  quoteRevision?: number;
  acknowledgedQuoteRevision?: number | null;
  quoteSentAt?: string;
  quoteAcknowledgedAt?: string;
  createdAt: string;
  uploadedBy: { id: number; fullName: string };
  reviewedBy?: { id: number; fullName: string };
  bankAccount?: { id: number; bankName: string; accountNumber: string };
};

type Upload = {
  attachments?: { id: number; originalName: string; mimeType: string }[];
  id: number;
  quoteRevision: number;
  originalName: string;
  mimeType: string;
  patientNote?: string;
  prepareRequested: boolean;
  deliveryRequested?: boolean;
  deliveryRecipientName?: string;
  deliveryAddress?: string;
  deliveryPhone?: string;
  orderedForSelf: boolean;
  recipientName?: string;
  recipientRelationship?: string;
  recipientDateOfBirth?: string;
  recipientAllergies?: string | null;
  recipientConditions?: string | null;
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
  updatedAt: string;
  deleteAt?: string;
  attachmentRemovedAt?: string | null;
  patient: {
    id: number;
    fullName: string;
    email: string;
    patientProfile?: { id: number; patientNumber: string };
  };
  reviewedBy?: { id: number; fullName: string; role: string };
  prescription?: { id: number; prescriptionNumber: string; status: string; paymentRequest?: { requestNumber: string; total: string; status: string; revision: number; acknowledgedRevision?: number; customerPaymentChoice?: string; reservationExpiresAt?: string } | null };
  paymentSlips?: UploadSlip[];
};

const uploadStatusLabels: Record<string, string> = {
  PENDING: "Awaiting pharmacy review",
  AVAILABLE: "Availability confirmed — final bill in progress",
  PARTIALLY_AVAILABLE: "Partial availability — final bill in progress",
  UNAVAILABLE: "Medicines unavailable",
  REJECTED: "Upload rejected",
  QUOTE_SENT: "Quotation sent — awaiting your decision",
  QUOTE_ACCEPTED: "Quotation approved — awaiting final bill",
  PAYMENT_PENDING: "Final invoice issued — payment decision pending",
  PAYMENT_SUBMITTED: "Payment receipt awaiting review",
  READY_TO_PREPARE: "Payment verified — prepare medicines",
};

const UploadStatus = ({ value }: { value: string }) => (
  <span className={`status status-${value.toLowerCase().replaceAll("_", "-")}`}>
    {uploadStatusLabels[value] || value.replaceAll("_", " ")}
  </span>
);

const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const isImageUpload = (mimeType: string) => mimeType.startsWith("image/");
const fittedDocumentUrl = (url: string, mimeType: string) =>
  mimeType === "application/pdf" ? `${url}#view=FitH&zoom=page-width` : url;
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
const buildPrescriptionCreateUrl = (
  uploadItem: Upload,
  estimateInput: NonNullable<Upload["estimateDetails"]>["input"] = undefined,
) => {
  const params = new URLSearchParams({
    uploadId: String(uploadItem.id),
    patientUserId: String(uploadItem.patient.id),
    orderedForSelf: uploadItem.orderedForSelf ? "1" : "0",
    uploadStatus: uploadItem.status,
    recipientName: uploadItem.recipientName || "",
    recipientRelationship: uploadItem.recipientRelationship || "",
    recipientDateOfBirth: uploadItem.recipientDateOfBirth ? uploadItem.recipientDateOfBirth.slice(0, 10) : "",
    recipientAllergies: uploadItem.recipientAllergies || "",
    recipientConditions: uploadItem.recipientConditions || "",
    estimateInput: JSON.stringify(estimateInput || uploadItem.estimateDetails?.input || {}),
  });
  return `/prescriptions?${params.toString()}`;
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

import { WorkflowGuard } from '../components/WorkflowGuard';
export function PrescriptionUploadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patient = user!.role === "PATIENT";
  const admin = user!.role === "ADMIN";
  const cashier = user!.role === "CASHIER";
  const pharmacist = user!.role === "PHARMACIST";
  const [rows, setRows] = useState<Upload[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const uploadsLoadInFlight = useRef(false);
  const uploadsRefreshQueued = useRef(false);
  const uploadInFlight = useRef(false);
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [editingUpload, setEditingUpload] = useState<Upload | null>(null);
  const [removedAttachments, setRemovedAttachments] = useState<number[]>([]);
  const closeUpload = () => { setUploadOpen(false); setEditingUpload(null); setAdditionalFiles([]); setRemovedAttachments([]); };
  const [review, setReview] = useState<Upload | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [reviewUrl, setReviewUrl] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [documentViewerHeight, setDocumentViewerHeight] = useState(620);
  const [preview, setPreview] = useState<{ item: Upload; url: string; text?: string } | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const { get: readHistory, controls: historyControls } = useHistoryPage('Uploaded prescriptions', { status: statusFilter });
  const fitDocumentViewer = useCallback(() => {
    const availableHeight = Math.max(320, Math.min(760, window.innerHeight - 230));
    setDocumentViewerHeight(availableHeight);
  }, []);
  // Patient: submit bank-transfer slip
  const [slipUploadItem, setSlipUploadItem] = useState<Upload | null>(null);
  const [slipForm, setSlipForm] = useState<{
    file: File | null;
    declaredAmount: string;
    bankAccountId: string;
    reference: string;
    paidOn: string;
    note: string;
  }>({ file: null, declaredAmount: "", bankAccountId: "", reference: "", paidOn: "", note: "" });
  // Cashier: review a slip
  const [slipReviewItem, setSlipReviewItem] = useState<{ upload: Upload; slip: UploadSlip } | null>(null);
  const [slipReviewUrl, setSlipReviewUrl] = useState("");
  const [slipReviewForm, setSlipReviewForm] = useState({ reason: "" });
  const [uploadForm, setUploadForm] = useState<{
    file: File | null;
    prescriptionText: string;
    patientNote: string;
    prepareRequested: boolean;
    deliveryRequested?: boolean;
    deliveryRecipientName?: string;
    deliveryAddress?: string;
    deliveryPhone?: string;
    orderedForSelf: boolean;
    recipientName: string;
    recipientRelationship: string;
    recipientDateOfBirth: string;
    recipientAllergies: string;
    recipientConditions: string;
  }>({
    file: null,
    prescriptionText: "",
    patientNote: "",
    prepareRequested: true,
    orderedForSelf: true,
    recipientName: "",
    recipientRelationship: "",
    recipientDateOfBirth: "",
    recipientAllergies: "",
    recipientConditions: "",
  });
  const [reviewForm, setReviewForm] = useState({
    status: "AVAILABLE",
    availabilityNotes: "",
    estimatedTotal: "",
  });
  const [estimateForm, setEstimateForm] = useState<any>(emptyEstimate());
  const [estimateQuote, setEstimateQuote] = useState<any>(null);
  const [estimateBusy, setEstimateBusy] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [cancelModal, setCancelModal] = useState<{ upload: Upload; reason: string } | null>(null);
  const [retentionDays, setRetentionDays] = useState(30);
  const [savedRetentionDays, setSavedRetentionDays] = useState(30);
  const [retentionEditing, setRetentionEditing] = useState(false);
  const [deadlineEditingId, setDeadlineEditingId] = useState<number | null>(null);
  const [deadlineDraft, setDeadlineDraft] = useState("");
  const [deadlineSavingId, setDeadlineSavingId] = useState<number | null>(null);
  const load = useCallback(async (queueIfBusy = true) => {
    // Polling and focus events must not queue behind a slow request, or they
    // can keep the initial screen in its loading state indefinitely. Explicit
    // workflow refreshes may queue one follow-up to include a recent change.
    if (uploadsLoadInFlight.current) {
      if (queueIfBusy) uploadsRefreshQueued.current = true;
      return;
    }
    uploadsLoadInFlight.current = true;
    try {
      do {
        uploadsRefreshQueued.current = false;
        try {
          setError("");
          const response = await readHistory("/prescription-uploads");
          setRows(response.data.data);
        } catch (caught) {
          setError(errorMessage(caught));
        }
      } while (uploadsRefreshQueued.current);
    } finally {
      uploadsLoadInFlight.current = false;
      setLoading(false);
    }
  }, [readHistory]);
  useEffect(() => {
    load();
    // Load bank accounts for patient slip upload & cashier review
    api.get("/bank-accounts").then((r) => setBankAccounts(r.data.data.filter((a: any) => a.active))).catch(() => undefined);
    if (!patient && !cashier)
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
        .then((response) => {
          setRetentionDays(response.data.data.days);
          setSavedRetentionDays(response.data.data.days);
        })
        .catch(() => undefined);
  }, [load, admin, patient, cashier]);
  useEffect(() => {
    if (patient) return;
    const refresh = () => {
      if (!document.hidden && !busy) void load(false);
    };
    const timer = window.setInterval(refresh, 5_000);
    window.addEventListener("mediflow:attention-refresh", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("mediflow:attention-refresh", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [busy, load, patient]);
  const saveRetention = async () => {
    setBusy(true);
    setError("");
    try {
      await api.put("/prescription-uploads/retention", { days: retentionDays });
      setSavedRetentionDays(retentionDays);
      setRetentionEditing(false);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const acceptEstimate = async (item: Upload) => {
    try {
      await api.put(`/prescription-uploads/${item.id}/accept`, { revision: item.quoteRevision });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const saveDeadline = async (item: Upload, value: string) => {
    if (!value) return;
    setDeadlineSavingId(item.id);
    setError("");
    try {
      const response = await api.put(`/prescription-uploads/${item.id}/deletion-deadline`, {
        deleteAt: `${value}T23:59:59`,
      });
      // The API returns the persisted record. Reflect its saved deadline now;
      // don't keep the button in "Saving…" while a separate list refresh runs.
      const savedUpload = response.data.data as Upload;
      setRows((current) => current.map((row) => row.id === item.id
        ? { ...row, deleteAt: savedUpload.deleteAt }
        : row));
      setDeadlineEditingId(null);
      setDeadlineDraft("");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setDeadlineSavingId(null);
    }
  };
  const sendQuotation = async (item: Upload) => {
    setBusy(true);
    setError("");
    try {
      await api.put(`/prescription-uploads/${item.id}/send-quotation`);
      closeReview();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  // Patient: open slip upload modal
  const openSlipUpload = (item: Upload) => {
    setSlipForm({ file: null, declaredAmount: "", bankAccountId: "", reference: "", paidOn: "", note: "" });
    setSlipUploadItem(item);
    setError("");
  };
  const submitSlip = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slipUploadItem || !slipForm.file) return setError("Select a file for the bank transfer receipt.");
    if (!slipForm.declaredAmount || Number(slipForm.declaredAmount) <= 0) return setError("Enter the amount you transferred.");
    if (slipForm.file.size > 2_500_000) return setError("File must be 2.5 MB or smaller.");
    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(slipForm.file.type))
      return setError("Upload a PDF, JPEG, PNG, or WebP file.");
    setBusy(true);
    setError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(slipForm.file!);
      });
      await api.post(`/prescription-uploads/${slipUploadItem.id}/slip`, {
        originalName: slipForm.file.name,
        mimeType: slipForm.file.type,
        fileBase64: dataUrl.split(",")[1],
        declaredAmount: Number(slipForm.declaredAmount),
        bankAccountId: slipForm.bankAccountId ? Number(slipForm.bankAccountId) : null,
        reference: slipForm.reference || null,
        paidOn: slipForm.paidOn || null,
        note: slipForm.note || null,
      });
      setSlipUploadItem(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  // Cashier: open slip review modal
  const openSlipReview = async (upload: Upload, slip: UploadSlip) => {
    setSlipReviewItem({ upload, slip });
    setSlipReviewForm({ reason: "" });
    setSlipReviewUrl("");
    setError("");
    try {
      const response = await api.get(`/prescription-uploads/${upload.id}/slips/${slip.id}/file`, { responseType: "blob" });
      setSlipReviewUrl(URL.createObjectURL(response.data));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const closeSlipReview = () => {
    if (slipReviewUrl) URL.revokeObjectURL(slipReviewUrl);
    setSlipReviewUrl("");
    setSlipReviewItem(null);
  };
  const approveSlip = async () => {
    if (!slipReviewItem) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/prescription-uploads/${slipReviewItem.upload.id}/slips/${slipReviewItem.slip.id}/review`, { approved: true });
      closeSlipReview();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const rejectSlip = async () => {
    if (!slipReviewItem) return;
    if (!slipReviewForm.reason.trim() || slipReviewForm.reason.trim().length < 3) {
      setError("Enter a rejection reason.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.post(`/prescription-uploads/${slipReviewItem.upload.id}/slips/${slipReviewItem.slip.id}/review`, { approved: false, reason: slipReviewForm.reason.trim() });
      closeSlipReview();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const submitUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (uploadInFlight.current) return;
    const typedText = uploadForm.prescriptionText.trim();
    if (!editingUpload && !uploadForm.file && !typedText)
      return setError("Upload a prescription file, type the prescription and retail items, or both.");
    if (!uploadForm.file && typedText && typedText.length < 10)
      return setError("Type at least 10 characters describing the prescription or requested retail items.");
    const file =
      uploadForm.file ||
      (typedText ? new File([typedText], 'typed-prescription.txt', { type: "text/plain" }) : null);
    const extraFiles = additionalFiles;
    const attachmentCount = editingUpload
      ? (editingUpload.attachments || []).filter(item => !removedAttachments.includes(item.id)).length + extraFiles.length + (file || !removedAttachments.includes(0) ? 1 : 0)
      : 1 + extraFiles.length;
    if (attachmentCount < 1 || attachmentCount > 5) return setError('Keep between one and five attachments in this request.');
    if (extraFiles.some(item => item.size > 2_500_000 || !['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(item.type)))
      return setError('Select up to five PDF or image files, each 2.5 MB or smaller.');
    if (file && file.size > 2_500_000)
      return setError("Prescription files must be 2.5 MB or smaller.");
    if (
      file && !["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"].includes(
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
    uploadInFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const dataUrl = file ? await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }) : null;
      const payload = {
        additionalAttachments: await Promise.all(extraFiles.map(async item => ({
          originalName: item.name, mimeType: item.type,
          fileBase64: await new Promise<string>((resolve, reject) => {
            const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]);
            reader.onerror = () => reject(reader.error); reader.readAsDataURL(item);
          }),
        }))),
        ...(file && dataUrl ? { originalName: file.name, mimeType: file.type, fileBase64: dataUrl.split(",")[1] } : {}),
        patientNote: patientNote || null,
        prepareRequested: uploadForm.prepareRequested,
        deliveryRequested: Boolean(uploadForm.deliveryRequested),
        deliveryRecipientName: uploadForm.deliveryRecipientName,
        deliveryAddress: uploadForm.deliveryAddress,
        deliveryPhone: uploadForm.deliveryPhone,
        orderedForSelf: uploadForm.orderedForSelf,
        recipientName: uploadForm.orderedForSelf ? null : uploadForm.recipientName,
        recipientRelationship: uploadForm.orderedForSelf ? null : uploadForm.recipientRelationship,
        recipientDateOfBirth: uploadForm.orderedForSelf ? null : uploadForm.recipientDateOfBirth,
        recipientAllergies: uploadForm.orderedForSelf ? null : (uploadForm.recipientAllergies.trim() || null),
        recipientConditions: uploadForm.orderedForSelf ? null : (uploadForm.recipientConditions.trim() || null),
      };
      if (editingUpload) await api.put(`/prescription-uploads/${editingUpload.id}`, { ...payload, removeAttachmentIds: removedAttachments, updatedAt: editingUpload.updatedAt });
      else {
        const submissionKey = await uploadAttemptKey(user!.id, payload);
        await api.post('/prescription-uploads', { ...payload, submissionKey });
        completeUploadAttempt(user!.id);
      }
      closeUpload();
      setAdditionalFiles([]);
      setUploadForm({
        file: null,
        prescriptionText: "",
        patientNote: "",
        prepareRequested: true,
        orderedForSelf: true,
        recipientName: "",
        recipientRelationship: "",
        recipientDateOfBirth: "",
        recipientAllergies: "",
        recipientConditions: "",
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      uploadInFlight.current = false;
      setBusy(false);
    }
  };

  const openFile = async (item: Upload, attachment?: { id: number; originalName: string; mimeType: string }) => {
    try {
      fitDocumentViewer();
      const response = await api.get(`/prescription-uploads/${item.id}/file`, {
        params: attachment ? { attachmentId: attachment.id } : {},
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const text = (attachment?.mimeType || item.mimeType) === "text/plain" ? await response.data.text() : undefined;
      if (preview) URL.revokeObjectURL(preview.url);
      setPreview({ item: attachment ? { ...item, originalName: attachment.originalName, mimeType: attachment.mimeType } : item, url, text });
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const closeReview = () => {
    setRejectOpen(false);
    setRejectionReason("");
    setRejectionError("");
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl("");
    setReviewText("");
    setReview(null);
  };
  const openReview = async (item: Upload) => {
    setError("");
    fitDocumentViewer();
    setReview(item);
    setReviewForm({
      status:
        item.status === "PENDING"
          ? item.estimatedTotal == null ? "UNAVAILABLE" : "AVAILABLE"
          : ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(item.status)
            ? item.availabilityNotes?.toLowerCase().includes("some")
              ? "PARTIALLY_AVAILABLE"
              : "AVAILABLE"
            : item.status,
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
              status: ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(current.status)
                ? response.data.data.allMedicinesInStock
                  ? "AVAILABLE"
                  : "PARTIALLY_AVAILABLE"
                : current.status,
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
                status: ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(item.status)
                  ? response.data.data.allMedicinesInStock
                    ? "AVAILABLE"
                    : "PARTIALLY_AVAILABLE"
                  : item.status,
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
  const calculateEstimateRef = useRef(calculateEstimate);
  calculateEstimateRef.current = calculateEstimate;

  useEffect(() => {
    if (!review?.id || (review.estimatedTotal == null && !["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(review.status))) return;
    const hasItems = estimateForm.items?.some(
      (item: any) => item.productId && Number(item.quantity) > 0,
    );
    if (!hasItems) return;
    const timer = window.setTimeout(() => {
      calculateEstimateRef.current();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    review?.id,
    review?.status,
    review?.estimatedTotal,
    review?.prepareRequested,
    estimateForm.items,
    estimateForm.retailItems,
    estimateForm.couponCode,
    estimateForm.addBottleFee,
    estimateForm.containerFee,
    estimateForm.bottleCount,
    estimateForm.bottleFeePerBottle,
    estimateForm.tax,
  ]);

  const submitCancelUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!cancelModal) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/prescription-uploads/${cancelModal.upload.id}/cancel`, {
        reason: cancelModal.reason || "Cancelled by customer",
      });
      setCancelModal(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
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
            || (!review.prepareRequested && review.estimatedTotal == null && !["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(review.status))
            ? null
            : reviewForm.estimatedTotal.trim() ? Number(reviewForm.estimatedTotal) : null,
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
    if (rejectionReason.trim().length < 3) {
      setRejectionError("Enter a rejection reason of at least 3 characters.");
      return;
    }
    setBusy(true);
    setRejectionError("");
    try {
      await api.put(`/prescription-uploads/${review.id}/review`, {
        status: "REJECTED",
        availabilityNotes: rejectionReason.trim(),
        estimatedTotal: null,
      });
      closeReview();
      await load();
    } catch (caught) {
      setRejectionError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const filtered = statusFilter
    ? rows.filter((item) => (item.prescription?.paymentRequest?.status || item.status) === statusFilter)
    : rows;
  if (loading) return <Loading />;

  return (
    <WorkflowGuard resource={editingUpload?.id || review?.id || slipUploadItem?.id || slipReviewItem?.upload.id || cancelModal?.upload.id || deadlineEditingId ? `upload/${editingUpload?.id || review?.id || slipUploadItem?.id || slipReviewItem?.upload.id || cancelModal?.upload.id || deadlineEditingId}` : null}
      onCancel={() => { closeUpload(); closeReview(); setSlipUploadItem(null); setSlipReviewItem(null); setCancelModal(null); setDeadlineEditingId(null); }}>
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
                recipientAllergies: "",
                recipientConditions: "",
              });
              setUploadOpen(true);
              setEditingUpload(null);
              setUploadForm({ file: null, prescriptionText: '', patientNote: '', prepareRequested: true, orderedForSelf: true, recipientName: '', recipientRelationship: '', recipientDateOfBirth: '', recipientAllergies: '', recipientConditions: '' });
            }}
          >
            <i className="bi bi-cloud-arrow-up me-2" />
            Upload prescription
          </button>
        )}
      </div>
      <Alert message={error} />
      {historyControls}
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
                  disabled={!retentionEditing || busy}
                  onChange={(event) =>
                    setRetentionDays(Number(event.target.value))
                  }
                />
                <span className="input-group-text">days</span>
              </div>
            </div>
            {!retentionEditing ? (
              <button type="button" className="btn btn-outline-primary" onClick={() => setRetentionEditing(true)}>
                <i className="bi bi-pencil me-2" />Edit retention policy
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light" disabled={busy} onClick={() => { setRetentionDays(savedRetentionDays); setRetentionEditing(false); }}>Cancel</button>
                <button type="button" className="btn btn-primary" disabled={busy || retentionDays < 1 || retentionDays > 365 || retentionDays === savedRetentionDays} onClick={saveRetention}>
                  <i className="bi bi-check-lg me-2" />{busy ? "Saving…" : "Save policy"}
                </button>
              </div>
            )}
            <small className="text-secondary">
              This deadline removes attachments only after active orders are resolved.
              Order and payment history are retained. Individual deadlines can be changed on each card.
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
          <option value="AVAILABLE">Availability reviewed — available</option>
          <option value="PARTIALLY_AVAILABLE">Availability reviewed — partial</option>
          <option value="UNAVAILABLE">Unavailable</option>
          <option value="REJECTED">Rejected</option>
          <option value="QUOTE_SENT">Quotation sent — awaiting customer</option>
          <option value="QUOTE_ACCEPTED">Quotation accepted — prepare final bill</option>
          <option value="PAYMENT_PENDING">Final invoice issued — payment action pending</option>
          <option value="AWAITING_PAYMENT">Final invoice — awaiting payment</option>
          <option value="SLIP_SUBMITTED">Final invoice — bank slip to check</option>
          <option value="PAID">Paid — awaiting collection</option>
          <option value="FULFILLED">Collected</option>
          <option value="CANCELLED">Invoice cancelled</option>
          <option value="PAYMENT_SUBMITTED">Bank slip submitted — awaiting cashier</option>
          <option value="READY_TO_PREPARE">Payment verified — ready to prepare</option>
        </select>
        <span>{filtered.length} request(s)</span>
      </div>
      <div className="upload-grid">
        {filtered.map((item) => (
          <article className="panel upload-card" key={item.id}>
            {!!item.attachments?.length && <div className="d-flex flex-wrap gap-2 mb-2" aria-label="Additional prescription attachments">
              {item.attachments.map((attachment, index) => <button type="button" className="btn btn-sm btn-outline-secondary" key={attachment.id} onClick={() => openFile(item, attachment)}>Attachment {index + 2}: {attachment.originalName}</button>)}
            </div>}
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
              {item.prescription?.status === "CANCELLED" ? <div className="text-end"><small className="d-block">Prescription</small><Status value="CANCELLED" /></div> : item.prescription?.status === "REJECTED" ? <div className="text-end"><small className="d-block">Prescription</small><Status value="REJECTED" /></div> : item.prescription?.paymentRequest ? <div className="text-end"><small className="d-block">Current invoice</small><Status value={item.prescription.paymentRequest.status} /></div> : <UploadStatus value={item.status} />}
            </div>
            {item.patientNote && (
              <div className="upload-note">
                <small>Patient note</small>
                <p>{item.patientNote}</p>
              </div>
            )}
            {!item.orderedForSelf && (
              <div className="alert alert-light border small mt-2 mb-0 py-2">
                <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                  <span className="fw-semibold text-primary">
                    <i className="bi bi-person-fill me-1" />
                    Recipient: {item.recipientName} ({item.recipientRelationship})
                    {item.recipientDateOfBirth ? ` · Age ${ageFromDob(item.recipientDateOfBirth)}` : ""}
                  </span>
                  <span className="badge bg-secondary-subtle text-secondary">For someone else</span>
                </div>
                {(item.recipientAllergies || item.recipientConditions) && (
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {item.recipientAllergies && (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                        <i className="bi bi-shield-exclamation me-1" />
                        Allergies: {item.recipientAllergies}
                      </span>
                    )}
                    {item.recipientConditions && (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                        <i className="bi bi-heart-pulse me-1" />
                        Conditions: {item.recipientConditions}
                      </span>
                    )}
                  </div>
                )}
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
                    ? (item.deliveryRequested ? "Prepare medicines for home delivery" : "Prepare medicines for collection")
                    : "Prepare a complete prescription bill for me to review"}
                </strong>
                {item.deliveryRequested && <small>{item.deliveryRecipientName} · {item.deliveryAddress} · {item.deliveryPhone}. Track progress under Home deliveries once invoiced.</small>}
              </div>
            </div>
            <div className="availability-box">
              <div>
                <small>Availability review</small>
                <strong>
                  {item.prescription?.status === "CANCELLED"
                    ? "Prescription cancelled — no active order or stock reservation remains"
                    : item.prescription?.status === "REJECTED"
                    ? "Prescription rejected — see the pharmacist’s reason below"
                    : item.prescription?.status === "DISPENSED"
                    ? "Prescription dispensed — see the final invoice for the supplied items"
                    : item.prescription?.status === "PARTIALLY_DISPENSED"
                    ? "Partially dispensed — the prescription shows supplied and not supplied quantities"
                    : item.prescription?.status === "VERIFIED" && !item.prescription.paymentRequest
                    ? "Prescription verified — pharmacy still needs to create the final bill"
                    : item.status === "PENDING"
                    ? "Waiting for pharmacist review"
                    : item.status === "AVAILABLE"
                    ? patient
                      ? "Availability confirmed — pharmacy is preparing your complete prescription and final bill"
                      : "All requested medicines are currently in stock"
                    : item.status === "PARTIALLY_AVAILABLE"
                    ? patient
                      ? "Availability reviewed — pharmacy is finalizing the prescription and bill; see the note for unavailable medicines"
                      : "Only some requested medicines are currently in stock"
                    : item.status === "UNAVAILABLE"
                    ? "Requested medicines are currently unavailable"
                    : item.status === "QUOTE_SENT"
                    ? "Pharmacy quotation sent — awaiting your decision"
                    : item.status === "QUOTE_ACCEPTED"
                    ? "Quotation approved — pharmacist is preparing the final invoice"
                    : item.status === "PAYMENT_PENDING"
                    ? "Final invoice issued — review it under Sales & billing"
                    : item.status === "PAYMENT_SUBMITTED"
                    ? "Bank slip submitted — awaiting cashier verification"
                    : item.status === "READY_TO_PREPARE"
                    ? "Payment verified — pharmacy preparing your medicines"
                    : item.status.replaceAll("_", " ").toLowerCase()}
                </strong>
              </div>
              <div>
                <small>
                  {item.prescription?.paymentRequest
                    ? "Final invoice"
                    : item.prepareRequested
                      ? "Final invoice"
                      : ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(item.status)
                        ? "Quotation"
                        : "Amount"}
                </small>
                <strong>
                  {item.prescription?.paymentRequest
                    ? money(item.prescription.paymentRequest.total)
                    : !item.prepareRequested && ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(item.status) && item.estimatedTotal != null
                      ? money(item.estimatedTotal)
                      : item.prepareRequested
                        ? "Awaiting final bill"
                        : ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(item.status)
                          ? "Pharmacy is preparing your complete final bill"
                          : "Not available"}
                </strong>
              </div>
            </div>
            {patient && !item.prescription && ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(item.status) && (
              <div className="alert alert-info small mt-2 mb-0">
                <strong>No further request is needed.</strong> The pharmacist is preparing the complete prescription and final bill. You can acknowledge the invoice and choose payment under Sales &amp; billing when it is issued.
              </div>
            )}
            {patient && !item.prepareRequested && item.estimatedTotal != null && ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(item.status) && (
              <div className="alert alert-warning small mt-2 mb-0">
                <i className="bi bi-exclamation-triangle me-2" />
                This amount is an estimate based on current prices, stock,
                discounts, and fees. It may change after the pharmacist's final
                review and is not guaranteed until the final invoice is issued.
              </div>
            )}
            {patient && !item.prepareRequested &&
              item.estimatedTotal != null &&
              item.status === "QUOTE_SENT" && (
                <div className="alert alert-info small mt-2 mb-0">
                  <strong>Decision required:</strong> Approve this estimate only if you want the pharmacist to prepare the final prescription invoice. No payment or stock reservation happens at this stage.
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => acceptEstimate(item)}
                    >
                      <i className="bi bi-check-circle me-1" />
                      Approve quotation &amp; request processing
                    </button>
                  </div>
                </div>
              )}
            {/* Patient: decline or cancel quotation / request */}
            {patient &&
              !item.prescription &&
              ["PENDING", "AVAILABLE", "PARTIALLY_AVAILABLE", "QUOTE_SENT", "QUOTE_ACCEPTED", "PAYMENT_PENDING", "PAYMENT_SUBMITTED"].includes(
                item.status,
              ) && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => {
                    setError("");
                    setCancelModal({ upload: item, reason: "" });
                  }}
                >
                  <i className="bi bi-x-circle me-1" />
                  {["QUOTE_SENT", "QUOTE_ACCEPTED", "PAYMENT_PENDING", "PAYMENT_SUBMITTED"].includes(item.status)
                    ? "Decline quote & cancel"
                    : "Cancel request"}
                </button>
              )}
            {/* Patient: bank-transfer slip upload */}
            {patient && item.prescription?.paymentRequest?.status === "AWAITING_PAYMENT" && (
              <div className="alert alert-info small mt-2 mb-0">
                <i className="bi bi-receipt me-2" />
                The pharmacist has issued the final invoice. Open <strong>Sales &amp; billing</strong> to acknowledge the latest invoice, choose cash or bank transfer, and continue payment.
              </div>
            )}
            {patient && item.prescription?.paymentRequest?.status === 'FULFILLED' && <div className="alert alert-success mt-3">Order collected. View the final invoice under Sales &amp; billing.</div>}
            {patient && item.prescription?.paymentRequest?.status === 'PAID' && <div className="alert alert-info mt-3">Payment confirmed. Your collection receipt is available under Sales &amp; billing.</div>}
            {patient && item.prescription?.paymentRequest?.status === 'CANCELLED' && <div className="alert alert-warning mt-3">Invoice cancelled. View cancellation and refund details under Sales &amp; billing.</div>}
            {patient && !item.prescription && ["PAYMENT_PENDING", "PAYMENT_SUBMITTED"].includes(item.status) && (
              <div className="mt-2">
                {item.status === "PAYMENT_PENDING" ? (
                  <div className="alert alert-info small">
                    <i className="bi bi-bank me-2" />
                    <strong>Action required:</strong> Please pay <strong>{money(item.estimatedTotal)}</strong> by bank transfer to one of our accounts, then upload your receipt below.
                  </div>
                ) : (
                  <div className="alert alert-success small">
                    <i className="bi bi-hourglass-split me-2" />
                    Your bank transfer receipt has been submitted and is being verified by our cashier. We will prepare your medicines once confirmed.
                  </div>
                )}
                {bankAccounts.length > 0 && item.status === "PAYMENT_PENDING" && (
                  <div className="bank-account-list mb-2">
                    {bankAccounts.map((ba: any) => (
                      <div key={ba.id} className="bank-account-card">
                        <i className="bi bi-bank" />
                        <div>
                          <strong>{ba.bankName}</strong>
                          <small>{ba.accountName} · {ba.accountNumber}{ba.branch ? ` · ${ba.branch}` : ""}</small>
                          {ba.instructions && <small className="text-secondary">{ba.instructions}</small>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openSlipUpload(item)}
                >
                  <i className="bi bi-upload me-1" />
                  {item.status === "PAYMENT_SUBMITTED" ? "Re-upload receipt" : "Upload bank transfer receipt"}
                </button>
                {/* Show previously submitted slips */}
                {item.paymentSlips && item.paymentSlips.length > 0 && (
                  <div className="mt-2">
                    {item.paymentSlips.map((slip) => (
                      <div key={slip.id} className={`slip-status-badge slip-${slip.status.toLowerCase()}`}>
                        <i className={`bi bi-${slip.status === "VERIFIED" ? "check-circle" : slip.status === "REJECTED" ? "x-circle" : "clock"} me-1`} />
                        Receipt {slip.status.toLowerCase()} · {money(slip.declaredAmount)}
                        {slip.status === "REJECTED" && slip.rejectionReason && (
                          <span className="ms-2 text-danger">Reason: {slip.rejectionReason}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Cashier: slip review section */}
            {(cashier || admin || pharmacist) && item.status === "PAYMENT_SUBMITTED" && item.paymentSlips && item.paymentSlips.some((s) => s.status === "PENDING") && (
              <div className="mt-2">
                <div className="alert alert-warning small">
                  <i className="bi bi-receipt me-2" />
                  <strong>Action required:</strong> Customer has submitted a bank transfer receipt. Please verify it before the pharmacy prepares the medicines.
                </div>
                {item.paymentSlips.filter((s) => s.status === "PENDING").map((slip) => (
                  <div key={slip.id} className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="flex-grow-1">
                      <small>Declared: <strong>{money(slip.declaredAmount)}</strong></small>
                      {slip.reference && <small className="ms-2">Ref: {slip.reference}</small>}
                      {slip.bankAccount && <small className="ms-2">{slip.bankAccount.bankName} · {slip.bankAccount.accountNumber}</small>}
                    </div>
                    {(cashier || admin) && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openSlipReview(item, slip)}
                      >
                        <i className="bi bi-eye me-1" />
                        Review slip
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Pharmacist: ready to prepare badge */}
            {!patient && item.status === "READY_TO_PREPARE" && !item.prescription && (
              <div className="alert alert-success small mt-2">
                <i className="bi bi-check-circle-fill me-2" />
                <strong>Payment verified by cashier.</strong> Please prepare the medicines and create the prescription order.
              </div>
            )}
            {item.prescription && (
              <div className="mt-2 p-2 rounded bg-light border">
                <small className="text-secondary d-block fw-semibold">
                  <i className="bi bi-file-earmark-medical me-1" /> Linked Prescription
                </small>
                <strong>{item.prescription.prescriptionNumber}</strong> · <Status value={item.prescription.status} />
                {!item.prescription.paymentRequest && <small className="d-block mt-1 text-warning-emphasis">Cashier invoice has not been created yet.</small>}
                {item.prescription.paymentRequest && (
                  <div className="mt-2"><strong>Current invoice: </strong><Status value={item.prescription.paymentRequest.status} />
                    {item.prescription.paymentRequest.status === "AWAITING_PAYMENT" && <small className="d-block">{item.prescription.paymentRequest.acknowledgedRevision !== item.prescription.paymentRequest.revision ? "Awaiting customer approval of the latest invoice" : "Customer approved — awaiting payment"}</small>}
                  </div>
                )}
              </div>
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
                {item.attachmentRemovedAt ? "Attachment removed; order history retained. Scheduled date: " : "Attachment retention deadline (deferred for active orders): "}
                {item.deleteAt
                  ? new Date(item.deleteAt).toLocaleString()
                  : "Not scheduled"}
              </small>
              {admin && !item.attachmentRemovedAt && deadlineEditingId !== item.id && (
                <button type="button" className="btn btn-sm btn-link px-0 mt-1 d-block" onClick={() => { setDeadlineEditingId(item.id); setDeadlineDraft(item.deleteAt?.slice(0, 10) || ""); }}>
                  <i className="bi bi-pencil me-1" />Edit deletion date
                </button>
              )}
              {admin && deadlineEditingId === item.id && (
                <div className="deadline-editor mt-2">
                  <label className="form-label small mb-1">New deletion date</label>
                  <input
                    className="form-control form-control-sm"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={deadlineDraft}
                    disabled={deadlineSavingId === item.id}
                    onChange={(event) => setDeadlineDraft(event.target.value)}
                  />
                  <div className="d-flex gap-2 mt-2">
                    <button type="button" className="btn btn-sm btn-light" disabled={deadlineSavingId === item.id} onClick={() => { setDeadlineEditingId(null); setDeadlineDraft(""); }}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-primary" disabled={!deadlineDraft || deadlineDraft === item.deleteAt?.slice(0, 10) || deadlineSavingId === item.id} onClick={() => saveDeadline(item, deadlineDraft)}>
                      {deadlineSavingId === item.id ? "Saving…" : "Save date"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {!patient && !cashier && item.prescription && (
                item.prescription.status === "VERIFIED" && (!item.prescription.paymentRequest || ["CANCELLED", "FULFILLED"].includes(item.prescription.paymentRequest.status))
                || item.prescription.status === "PARTIALLY_DISPENSED" && ["CANCELLED", "FULFILLED"].includes(item.prescription.paymentRequest?.status || "")
              ) && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/prescriptions?continueRx=${item.prescription!.id}`)}
                >
                  <i className="bi bi-receipt me-1" />
                  Continue to cashier bill
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => openFile(item)}
                disabled={Boolean(item.attachmentRemovedAt)}
              >
                <i className="bi bi-eye me-1" />
                View prescription
              </button>
              {!patient && !cashier && item.status === "PENDING" && !item.prescription && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(buildPrescriptionCreateUrl(item))}
                >
                  <i className="bi bi-file-medical me-1" />
                  Review prescription &amp; create final bill
                </button>
              )}
              {!patient && !cashier && item.status === "PENDING" && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => openReview(item)}
                >
                  <i className="bi bi-clipboard-check me-1" />
                  Mark unavailable / reject
                </button>
              )}
              {patient && item.status === 'PENDING' && !item.prescription && !item.attachmentRemovedAt && (
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => {
                  setError(''); setEditingUpload(item); setRemovedAttachments([]); setAdditionalFiles([]);
                  setUploadForm({ file: null, prescriptionText: '', patientNote: item.patientNote || '', prepareRequested: item.prepareRequested,
                    deliveryRequested: item.deliveryRequested, deliveryRecipientName: item.deliveryRecipientName || '', deliveryAddress: item.deliveryAddress || '', deliveryPhone: item.deliveryPhone || '',
                    orderedForSelf: item.orderedForSelf, recipientName: item.recipientName || '', recipientRelationship: item.recipientRelationship || '',
                    recipientDateOfBirth: item.recipientDateOfBirth?.slice(0, 10) || '', recipientAllergies: item.recipientAllergies || '', recipientConditions: item.recipientConditions || '' });
                  setUploadOpen(true);
                }}>Edit upload</button>
              )}
              {!patient && !cashier && !item.prepareRequested && ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(item.status) && item.estimatedTotal != null && !item.prescription && (
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => openReview(item)}
                >
                  <i className="bi bi-send me-1" />
                  Review saved quotation
                </button>
              )}
              {!patient && !cashier && ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(item.status) && !item.prescription && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(buildPrescriptionCreateUrl(item))}
                >
                  <i className="bi bi-file-medical me-1" />
                  Create final prescription &amp; bill
                </button>
              )}
              {!patient && !cashier && item.status === "READY_TO_PREPARE" && !item.prescription && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    navigate(buildPrescriptionCreateUrl(item));
                  }}
                >
                  <i className="bi bi-file-medical me-1" />
                  Create prescription
                </button>
              )}
              {!patient && !cashier && item.status === "QUOTE_ACCEPTED" && !item.prescription && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      navigate(buildPrescriptionCreateUrl(item));
                    }}
                  >
                    <i className="bi bi-file-medical me-1" />
                    Prepare final prescription &amp; invoice
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
          title={editingUpload ? 'Edit uploaded prescription' : 'Upload prescription'}
          onClose={closeUpload}
          closable={!busy}
          size="sm"
        >
          <form onSubmit={submitUpload}>
            {editingUpload && <div className="alert alert-info small">Manage the pages below before pharmacy review. New files are added to this request. Typing a new prescription replaces the first attachment. At least one and at most five attachments must remain.
              {[{ id: 0, originalName: editingUpload.originalName }, ...(editingUpload.attachments || [])].map(file => <label key={file.id} className="d-block mt-2"><input type="checkbox" disabled={busy} checked={removedAttachments.includes(file.id)} onChange={e => setRemovedAttachments(current => e.target.checked ? [...current, file.id] : current.filter(id => id !== file.id))} /> Remove: {file.originalName}</label>)}
            </div>}
            <div className="alert alert-info small">
              Upload a clear PDF/image, type the prescription and retail-item request, or both. The pharmacist will enter the full directions and quantities, then issue one final itemized bill for you to review.
            </div>
            <div className="upload-clinical-disclaimer" role="note">
              <i className="bi bi-shield-exclamation" aria-hidden="true" />
              <span>
                It remains explicitly unsuitable for real clinical use without
                authoritative pharmacist validation.
              </span>
            </div>
            <label className="form-label">{editingUpload ? 'Add attachments (remove old pages above to replace them)' : 'Prescription files (up to five, 2.5 MB each)'}</label>
            <input className="form-control" disabled={busy} type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => {
              const files = Array.from(event.target.files || []);
              if (files.length > 5 || files.some(file => file.size > 2_500_000)) { setError('Select at most five files, each 2.5 MB or smaller.'); event.target.value = ''; setUploadForm({ ...uploadForm, file: null }); setAdditionalFiles([]); return; }
              setError(''); setUploadForm({ ...uploadForm, file: editingUpload ? null : files[0] || null }); setAdditionalFiles(editingUpload ? files : files.slice(1));
            }} />
            {!editingUpload && additionalFiles.length > 0 && <small className="d-block text-secondary">{additionalFiles.length + 1} attachments will be saved together as one request.</small>}
            {editingUpload && additionalFiles.map((file, index) => <div key={index} className="small mt-1">New: {file.name} <button type="button" disabled={busy} className="btn btn-sm btn-link" onClick={() => setAdditionalFiles(files => files.filter((_, i) => i !== index))}>Remove new file</button></div>)}
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
              <legend className="form-label fw-semibold">Who is this prescription for?</legend>
              <div className="recipient-choice-grid">
                <label className={`preparation-choice ${uploadForm.orderedForSelf ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="recipient"
                    checked={uploadForm.orderedForSelf}
                    onChange={() => setUploadForm({ ...uploadForm, orderedForSelf: true })}
                  />
                  <span>
                    <strong>For me</strong>
                    <small>I am the patient named on this prescription.</small>
                  </span>
                </label>
                <label className={`preparation-choice ${!uploadForm.orderedForSelf ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="recipient"
                    checked={!uploadForm.orderedForSelf}
                    onChange={() => setUploadForm({ ...uploadForm, orderedForSelf: false })}
                  />
                  <span>
                    <strong>For someone else</strong>
                    <small>I am uploading this on behalf of another person.</small>
                  </span>
                </label>
              </div>

              {!uploadForm.orderedForSelf && (
                <div className="recipient-details-card p-3 mt-3">
                  <div className="recipient-details-heading">
                    <span className="recipient-details-title">
                      <i className="bi bi-person-heart" />
                      Recipient Information &amp; Clinical Safety
                    </span>
                    <span className="recipient-required-badge">
                      Required for safe dispensing
                    </span>
                  </div>

                  <div className="recipient-identity-grid">
                    <div className="recipient-name-field">
                      <label className="form-label small mb-1">
                        Recipient full name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Full name"
                        value={uploadForm.recipientName}
                        {...personNameInputProps((recipientName) => setUploadForm((previous) => ({ ...previous, recipientName })))}
                        onChange={(event) =>
                          setUploadForm({ ...uploadForm, recipientName: event.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small mb-1">
                        Relationship <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. Child, Parent"
                        list="upload-recipient-relationships"
                        value={uploadForm.recipientRelationship}
                        onChange={(event) =>
                          setUploadForm({
                            ...uploadForm,
                            recipientRelationship: event.target.value,
                          })
                        }
                        required
                      />
                      <datalist id="upload-recipient-relationships">
                        <option value="Child" />
                        <option value="Parent" />
                        <option value="Spouse" />
                        <option value="Sibling" />
                        <option value="Relative" />
                        <option value="Carer" />
                        <option value="Other" />
                      </datalist>
                    </div>
                    <div>
                      <label className="form-label small mb-1">
                        Recipient age <span className="text-danger">*</span>
                      </label>
                      <div className="input-group recipient-age-input">
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          max={130}
                          step={1}
                          placeholder="Age"
                          value={ageFromDob(uploadForm.recipientDateOfBirth)}
                          onChange={(event) =>
                            setUploadForm({
                              ...uploadForm,
                              recipientDateOfBirth:
                                event.target.value === ""
                                  ? ""
                                  : dobFromAge(Number(event.target.value)),
                            })
                          }
                          required
                        />
                        <span className="input-group-text small">years</span>
                      </div>
                    </div>
                  </div>

                  <div className="recipient-clinical-grid">
                    <div className="recipient-clinical-field recipient-clinical-field--allergy">
                      <label className="form-label small mb-1 text-danger-emphasis d-flex align-items-center gap-1">
                        <i className="bi bi-shield-exclamation text-danger" />
                        Known allergies
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. Penicillin, Aspirin, or None"
                        value={uploadForm.recipientAllergies}
                        onChange={(event) =>
                          setUploadForm({ ...uploadForm, recipientAllergies: event.target.value })
                        }
                      />
                      <small className="text-secondary d-block mt-1">Helps pharmacist check for allergy risks.</small>
                    </div>
                    <div className="recipient-clinical-field recipient-clinical-field--condition">
                      <label className="form-label small mb-1 text-warning-emphasis d-flex align-items-center gap-1">
                        <i className="bi bi-heart-pulse text-warning" />
                        Chronic illnesses / conditions
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. Asthma, Diabetes, Hypertension, or None"
                        value={uploadForm.recipientConditions}
                        onChange={(event) =>
                          setUploadForm({ ...uploadForm, recipientConditions: event.target.value })
                        }
                      />
                      <small className="text-secondary d-block mt-1">Helps pharmacist verify drug interactions.</small>
                    </div>
                  </div>
                </div>
              )}
            </fieldset>
            <fieldset className="mt-3">
              <legend className="form-label">
                What should the pharmacy do after reviewing it?
              </legend>
              <label
                className={`preparation-choice ${uploadForm.prepareRequested && !uploadForm.deliveryRequested ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="prepareRequested"
                  checked={uploadForm.prepareRequested && !uploadForm.deliveryRequested}
                  onChange={() =>
                    setUploadForm({ ...uploadForm, prepareRequested: true, deliveryRequested: false })
                  }
                />
                <span>
                  <strong>✓ Ask the pharmacy to prepare my medicines in advance so I can collect quickly.</strong>
                  <small>
                    The pharmacist will review the prescription, enter its directions and quantities, and prepare one complete final bill. You acknowledge and pay before medicines are prepared for collection.
                  </small>
                </span>
              </label>
              <label className={`preparation-choice ${uploadForm.deliveryRequested ? 'selected' : ''}`}>
                <input type="radio" name="prepareRequested" checked={Boolean(uploadForm.deliveryRequested)} onChange={() => setUploadForm({ ...uploadForm, prepareRequested: true, deliveryRequested: true })} />
                <span><strong>Prepare my medicines for home delivery</strong><small>Medicines and the separate delivery fee must be paid and verified before dispatch. Track the courier, tracking number and dispatch date under Home deliveries.</small></span>
              </label>
              {uploadForm.deliveryRequested && <div className="my-3">
                <label className="form-label" htmlFor="upload-delivery-name">Delivery recipient name</label>
                <input id="upload-delivery-name" className="form-control" required {...personNameInputProps(deliveryRecipientName => setUploadForm(previous => ({ ...previous, deliveryRecipientName })))} value={uploadForm.deliveryRecipientName || ''} onChange={e => setUploadForm({ ...uploadForm, deliveryRecipientName: e.target.value })} />
                <label className="form-label" htmlFor="upload-delivery-address">Delivery address</label>
                <textarea id="upload-delivery-address" className="form-control" required minLength={10} maxLength={500} value={uploadForm.deliveryAddress || ''} onChange={e => setUploadForm({ ...uploadForm, deliveryAddress: e.target.value })} />
                <label className="form-label mt-2" htmlFor="upload-delivery-phone">Delivery phone number</label>
                <input id="upload-delivery-phone" type="tel" className="form-control" required pattern="(0|\+94)[0-9]{9}" placeholder="0701234567 or +94701234567" value={uploadForm.deliveryPhone || ''} onChange={e => setUploadForm({ ...uploadForm, deliveryPhone: e.target.value })} />
              </div>}
              <label
                className={`preparation-choice ${!uploadForm.prepareRequested ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="prepareRequested"
                  checked={!uploadForm.prepareRequested}
                  onChange={() =>
                    setUploadForm({ ...uploadForm, prepareRequested: false, deliveryRequested: false })
                  }
                />
                <span>
                  <strong>Send me the complete bill to review first</strong>
                  <small>
                    The pharmacist will fully review the prescription and issue the final itemized bill in one step. You can acknowledge and pay it, or decline it. This is not a rough estimate, and no stock is reserved before payment.
                  </small>
                </span>
              </label>
            </fieldset>
            <Alert message={error} />
            <ModalActions
              onClose={closeUpload}
              submitLabel={editingUpload ? 'Save changes' : 'Upload prescription'}
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
              {!!review.attachments?.length && <div className="d-flex flex-wrap gap-2 mb-2">
                {review.attachments.map((attachment, index) => <button type="button" className="btn btn-sm btn-outline-secondary" key={attachment.id} onClick={() => openFile(review, attachment)}>View attachment {index + 2}: {attachment.originalName}</button>)}
              </div>}
              <div className="d-flex justify-content-between align-items-center gap-2 mb-2 flex-wrap">
                <strong>Submitted prescription</strong>
                <div className="btn-group btn-group-sm" aria-label="Document size">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.max(320, height - 140))} title="Make viewer shorter"><i className="bi bi-dash-lg" /></button>
                  <button type="button" className="btn btn-outline-secondary" onClick={fitDocumentViewer} title="Fit document to window">Fit</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.min(1000, height + 140))} title="Make viewer taller"><i className="bi bi-plus-lg" /></button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => openFile(review)} title="Open full size"><i className="bi bi-arrows-fullscreen" /></button>
                </div>
              </div>
              {reviewText ? (
                <pre className="prescription-text-viewer" style={{ height: documentViewerHeight }}>{reviewText}</pre>
              ) : reviewUrl && isImageUpload(review.mimeType) ? (
                <img className="prescription-document-image" src={reviewUrl} alt={review.originalName} style={{ height: documentViewerHeight }} />
              ) : reviewUrl ? (
                <iframe src={fittedDocumentUrl(reviewUrl, review.mimeType)} title={review.originalName} style={{ height: documentViewerHeight }} />
              ) : (
                <div className="loading">Loading prescription…</div>
              )}
            </div>
            <form onSubmit={submitReview} className="prescription-review-form">
              {!review.orderedForSelf && (
                <div className={`recipient-clinical-summary alert ${review.recipientAllergies || review.recipientConditions ? "alert-warning" : "alert-info"} small mb-3`}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                    <strong className="d-flex align-items-center gap-1">
                      <i className="bi bi-person-heart" />
                      Recipient: {review.recipientName} ({review.recipientRelationship})
                    </strong>
                    <span className="badge bg-secondary-subtle text-secondary border">
                      Third-party order
                    </span>
                  </div>
                  <div>
                    <strong>Age:</strong>{" "}
                    {review.recipientDateOfBirth
                      ? `${ageFromDob(review.recipientDateOfBirth)} years`
                      : "Not provided"}
                  </div>
                  <div className="mt-1">
                    <strong>Known allergies:</strong>{" "}
                    {review.recipientAllergies ? (
                      <span className="text-danger fw-semibold">
                        <i className="bi bi-shield-exclamation text-danger me-1" />
                        {review.recipientAllergies}
                      </span>
                    ) : (
                      <span className="text-secondary">None reported</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <strong>Chronic conditions / illnesses:</strong>{" "}
                    {review.recipientConditions ? (
                      <span className="fw-semibold text-warning-emphasis">
                        <i className="bi bi-heart-pulse text-warning me-1" />
                        {review.recipientConditions}
                      </span>
                    ) : (
                      <span className="text-secondary">None reported</span>
                    )}
                  </div>
                </div>
              )}
              {!review.prescription && review.estimatedTotal == null && !["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(review.status) && (
                <div className="upload-review-steps-indicator mb-3 p-2 bg-light border rounded d-flex justify-content-around text-center small">
                  <div className="step-item fw-bold text-primary">
                    <span className="badge rounded-circle me-1 bg-primary">1</span>
                    Review prescription
                  </div>
                  <div className="step-divider text-secondary align-self-center">&rarr;</div>
                  <div className="step-item fw-bold text-primary">
                    <span className="badge rounded-circle me-1 bg-primary">2</span>
                    Enter directions &amp; create final bill
                  </div>
                  <div className="step-divider text-secondary align-self-center">&rarr;</div>
                  <div className="step-item fw-bold text-secondary">
                    <span className="badge rounded-circle me-1 bg-secondary">3</span>
                    Customer reviews &amp; pays
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
                      ? (review.deliveryRequested ? "Prepare the complete prescription and final bill for home delivery" : "Prepare the complete prescription and final bill for collection")
                      : "Prepare the complete prescription and final bill for the customer to review"}
                  </strong>
                  <small>Review the source, enter the full directions and quantities, then issue the final itemized bill in one step. No estimate approval is needed.</small>
                </div>
              </div>
              {reviewForm.status !== "UNAVAILABLE" && (review.estimatedTotal != null || ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(review.status)) && (
                <section className="estimate-calculator">
                  <div className="estimate-calculator-heading">
                    <div>
                      <strong>{review.prepareRequested ? "Internal stock &amp; pricing check" : "Quotation calculator"}</strong>
                      <small>
                        {review.prepareRequested
                          ? "For pharmacy use only. The final bill is recalculated when issued; this working amount is not sent to the patient."
                          : "Uses current prices, usable stock, discounts, coupon, bottle fees, and tax. No stock is deducted."}
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
                              min={stockQuantityStep(selectedProduct?.unit)}
                              step={stockQuantityStep(selectedProduct?.unit)}
                              value={item.quantity}
                              onChange={(event) =>
                                updateEstimateItem(
                                  index,
                                  "quantity",
                                  event.target.value,
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
                                    min={stockQuantityStep(selectedProduct?.unit)}
                                    max={
                                      selectedProduct
                                        ? usableStock(selectedProduct)
                                        : undefined
                                    }
                                    step={stockQuantityStep(selectedProduct?.unit)}
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateEstimateRetailItem(
                                        index,
                                        "quantity",
                                        event.target.value,
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
                      {estimateBusy ? "Calculating…" : "Recalculate / Verify estimate"}
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
                          {review.prepareRequested ? "Internal working total " : "Quotation total "}
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
                    {review.status === "PENDING" && review.estimatedTotal == null ? (
                      <>
                        <option value="UNAVAILABLE">Medicines unavailable</option>
                        <option value="REJECTED">Rejected upload</option>
                      </>
                    ) : (
                      <>
                        <option value="AVAILABLE">All listed medicines available</option>
                        <option value="PARTIALLY_AVAILABLE">Some medicines available</option>
                        <option value="UNAVAILABLE">Medicines unavailable</option>
                        <option value="REJECTED">Rejected upload</option>
                      </>
                    )}
                  </select>
                </div>
                {!['UNAVAILABLE', 'REJECTED'].includes(reviewForm.status) && (
                  <div>
                    <label className="form-label">
                      {review.prepareRequested ? "Internal working amount (not sent to patient)" : "Legacy quotation amount"}
                    </label>
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
                      This is a rough estimate for an existing quotation only. A final invoice is recalculated when the pharmacy processes the request.
                    </small>
                  </div>
                )}
                <div className="full">
                  <label className="form-label">
                    {reviewForm.status === "REJECTED"
                      ? "Rejection reason"
                      : reviewForm.status === "UNAVAILABLE"
                        ? "Why the requested items are unavailable"
                        : review.prepareRequested ? "Availability review notes" : "Availability notes for the patient"}{" "}
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
                      reviewForm.status === "REJECTED"
                        ? "Explain why the uploaded request cannot be processed."
                        : reviewForm.status === "AVAILABLE"
                          ? "Optional note for the patient."
                          : "Explain which medicines are unavailable and any alternative the patient can discuss with the pharmacist."
                    }
                    required={reviewForm.status !== "AVAILABLE"}
                  />
                </div>
              </div>
              <div className="alert alert-warning small mt-3 mb-0">
                {review.estimatedTotal != null || ["QUOTE_SENT", "QUOTE_ACCEPTED"].includes(review.status)
                    ? "This record uses the older quotation flow. Send the estimate only if the customer needs a quote; their approval is required before preparing the final bill."
                    : "This is an optional availability/rejection review. For a normal upload, use the upload card’s final-prescription action to transcribe the prescription, check stock and issue its complete bill in one step. Do not send a rough estimate."}
              </div>
              {/* Keep the old quote action available only for records that already have a saved estimate. */}
              {["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(review.status) && !review.prepareRequested && !review.prescription && review.estimatedTotal != null && (
                <div className="mt-3">
                  <div className="alert alert-info small mb-2">
                    <i className="bi bi-send me-2" />
                    Send this quotation to the patient. Their approval changes the request into an order the pharmacy may prepare.
                  </div>
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    disabled={busy || review.estimatedTotal == null}
                    onClick={() => sendQuotation(review)}
                  >
                    <i className="bi bi-send me-2" />
                    Send quotation to patient
                  </button>
                </div>
              )}
              {/* ── Awaiting patient payment ── */}
              {review.status === "PAYMENT_PENDING" && (
                <div className="alert alert-warning small mt-3">
                  <i className="bi bi-hourglass me-2" />
                  Quotation sent. Waiting for the patient to make a bank transfer and upload their receipt.
                </div>
              )}
              {/* ── Cashier to verify slip ── */}
              {review.status === "PAYMENT_SUBMITTED" && (
                <div className="alert alert-warning small mt-3">
                  <i className="bi bi-receipt me-2" />
                  The patient has uploaded a bank transfer receipt. Waiting for the cashier to verify it.
                </div>
              )}
              {/* ── Payment verified — create prescription ── */}
              {review.prescription ? (
                <div className="alert alert-success small mt-3">
                  Structured order:{" "}
                  <strong>{review.prescription.prescriptionNumber}</strong> ·{" "}
                  {review.prescription.status}
                </div>
              ) : review.status === "READY_TO_PREPARE" ? (
                <div className="mt-3">
                  <div className="alert alert-success small mb-2">
                    <i className="bi bi-check-circle-fill me-2" />
                    <strong>Payment has been verified by the cashier.</strong> Please prepare the medicines and create the prescription.
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() => {
                      navigate(buildPrescriptionCreateUrl(review));
                    }}
                  >
                    <i className="bi bi-file-medical me-2" />
                    Create prescription &amp; prepare medicines
                  </button>
                </div>
              ) : review.status === "QUOTE_ACCEPTED" ? (
                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => {
                    navigate(buildPrescriptionCreateUrl(review));
                  }}
                >
                  <i className="bi bi-file-medical me-2" />
                  Create prescription and prepare cashier invoice
                </button>
              ) : !review.prepareRequested ? (
                <div className="alert alert-secondary small mt-3">
                  <i className="bi bi-info-circle me-2" />
                  {review.status === "QUOTE_SENT"
                    ? "A quotation was sent. Wait for the patient to approve it before preparing the final prescription."
                    : ["AVAILABLE", "PARTIALLY_AVAILABLE"].includes(review.status)
                      ? "Availability has been saved. The patient can request a final bill for collection or home delivery from their upload card."
                      : "The customer asked to check availability first. Save the pharmacy review and wait for the patient's decision."}
                </div>
              ) : null}
              <Alert message={error} />
              <div className="modal-actions review-modal-actions">
                {review.status === "PENDING" && (
                  <button type="button" className="btn btn-outline-danger" disabled={busy || estimateBusy} onClick={() => { setRejectionReason(""); setRejectionError(""); setError(""); setRejectOpen(true); }}>
                    <i className="bi bi-x-octagon me-2" />Reject upload
                  </button>
                )}
                <div className="review-modal-primary-actions">
                  <button type="button" className="btn btn-light" disabled={busy} onClick={closeReview}>
                    Cancel
                  </button>
                  {review.status === "PENDING" && (
                    <button type="submit" className="btn btn-primary" disabled={busy || estimateBusy}>
                      {busy ? "Saving…" : review.estimatedTotal == null ? "Save review outcome" : "Save availability review"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {review && rejectOpen && (
        <Modal title="Reject prescription upload" size="sm" closable={!busy} onClose={() => setRejectOpen(false)}>
          <form onSubmit={event => { event.preventDefault(); void rejectUpload(); }}>
            <p>Explain why this upload cannot be accepted. The patient will see this reason.</p>
            <label className="form-label" htmlFor="upload-rejection-reason">Rejection reason</label>
            <textarea id="upload-rejection-reason" className="form-control" rows={4} required minLength={3} maxLength={1000}
              placeholder="For example: The prescription image is unreadable. Please upload a clearer photo."
              value={rejectionReason} onChange={event => setRejectionReason(event.target.value)} disabled={busy} />
            <Alert message={rejectionError} />
            <div className="modal-actions">
              <button type="button" className="btn btn-light" disabled={busy} onClick={() => setRejectOpen(false)}>Back to review</button>
              <button type="submit" className="btn btn-danger" disabled={busy || estimateBusy || rejectionReason.trim().length < 3}>
                {busy ? 'Rejecting…' : 'Confirm rejection'}
              </button>
            </div>
          </form>
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
              <button type="button" className="btn btn-outline-secondary" onClick={fitDocumentViewer} title="Fit document to window">Fit</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setDocumentViewerHeight((height) => Math.min(1000, height + 140))}><i className="bi bi-plus-lg" /></button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.open(preview.url, "_blank", "noopener,noreferrer")} title="Open full size"><i className="bi bi-arrows-fullscreen" /></button>
            </div>
          </div>
          {preview.text ? (
            <pre className="prescription-text-viewer" style={{ height: documentViewerHeight }}>{preview.text}</pre>
          ) : isImageUpload(preview.item.mimeType) ? (
            <img
              className="prescription-popup-viewer prescription-document-image"
              src={preview.url}
              alt={preview.item.originalName}
              style={{ height: documentViewerHeight }}
            />
          ) : (
            <iframe
              className="prescription-popup-viewer"
              src={fittedDocumentUrl(preview.url, preview.item.mimeType)}
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
      {/* ── Patient: Bank Transfer Receipt Upload Modal ── */}
      {slipUploadItem && (
        <Modal
          title="Upload bank transfer receipt"
          onClose={() => setSlipUploadItem(null)}
          size="sm"
        >
          <form onSubmit={submitSlip}>
            <div className="alert alert-info small">
              <i className="bi bi-bank me-2" />
              Upload proof of your bank transfer for <strong>{slipUploadItem.patient.fullName}</strong>.
              Expected amount: <strong>{money(slipUploadItem.estimatedTotal)}</strong>.
            </div>
            {bankAccounts.length > 0 && (
              <div className="bank-account-list mb-3">
                {bankAccounts.map((ba: any) => (
                  <div key={ba.id} className="bank-account-card">
                    <i className="bi bi-bank" />
                    <div>
                      <strong>{ba.bankName}</strong>
                      <small>{ba.accountName} · {ba.accountNumber}{ba.branch ? ` · ${ba.branch}` : ""}</small>
                      {ba.instructions && <small className="text-secondary">{ba.instructions}</small>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="form-label">Receipt file (PDF, JPEG, PNG, or WebP)</label>
            <input
              className="form-control"
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              required
              onChange={(event) => setSlipForm({ ...slipForm, file: event.target.files?.[0] || null })}
            />
            <label className="form-label mt-3">Amount transferred (Rs.)</label>
            <div className="input-group">
              <span className="input-group-text">Rs.</span>
              <input
                className="form-control"
                type="number"
                min="0.01"
                step="0.01"
                value={slipForm.declaredAmount}
                onChange={(event) => setSlipForm({ ...slipForm, declaredAmount: event.target.value })}
                required
              />
            </div>
            <label className="form-label mt-3">Bank account transferred to (optional)</label>
            <select
              className="form-select"
              value={slipForm.bankAccountId}
              onChange={(event) => setSlipForm({ ...slipForm, bankAccountId: event.target.value })}
            >
              <option value="">— Select bank account —</option>
              {bankAccounts.map((ba: any) => (
                <option key={ba.id} value={ba.id}>{ba.bankName} · {ba.accountNumber}</option>
              ))}
            </select>
            <label className="form-label mt-3">Transfer reference / transaction ID (optional)</label>
            <input
              className="form-control"
              value={slipForm.reference}
              onChange={(event) => setSlipForm({ ...slipForm, reference: event.target.value })}
              placeholder="e.g. TXN12345678"
            />
            <label className="form-label mt-3">Date of transfer (optional)</label>
            <input
              className="form-control"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={slipForm.paidOn}
              onChange={(event) => setSlipForm({ ...slipForm, paidOn: event.target.value })}
            />
            <label className="form-label mt-3">Note to cashier (optional)</label>
            <textarea
              className="form-control"
              maxLength={500}
              value={slipForm.note}
              onChange={(event) => setSlipForm({ ...slipForm, note: event.target.value })}
              placeholder="Any additional information for the cashier."
            />
            <Alert message={error} />
            <ModalActions onClose={() => setSlipUploadItem(null)} submitLabel="Submit receipt" busy={busy} />
          </form>
        </Modal>
      )}

      {/* ── Cashier: Bank Transfer Slip Review Modal ── */}
      {slipReviewItem && (
        <Modal
          title={`Review payment receipt — ${slipReviewItem.upload.patient.fullName}`}
          onClose={closeSlipReview}
          size="xl"
        >
          <div className="prescription-review-split">
            <div className="prescription-document-pane">
              <strong>Submitted receipt</strong>
              {slipReviewUrl ? (
                <iframe src={slipReviewUrl} title="Payment receipt" style={{ height: 600, marginTop: 8 }} />
              ) : (
                <div className="loading mt-2">Loading receipt…</div>
              )}
            </div>
            <div className="prescription-review-form">
              <div className="alert alert-light border small">
                <strong>Patient:</strong> {slipReviewItem.upload.patient.fullName} · {slipReviewItem.upload.patient.email}
                <br />
                <strong>Estimated invoice:</strong> {money(slipReviewItem.upload.estimatedTotal)}
              </div>
              <div className="availability-box mb-3">
                <div>
                  <small>Declared amount</small>
                  <strong>{money(slipReviewItem.slip.declaredAmount)}</strong>
                </div>
                <div>
                  <small>Transfer reference</small>
                  <strong>{slipReviewItem.slip.reference || "—"}</strong>
                </div>
                {slipReviewItem.slip.bankAccount && (
                  <div>
                    <small>Bank account</small>
                    <strong>{slipReviewItem.slip.bankAccount.bankName} · {slipReviewItem.slip.bankAccount.accountNumber}</strong>
                  </div>
                )}
                {slipReviewItem.slip.paidOn && (
                  <div>
                    <small>Transfer date</small>
                    <strong>{new Date(slipReviewItem.slip.paidOn).toLocaleDateString()}</strong>
                  </div>
                )}
                {slipReviewItem.slip.note && (
                  <div className="full">
                    <small>Patient note</small>
                    <strong>{slipReviewItem.slip.note}</strong>
                  </div>
                )}
              </div>
              <div className="alert alert-warning small">
                <i className="bi bi-shield-exclamation me-2" />
                Verify the declared amount matches your bank records before approving. Approving will move this request to <strong>Ready to Prepare</strong> and notify the pharmacist.
              </div>
              <label className="form-label">Rejection reason (required only when rejecting)</label>
              <textarea
                className="form-control"
                rows={3}
                maxLength={500}
                value={slipReviewForm.reason}
                onChange={(event) => setSlipReviewForm({ reason: event.target.value })}
                placeholder="Explain why the slip was not accepted, e.g. amount mismatch, unclear image."
              />
              <Alert message={error} />
              <div className="d-flex gap-2 mt-3 flex-wrap justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={closeSlipReview}>Cancel</button>
                <button type="button" className="btn btn-danger" disabled={busy} onClick={rejectSlip}>
                  <i className="bi bi-x-octagon me-2" />Reject slip
                </button>
                <button type="button" className="btn btn-success" disabled={busy} onClick={approveSlip}>
                  <i className="bi bi-check-circle me-2" />Approve — mark payment verified
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Patient: Cancel / Decline Request Modal ── */}
      {cancelModal && (
        <Modal
          title={`Cancel prescription request #${cancelModal.upload.id}`}
          onClose={() => setCancelModal(null)}
          size="sm"
        >
          <form onSubmit={submitCancelUpload}>
            <div className="alert alert-danger small">
              <i className="bi bi-exclamation-triangle me-2" />
              Are you sure you want to cancel this prescription quotation request? This action cannot be undone.
            </div>
            <label className="form-label">Reason for cancellation (optional)</label>
            <textarea
              className="form-control"
              rows={3}
              maxLength={300}
              value={cancelModal.reason}
              onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
              placeholder="e.g. Purchased elsewhere, price reconsideration, uploaded incorrect document..."
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setCancelModal(null)}
              submitLabel="Cancel request"
              busy={busy}
            />
          </form>
        </Modal>
      )}
    </WorkflowGuard>
  );
}

