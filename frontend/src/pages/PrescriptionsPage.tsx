import { personNameInputProps } from '../utils/personName';
import { UploadAttachmentSelector } from '../components/UploadAttachmentSelector';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { api, errorMessage } from "../api/client";
import { useHistoryPage } from "../api/useHistoryPage";
import { DocumentPreview, type DocumentTarget } from "../components/DocumentPreview";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ActionsDropdown } from "../components/ActionsDropdown";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal, ModalActions } from "../components/Modal";
import { PasswordField } from "../components/PasswordField";
import { SearchableSelect } from "../components/SearchableSelect";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import { isCountableUnit, issuableTotal, stockQuantityStep } from "../utils/unitMeasure";
import "../prescriptions.css";

type RxItem = {
  id: number;
  productId: number;
  quantityPerDose: string;
  doseInputAmount?: string;
  doseInputUnit?: string;
  concentrationAmount?: string;
  concentrationUnit?: string;
  concentrationVolume?: string;
  timesPerDay: number;
  daysSupply: number;
  calculatedQuantity: string;
  prescribedQuantity: string;
  dispensedQuantity: string;
  cancelledQuantity?: string;
  notSuppliedQuantity?: string;
  pendingQuantity?: string;
  cancellationReasons?: string[];
  quantityOverridden: boolean;
  overrideReason?: string;
  dosageInstructions: string;
  administrationRoute?: string;
  mealTiming?: string;
  asNeeded?: boolean;
  specialInstructions?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  product: {
    genericName: string;
    strength: string;
    dosageForm?: string;
    unit: string;
    sellingPrice: string;
    storageInstructions?: string;
    minimumAgeYears?: number | null;
    maximumAgeYears?: number | null;
  };
};
type StaffActor = { id: number; fullName: string; role?: string };
type Dispensing = {
  id: number;
  dispensedAt: string;
  notes?: string;
  pharmacist: { id: number; fullName: string; email: string; role: string };
  sale?: {
    invoiceNumber: string;
    status: string;
    subtotal: string;
    discount: string;
    containerFee: string;
    tax: string;
    total: string;
    amountPaid: string;
  };
  items: {
    quantity: string;
    prescriptionItem: {
      dosageInstructions?: string;
      product: { genericName: string; unit: string };
    };
  }[];
};
type Rx = {
  id: number;
  prescriptionNumber: string;
  prescriberTitle?: string;
  prescriberName: string;
  prescriberReference?: string;
  prescriptionDate: string;
  createdAt: string;
  verifiedAt?: string;
  status: string;
  notes?: string;
  pickupNote?: string;
  plannedPickupAt?: string;
  orderedForSelf: boolean;
  recipientName?: string;
  recipientRelationship?: string;
  recipientDateOfBirth?: string;
  recipientAllergies?: string | null;
  recipientConditions?: string | null;
  createdBy?: StaffActor;
  verifiedBy?: StaffActor;
  patient: {
    id: number;
    patientNumber: string;
    user: { id: number; fullName: string };
  };
  items: RxItem[];
  retailItems?: {
    id: number;
    productId: number;
    quantity: string;
    product: {
      id: number;
      genericName: string;
      strength: string;
      unit: string;
      dosageForm?: string;
      sellingPrice: string;
    };
  }[];
  dispensings: Dispensing[];
  sourceUpload?: {
    id: number;
    originalName: string;
    mimeType: string;
    status: string;
  };
  paymentRequest?: any;
  refillsAllowed?: number;
  refillsUsed?: number;
  originalPrescriptionId?: number | null;
  isOnline?: boolean;
};
type Line = {
  id?: number;
  productId: number;
  quantityPerDose: number | string;
  liquidDoseMode: "VOLUME" | "STRENGTH";
  doseInputAmount: number | string;
  doseInputUnit: string;
  concentrationAmount: number | string;
  concentrationUnit: string;
  concentrationVolume: number | string;
  timesPerDay: number | string;
  daysSupply: number | string;
  administrationRoute: string;
  mealTiming: string;
  asNeeded: boolean;
  specialInstructions: string;
  dosageInstructions: string;
  frequency: string;
  duration: string;
  overrideEnabled: boolean;
  overrideQuantity: number | string;
  overrideReason: string;
};
const line = (): Line => ({
  productId: 0,
  quantityPerDose: 1,
  liquidDoseMode: "VOLUME",
  doseInputAmount: 1,
  doseInputUnit: "ml",
  concentrationAmount: "",
  concentrationUnit: "mg",
  concentrationVolume: "",
  timesPerDay: 1,
  daysSupply: 1,
  administrationRoute: "Oral",
  mealTiming: "ANY_TIME",
  asNeeded: false,
  specialInstructions: "",
  dosageInstructions: "",
  frequency: "",
  duration: "",
  overrideEnabled: false,
  overrideQuantity: "",
  overrideReason: "",
});
const localDateTime = (value: Date | string = new Date()) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const emptyForm = () => ({
  patientId: 0,
  sourceUploadId: null as number | null,
  sourceUploadStatus: null as string | null,
  prescriberTitle: "",
  prescriberName: "",
  prescriberReference: "",
  prescriptionDate: localDateTime(),
  orderedForSelf: true,
  recipientName: "",
  recipientRelationship: "",
  recipientDateOfBirth: "",
  recipientAllergies: "",
  recipientConditions: "",
  notes: "",
  pickupNote: "",
  plannedPickupAt: "",
  couponCode: "",
  containerFee: 0,
  tax: 0,
  items: [line()],
  retailItems: [] as { productId: number; quantity: number }[],
});
const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const prescriberLabel = (
  prescription: Pick<Rx, "prescriberTitle" | "prescriberName">,
) =>
  [prescription.prescriberTitle, prescription.prescriberName]
    .filter(Boolean)
    .join(" ") || "Not mentioned";
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
const usableStock = (product: any) =>
  product?.batches?.reduce(
    (sum: number, batch: any) =>
      Number(batch.quantityAvailable) > 0 &&
      (!batch.expiryDate || new Date(batch.expiryDate) >= new Date())
        ? sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0)
        : sum,
    0,
  ) || 0;
const isLiquid = (product?: any) =>
  /^(ml|millilitre|milliliter)s?$/i.test(product?.unit || "") ||
  /syrup|suspension|solution|elixir|liquid/i.test(product?.dosageForm || "");
const parseConcentration = (strength?: string) => {
  const match = strength?.match(
    /([\d.]+)\s*(mcg|µg|mg|g)\s*(?:\/|per)\s*([\d.]*)\s*(ml|mL)/i,
  );
  return match
    ? {
        amount: Number(match[1]),
        unit: match[2].toLowerCase().replace("µg", "mcg"),
        volume: Number(match[3] || 1),
      }
    : null;
};
const cleanNumber = (value: number) => Number(value.toFixed(3)).toString();
const doseText = (value: number) => {
  const whole = Math.floor(value);
  const fraction = Number((value - whole).toFixed(3));
  const symbol = ({ 0.25: "¼", 0.5: "½", 0.75: "¾" } as Record<number, string>)[
    fraction
  ];
  return symbol ? `${whole || ""}${symbol}` : cleanNumber(value);
};
const massInMg = (value: number, unit: string) =>
  /^g$/i.test(unit)
    ? value * 1000
    : /^(mcg|µg)$/i.test(unit)
      ? value / 1000
      : value;
const displayUnit = (unit: string, quantity: number) => {
  if (/^ml$/i.test(unit)) return "mL";
  if (Math.abs(quantity) <= 1 || /mg|mcg|g/i.test(unit)) return unit;
  return unit.endsWith("s") ? unit : `${unit}s`;
};
const frequencyText = (times: number) =>
  (
    ({
      1: "once daily",
      2: "twice daily",
      3: "three times daily",
      4: "four times daily",
      6: "every 4 hours",
      8: "every 3 hours",
      12: "every 2 hours",
      24: "every hour",
    }) as Record<number, string>
  )[times] || `${times} times daily`;
const instructionOpening = (route: string, quantity: number, unit: string) => {
  const dose = `${doseText(quantity)} ${displayUnit(unit || "unit", quantity)}`;
  if (route === "Topical") return `Apply ${dose} to the affected area`;
  if (route === "Inhalation") return `Inhale ${dose}`;
  if (route === "Ophthalmic") return `Instil ${dose} into the affected eye`;
  if (route === "Otic") return `Instil ${dose} into the affected ear`;
  if (route === "Nasal") return `Use ${dose} in the nose`;
  if (route === "Rectal") return `Insert ${dose} rectally`;
  if (route === "Vaginal") return `Insert ${dose} vaginally`;
  if (["Subcutaneous", "Intramuscular", "Intravenous"].includes(route))
    return `Administer ${dose} by ${route.toLowerCase()} injection`;
  return `Take ${dose} by mouth`;
};

import { WorkflowGuard } from '../components/WorkflowGuard';
export function PrescriptionsPage() {
  const [documentPreview, setDocumentPreview] = useState<DocumentTarget | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const uploadOpened = useRef(false);
  const { user } = useAuth();
  const staff = user!.role !== "PATIENT";
  const [rows, setRows] = useState<Rx[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [operationSettings, setOperationSettings] = useState({
    requirePickupPin: true,
    cashierCanDispenseAtPayment: false,
    cashReservationHours: 24,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<{
    mode: "create" | "edit";
    rx?: Rx;
  } | null>(null);
  const [sourceFileUrl, setSourceFileUrl] = useState("");
  const [sourceFileText, setSourceFileText] = useState("");
  const [sourceFileMimeType, setSourceFileMimeType] = useState("");
  const loadSourceAttachment = async (blob: Blob) => {
    if (sourceFileUrl) URL.revokeObjectURL(sourceFileUrl);
    setSourceFileUrl(URL.createObjectURL(blob)); setSourceFileMimeType(blob.type);
    setSourceFileText(blob.type === 'text/plain' ? await blob.text() : '');
  };
  const [sourceViewerHeight, setSourceViewerHeight] = useState(620);
  const [action, setAction] = useState<{
    type: "reject" | "dispense" | "history" | "withdraw";
    rx: Rx;
  } | null>(null);
  const [declineInvoice, setDeclineInvoice] = useState<{ rx: Rx; reason: string } | null>(null);
  const [requestCancel, setRequestCancel] = useState<{ rx: Rx; reason: string } | null>(null);
  const [confirm, setConfirm] = useState<Rx | null>(null);
  const [refillTarget, setRefillTarget] = useState<Rx | null>(null);
  const [patientModal, setPatientModal] = useState(false);
  const [collectionModal, setCollectionModal] = useState<Rx | null>(null);
  const [reverify, setReverify] = useState<any>(null);
  const [collectionForm, setCollectionForm] = useState({
    plannedPickupAt: "",
    pickupNote: "",
  });
  const [form, setForm] = useState<any>(emptyForm());
  const [reason, setReason] = useState("");
  const [dispense, setDispense] = useState<any>({
    items: [],
    retailItems: [],
    amountPaid: 0,
    tax: 0,
    paymentMethod: "CASH",
    couponCode: "",
    addBottleFee: false,
    bottleCount: 1,
    bottleFeePerBottle: 0,
    containerFee: 0,
    notes: "",
    reservationHours: 24,
  });
  const [patientForm, setPatientForm] = useState({
    onlineAccess: false,
    fullName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    address: "",
    allergies: "",
    chronicConditions: "",
  });
  const [quote, setQuote] = useState<any>(null);
  const [quoteBusy, setQuoteBusy] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [dispenseSuccess, setDispenseSuccess] = useState<any>(null);
  const [listSearch, setListSearch] = useState("");
  const [processorFilter, setProcessorFilter] = useState<string | number>("");
  const [statusFilter, setStatusFilter] = useState("");
  const { get: readHistory, controls: historyControls } = useHistoryPage('Prescriptions', { status: statusFilter, search: listSearch });
  const load = useCallback(async () => {
    try {
      const requests = [readHistory("/prescriptions")];
      if (staff)
        requests.push(
          api.get("/patients"),
          api.get("/catalog/products"),
          api.get("/settings/operations"),
        );
      const result = await Promise.all(requests);
      setRows(result[0].data.data);
      if (staff) {
        setPatients(result[1].data.data);
        setProducts(result[2].data.data);
        setOperationSettings(result[3].data.data);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [staff, readHistory]);
  const searchPatients = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const response = await api.get("/patients", { params: { search: query } });
      setPatients((prev) => {
        const byId = new Map(prev.map((patient: any) => [patient.id, patient]));
        for (const patient of response.data.data) byId.set(patient.id, patient);
        return [...byId.values()];
      });
    } catch {
      // best-effort live search; keep whatever options are already loaded
    }
  }, []);
  const searchMedicines = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const response = await api.get("/catalog/products", { params: { search: query } });
      setProducts((prev) => {
        const byId = new Map(prev.map((product: any) => [product.id, product]));
        for (const product of response.data.data) byId.set(product.id, product);
        return [...byId.values()];
      });
    } catch {
      // best-effort live search; keep whatever options are already loaded
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const uploadId = Number(searchParams.get("uploadId"));
    const patientUserId = Number(searchParams.get("patientUserId"));
    const orderedForSelf = searchParams.get("orderedForSelf") !== "0";
    if (
      !staff ||
      !uploadId ||
      !patientUserId ||
      uploadOpened.current
    )
      return;
    // Try to find the patient in the already-loaded list first.
    // If they're not there (large patient DB / not yet loaded), fetch by userId directly.
    const openWithPatient = (patient: any) => {
      if (!patient) return;
      uploadOpened.current = true;
      // Pre-populate medicine rows from the estimate items so the pharmacist
      // only has to fill in dosage instructions rather than re-selecting everything.
      let items: Line[] = [line()];
      let retailItems: { productId: number; quantity: number }[] = [];
      let billingInput = { couponCode: "", containerFee: 0, tax: 0 };
      try {
        const raw = searchParams.get("estimateInput") || searchParams.get("estimateItems");
        if (raw) {
          const parsed = JSON.parse(raw);
          const input = Array.isArray(parsed) ? { items: parsed } : parsed;
          const medicineLines: { productId: number; quantity: number }[] = input.items || [];
          if (medicineLines.length) {
            items = medicineLines.map((entry) => ({
              ...line(),
              productId: entry.productId,
              prescribedQuantity: entry.quantity,
              overrideEnabled: true,
              overrideQuantity: entry.quantity,
              overrideReason: "Pre-filled from upload quotation",
            }));
          }
          retailItems = (input.retailItems || []).map((entry: any) => ({ productId: Number(entry.productId), quantity: Number(entry.quantity) }));
          billingInput = {
            couponCode: input.couponCode || "",
            containerFee: Number(input.containerFee || 0),
            tax: Number(input.tax || 0),
          };
        }
      } catch {
        // malformed JSON — fall back to a blank row
      }
      setForm({
        ...emptyForm(),
        patientId: patient.id,
        sourceUploadId: uploadId,
        sourceUploadStatus: searchParams.get("uploadStatus") || null,
        orderedForSelf,
        recipientName: orderedForSelf ? "" : searchParams.get("recipientName") || "",
        recipientRelationship: orderedForSelf ? "" : searchParams.get("recipientRelationship") || "",
        recipientDateOfBirth: orderedForSelf ? "" : searchParams.get("recipientDateOfBirth") || "",
        recipientAllergies: orderedForSelf ? "" : searchParams.get("recipientAllergies") || "",
        recipientConditions: orderedForSelf ? "" : searchParams.get("recipientConditions") || "",
        ...billingInput,
        items,
        retailItems,
      });
      setEditor({ mode: "create" });
      api
        .get(`/prescription-uploads/${uploadId}/file`, { responseType: "blob" })
        .then(async (response) => {
          setSourceFileUrl(URL.createObjectURL(response.data));
          setSourceFileMimeType(response.data.type || "");
          setSourceFileText(
            response.data.type === "text/plain" ? await response.data.text() : "",
          );
        })
        .catch((caught) => setError(errorMessage(caught)));
      setSearchParams({}, { replace: true });
    };

    const cached = patients.find(
      (candidate) => candidate.user.id === patientUserId,
    );
    if (cached) {
      openWithPatient(cached);
    } else {
      // Not in cache — fetch directly so we never silently fail
      api
        .get("/patients", { params: { search: String(patientUserId), userId: patientUserId } })
        .then((response) => {
          const found = (response.data.data as any[]).find(
            (p) => p.user.id === patientUserId,
          );
          if (found) {
            setPatients((prev) => {
              const byId = new Map(prev.map((p: any) => [p.id, p]));
              byId.set(found.id, found);
              return [...byId.values()];
            });
            openWithPatient(found);
          } else {
            setError("Could not find the patient linked to this upload. Please select them manually.");
          }
        })
        .catch(() => setError("Failed to load the patient profile for this upload. Please select the patient manually."));
    }
  }, [patients, searchParams, setSearchParams, staff]);

  const processorOptions = useMemo(() => {
    const actors = rows
      .flatMap((rx) => [
        rx.createdBy,
        rx.verifiedBy,
        ...rx.dispensings.map((issue) => issue.pharmacist),
      ])
      .filter(Boolean) as StaffActor[];
    return [
      { value: "", label: "All staff members" },
      ...[...new Map(actors.map((actor) => [actor.id, actor])).values()]
        .sort((first, second) => first.fullName.localeCompare(second.fullName))
        .map((actor) => ({
          value: actor.id,
          label: actor.fullName,
          description: actor.role?.toLowerCase() || "pharmacist",
        })),
    ];
  }, [rows]);
  const filteredRows = useMemo(() => {
    const term = listSearch.trim().toLowerCase();
    const processorId = Number(processorFilter) || null;
    return rows.filter((rx) => {
      const actors = [
        rx.createdBy,
        rx.verifiedBy,
        ...rx.dispensings.map((issue) => issue.pharmacist),
      ].filter(Boolean);
      const processorMatches =
        !processorId || actors.some((actor: any) => actor.id === processorId);
      const statusMatches = !statusFilter || rx.status === statusFilter;
      const searchable = [
        rx.prescriptionNumber,
        rx.patient.user.fullName,
        rx.patient.patientNumber,
        rx.prescriberName,
        ...rx.items.map(
          (item) => `${item.product.genericName} ${item.product.strength}`,
        ),
        ...actors.map((actor: any) => actor.fullName),
      ]
        .join(" ")
        .toLowerCase();
      return (
        processorMatches &&
        statusMatches &&
        (!term || searchable.includes(term))
      );
    });
  }, [rows, listSearch, processorFilter, statusFilter]);
  const retailProductOptions = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.active &&
            !product.prescriptionRequired &&
            usableStock(product) > 0,
        )
        .map((product) => {
          const available = usableStock(product);
          return {
            value: product.id,
            label: `${product.genericName}${product.strength && product.strength !== "N/A" ? ` ${product.strength}` : ""}`,
            description: `${product.sku}${product.barcode ? ` · ${product.barcode}` : ""} · ${money(product.sellingPrice)} · Stock ${available} ${product.unit}`,
          };
        }),
    [products],
  );
  useEffect(() => {
    if (
      action?.type !== "dispense" ||
      (!dispense.items.length && !dispense.retailItems.length) ||
      dispense.items.some((item: any) => Number(item.quantity) <= 0) ||
      dispense.retailItems.some(
        (item: any) =>
          !Number(item.productId) || Number(item.quantity) <= 0,
      )
    ) {
      setQuote(null);
      setQuoteError("");
      return;
    }
    let cancelled = false;
    const saved = action.rx.paymentRequest;
    if (saved && saved.status !== "CANCELLED") {
      const requestedLines = [
        ...dispense.items.map((item: any) => ({ key: `rx-${item.prescriptionItemId}`, quantity: Number(item.quantity) })),
        ...dispense.retailItems.map((item: any) => ({ key: `retail-${item.productId}`, quantity: Number(item.quantity) })),
      ];
      const savedLines = saved.items.map((item: any) => ({ key: item.prescriptionItemId != null ? `rx-${item.prescriptionItemId}` : `retail-${item.productId}`, quantity: Number(item.quantity) }));
      const sameLines = requestedLines.length === savedLines.length && requestedLines.every((item: any) => savedLines.some((line: any) => line.key === item.key && line.quantity === item.quantity));
      if (sameLines && Number(dispense.tax) === Number(saved.tax) && Number(dispense.containerFee || 0) === Number(saved.containerFee || 0) && (dispense.couponCode || "") === (saved.couponCode || "")) {
        setQuote({ ...saved, appliedDiscounts: [], lines: saved.items.map((item: any) => ({ ...item, name: item.product.genericName, unit: item.product.unit })), amountPaid: 0 });
        setQuoteError("");
        setQuoteBusy(false);
        return;
      }
    }
    const timer = window.setTimeout(async () => {
      setQuoteBusy(true);
      setQuoteError("");
      try {
        const {
          pickupPin: _pickupPin,
          paymentRequestId: _paymentRequestId,
          ...quoteInput
        } = dispense;
        const response = await api.post(
          `/prescriptions/${action.rx.id}/dispense-quote`,
          quoteInput,
        );
        if (!cancelled) setQuote(response.data.data);
      } catch (caught) {
        if (!cancelled) {
          setQuote(null);
          setQuoteError(errorMessage(caught));
        }
      } finally {
        if (!cancelled) setQuoteBusy(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [action?.type, action?.rx.id, action?.rx.paymentRequest, dispense]);

  const openEditor = (rx?: Rx) => {
    setError("");
    if (rx)
      setForm({
        patientId: rx.patient.id,
        sourceUploadId: rx.sourceUpload?.id || null,
        prescriberTitle: rx.prescriberTitle || "",
        prescriberName: rx.prescriberName,
        prescriberReference: rx.prescriberReference || "",
        prescriptionDate: localDateTime(rx.prescriptionDate),
        orderedForSelf: rx.orderedForSelf,
        recipientName: rx.recipientName || "",
        recipientRelationship: rx.recipientRelationship || "",
        recipientDateOfBirth: rx.recipientDateOfBirth ? rx.recipientDateOfBirth.slice(0, 10) : "",
        recipientAllergies: rx.recipientAllergies || "",
        recipientConditions: rx.recipientConditions || "",
        notes: rx.notes || "",
        pickupNote: rx.pickupNote || "",
        plannedPickupAt: rx.plannedPickupAt ? localDateTime(rx.plannedPickupAt) : "",
        items: rx.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantityPerDose: item.quantityPerDose,
          liquidDoseMode:
            item.doseInputUnit && item.doseInputUnit.toLowerCase() !== "ml"
              ? "STRENGTH"
              : "VOLUME",
          doseInputAmount: item.doseInputAmount || item.quantityPerDose,
          doseInputUnit: item.doseInputUnit || "ml",
          concentrationAmount: item.concentrationAmount || "",
          concentrationUnit: item.concentrationUnit || "mg",
          concentrationVolume: item.concentrationVolume || "",
          timesPerDay: item.timesPerDay,
          daysSupply: item.daysSupply,
          administrationRoute: item.administrationRoute || "Oral",
          mealTiming: item.mealTiming || "ANY_TIME",
          asNeeded: item.asNeeded || false,
          specialInstructions: item.specialInstructions || "",
          dosageInstructions: item.dosageInstructions || "",
          frequency: item.frequency || "",
          duration: item.duration || "",
          overrideEnabled: item.quantityOverridden,
          overrideQuantity: item.quantityOverridden
            ? item.prescribedQuantity
            : "",
          overrideReason: item.overrideReason || "",
        })),
        retailItems:
          rx.retailItems?.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
          })) || [],
      });
    else setForm(emptyForm());
    setSourceFileMimeType(rx?.sourceUpload?.mimeType || "");
    setEditor({ mode: rx ? "edit" : "create", rx });
  };
  const closeEditor = () => {
    if (sourceFileUrl) URL.revokeObjectURL(sourceFileUrl);
    setSourceFileUrl("");
    setSourceFileText("");
    setSourceFileMimeType("");
    setEditor(null);
  };
  const updateLine = (index: number, changes: Partial<Line>) => {
    const items = [...form.items];
    const structured = [
      "productId",
      "quantityPerDose",
      "doseInputAmount",
      "doseInputUnit",
      "concentrationAmount",
      "concentrationUnit",
      "concentrationVolume",
      "timesPerDay",
      "daysSupply",
      "administrationRoute",
      "mealTiming",
      "asNeeded",
      "specialInstructions",
    ];
    const structuredChange =
      !Object.prototype.hasOwnProperty.call(changes, "dosageInstructions") &&
      Object.keys(changes).some((key) => structured.includes(key));
    const regenerate =
      structuredChange &&
      (!items[index].dosageInstructions ||
        items[index].dosageInstructions === generatedDirections(items[index]));
    items[index] = {
      ...items[index],
      ...changes,
      ...(regenerate ? { dosageInstructions: "" } : {}),
    };
    setForm({ ...form, items });
  };
  const effectiveDose = (item: Line) => {
    const product = products.find(
      (candidate) => candidate.id === Number(item.productId),
    );
    if (!isLiquid(product) || item.liquidDoseMode === "VOLUME")
      return Number(item.quantityPerDose);
    const dose = massInMg(Number(item.doseInputAmount), item.doseInputUnit);
    const concentration = massInMg(
      Number(item.concentrationAmount),
      item.concentrationUnit,
    );
    const volume = Number(item.concentrationVolume);
    return dose > 0 && concentration > 0 && volume > 0
      ? Number(((dose / concentration) * volume).toFixed(3))
      : 0;
  };
  const calculated = (item: Line) => {
    const product = products.find(
      (candidate) => candidate.id === Number(item.productId),
    );
    const dose = effectiveDose(item);
    const raw = dose * Number(item.timesPerDay) * Number(item.daysSupply);
    return { product, dose, total: issuableTotal(raw, product?.unit) };
  };
  const generatedDirections = (item: Line) => {
    const { product, dose } = calculated(item);
    const times = Number(item.timesPerDay);
    const days = Number(item.daysSupply);
    const timing: Record<string, string> = {
      BEFORE_FOOD: "before meals",
      WITH_FOOD: "with food",
      AFTER_FOOD: "after meals",
      EMPTY_STOMACH: "on an empty stomach",
    };
    const schedule = item.asNeeded
      ? `when needed, up to ${times === 1 ? "once a day" : `${times} times a day`}`
      : frequencyText(times);
    const sentence = `${instructionOpening(item.administrationRoute, dose, product?.unit || "unit")} ${schedule}${timing[item.mealTiming] ? ` ${timing[item.mealTiming]}` : ""} for ${days} day${days === 1 ? "" : "s"}`;
    const special = item.specialInstructions.trim().replace(/[.!]+$/, "");
    return `${sentence}${special ? `. ${special}` : ""}.`;
  };
  const selectMedicine = (index: number, productId: number) => {
    const product = products.find(
      (candidate) => candidate.id === Number(productId),
    );
    const concentration = parseConcentration(product?.strength);
    if (!isLiquid(product))
      return updateLine(index, {
        productId,
        quantityPerDose: 1,
        liquidDoseMode: "VOLUME",
        doseInputAmount: 1,
        doseInputUnit: "ml",
        concentrationAmount: "",
        concentrationUnit: "mg",
        concentrationVolume: "",
      });
    if (concentration)
      return updateLine(index, {
        productId,
        liquidDoseMode: "STRENGTH",
        doseInputAmount: concentration.amount,
        doseInputUnit: concentration.unit,
        concentrationAmount: concentration.amount,
        concentrationUnit: concentration.unit,
        concentrationVolume: concentration.volume,
        quantityPerDose: concentration.volume,
      });
    updateLine(index, {
      productId,
      liquidDoseMode: "VOLUME",
      doseInputAmount: 1,
      doseInputUnit: "ml",
      concentrationAmount: "",
      concentrationUnit: "mg",
      concentrationVolume: "",
      quantityPerDose: 1,
    });
  };
  const payload = () => ({
    ...form,
    patientId: Number(form.patientId),
    prescriberTitle: form.prescriberTitle || null,
    prescriptionDate: new Date(form.prescriptionDate).toISOString(),
    recipientName: form.orderedForSelf ? null : form.recipientName,
    recipientRelationship: form.orderedForSelf
      ? null
      : form.recipientRelationship,
    recipientDateOfBirth: form.orderedForSelf
      ? null
      : form.recipientDateOfBirth,
    recipientAllergies: form.orderedForSelf
      ? null
      : (form.recipientAllergies?.trim() || null),
    recipientConditions: form.orderedForSelf
      ? null
      : (form.recipientConditions?.trim() || null),
    pickupNote: form.pickupNote || null,
    plannedPickupAt: form.plannedPickupAt ? new Date(form.plannedPickupAt).toISOString() : null,
    items: form.items.map((item: Line) => {
      const liquid = isLiquid(
        products.find((product) => product.id === Number(item.productId)),
      );
      const strengthMode = liquid && item.liquidDoseMode === "STRENGTH";
      return {
        id: item.id,
        productId: Number(item.productId),
        quantityPerDose: effectiveDose(item),
        doseInputAmount: liquid
          ? Number(strengthMode ? item.doseInputAmount : effectiveDose(item))
          : null,
        doseInputUnit: liquid
          ? strengthMode
            ? item.doseInputUnit
            : "ml"
          : null,
        concentrationAmount: strengthMode
          ? Number(item.concentrationAmount)
          : null,
        concentrationUnit: strengthMode ? item.concentrationUnit : null,
        concentrationVolume: strengthMode
          ? Number(item.concentrationVolume)
          : null,
        timesPerDay: Number(item.timesPerDay),
        daysSupply: Number(item.daysSupply),
        administrationRoute: item.administrationRoute,
        mealTiming: item.mealTiming,
        asNeeded: item.asNeeded,
        specialInstructions: item.specialInstructions || null,
        dosageInstructions:
          item.dosageInstructions || generatedDirections(item),
        frequency: item.frequency || frequencyText(Number(item.timesPerDay)),
        duration:
          item.duration ||
          `${item.daysSupply} day${Number(item.daysSupply) === 1 ? "" : "s"}`,
        overrideQuantity: item.overrideEnabled
          ? Number(item.overrideQuantity)
          : undefined,
        overrideReason: item.overrideEnabled ? item.overrideReason : undefined,
      };
    }),
    retailItems: form.retailItems.map((item: any) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    })),
    couponCode: form.couponCode || null,
    containerFee: Number(form.containerFee || 0),
    tax: Number(form.tax || 0),
  });
  const save = async (
    event?: FormEvent,
    options?: { autoVerify?: boolean; sendToCashier?: boolean },
  ) => {
    if (event) event.preventDefault();
    if (!editor) return;
    setBusy(true);
    setError("");
    try {
      if (editor.mode === "create") {
        const body = {
          ...payload(),
          autoVerify: options?.autoVerify ?? false,
          sendToCashier: options?.sendToCashier ?? false,
        };
        await api.post("/prescriptions", body);
        closeEditor();
        setError("");
      } else {
        const response = await api.put(`/prescriptions/${editor.rx!.id}`, payload());
        closeEditor();
        if (editor.rx?.status === "VERIFIED" && response.data.data?.status === "PENDING") setReverify(response.data.data);
      }
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const confirmVerify = async (event?: FormEvent, andSendToCashier = false) => {
    if (event) event.preventDefault();
    if (!reverify) return;
    setBusy(true);
    setError("");
    try {
      const rxId = reverify.id;
      if (andSendToCashier) {
        // Review charges and notes before the atomic verify-and-bill submission.
        setReverify(null);
        await openAction("dispense", reverify);
        return;
      } else {
        await api.post(`/prescriptions/${rxId}/verify`);
      }
      setReverify(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const openCollectionModal = (rx: Rx) => {
    setError("");
    setCollectionModal(rx);
    setCollectionForm({
      plannedPickupAt: rx.plannedPickupAt ? localDateTime(rx.plannedPickupAt) : "",
      pickupNote: rx.pickupNote || "",
    });
  };
  const saveCollection = async (event: FormEvent) => {
    event.preventDefault();
    if (!collectionModal) return;
    setBusy(true);
    setError("");
    try {
      await api.patch(`/prescriptions/${collectionModal.id}/pickup-details`, {
        pickupNote: collectionForm.pickupNote,
        plannedPickupAt: collectionForm.plannedPickupAt ? new Date(collectionForm.plannedPickupAt).toISOString() : null,
      });
      setCollectionModal(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const verify = async (rx: Rx) => {
    try {
      await api.post(`/prescriptions/${rx.id}/verify`);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const openAction = (
    type: "reject" | "dispense" | "history" | "withdraw",
    rx: Rx,
  ) => {
    setReason("");
    setQuote(null);
    setQuoteError("");
    setError("");
    if (sourceFileUrl) URL.revokeObjectURL(sourceFileUrl);
    setSourceFileUrl("");
    setSourceFileText("");
    if (type === "dispense" && rx.sourceUpload)
      api
        .get(`/prescription-uploads/${rx.sourceUpload.id}/file`, {
          responseType: "blob",
        })
        .then(async (response) => {
          setSourceFileUrl(URL.createObjectURL(response.data));
          setSourceFileMimeType(response.data.type || rx.sourceUpload?.mimeType || "");
          setSourceFileText(
            response.data.type === "text/plain" ? await response.data.text() : "",
          );
        })
        .catch((caught) => setError(errorMessage(caught)));
    if (type === "dispense")
      {
      const existingContainerFee = Number(rx.paymentRequest?.containerFee || 0);
      setDispense({
        items: rx.items
          .filter(
            (item) =>
              Number(item.dispensedQuantity) + Number(item.cancelledQuantity || 0) < Number(item.prescribedQuantity),
          )
          .map((item) => ({
            prescriptionItemId: item.id,
            name: item.product.genericName,
            unit: item.product.unit,
            dosageForm: item.product.dosageForm,
            quantity:
              Number((Number(item.prescribedQuantity) - Number(item.dispensedQuantity) - Number(item.cancelledQuantity || 0)).toFixed(3)),
            maximum:
              Number((Number(item.prescribedQuantity) - Number(item.dispensedQuantity) - Number(item.cancelledQuantity || 0)).toFixed(3)),
          })),
        // A cancelled bill may refer to prescription items that were deleted and
        // recreated during a later prescription edit. Their foreign keys become
        // null, which makes them indistinguishable from genuine retail lines.
        // Treat a resend as a fresh billing cycle and seed retail products from
        // the current prescription only; otherwise old medicine lines can be
        // duplicated as retail items in the new cashier bill.
        retailItems:
          rx.paymentRequest && rx.paymentRequest.status !== "CANCELLED"
          ? rx.paymentRequest.items
              .filter((item: any) => item.prescriptionItemId == null)
              .map((item: any) => ({
                productId: item.productId,
                name: `${item.product.genericName}${item.product.strength && item.product.strength !== "N/A" ? ` ${item.product.strength}` : ""}`,
                unit: item.product.unit,
                dosageForm: item.product.dosageForm,
                quantity: Number(item.quantity),
              }))
          : (rx.retailItems || []).map((item) => ({
              productId: item.productId,
              name: `${item.product.genericName}${item.product.strength && item.product.strength !== "N/A" ? ` ${item.product.strength}` : ""}`,
              unit: item.product.unit,
              dosageForm: item.product.dosageForm,
              quantity: Number(item.quantity),
            })),
        amountPaid: 0,
        tax: Number(rx.paymentRequest?.tax || 0),
        paymentMethod: "CASH",
        couponCode: rx.paymentRequest?.couponCode || "",
        addBottleFee: existingContainerFee > 0,
        bottleCount: existingContainerFee > 0 ? 1 : 1,
        bottleFeePerBottle: existingContainerFee,
        containerFee: existingContainerFee,
        notes: rx.paymentRequest?.pharmacyNote || "",
        revisionReason: "",
        reservationHours: Number(rx.paymentRequest?.reservationDurationHours || operationSettings.cashReservationHours || 24),
        paymentRequestId: rx.paymentRequest?.id || null,
        pickupPin: "",
      });
      }
    setAction({ type, rx });
  };
  const continuationOpened = useRef(0);
  useEffect(() => {
    const prescriptionId = Number(searchParams.get("continueRx"));
    if (!prescriptionId) {
      continuationOpened.current = 0;
      return;
    }
    if (!['ADMIN', 'PHARMACIST'].includes(user!.role) || continuationOpened.current === prescriptionId) return;
    continuationOpened.current = prescriptionId;
    api.get(`/prescriptions/${prescriptionId}`).then((response) => {
      const rx = response.data.data as Rx;
      const canCreateBill = rx.status === "VERIFIED"
        && (!rx.paymentRequest || ["CANCELLED", "FULFILLED"].includes(rx.paymentRequest.status));
      const canBillRemainder = rx.status === "PARTIALLY_DISPENSED"
        && (!rx.paymentRequest || ["CANCELLED", "FULFILLED"].includes(rx.paymentRequest.status));
      if (canCreateBill || canBillRemainder) openAction("dispense", rx);
      else setError(`Prescription ${rx.prescriptionNumber} is ${rx.status.replaceAll("_", " ").toLowerCase()} and cannot be sent to the cashier right now.`);
    }).catch((caught) => setError(errorMessage(caught))).finally(() => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("continueRx");
      setSearchParams(nextParams, { replace: true });
    });
  }, [staff, user, searchParams, setSearchParams, openAction]);
  const closeAction = () => {
    if (sourceFileUrl) URL.revokeObjectURL(sourceFileUrl);
    setSourceFileUrl("");
    setSourceFileText("");
    setSourceFileMimeType("");
    setAction(null);
  };
  const dispenseHasLiquid = [
    ...dispense.items,
    ...dispense.retailItems,
  ].some((item: any) => isLiquid(item));
  const updateDispenseBottleFee = (
    bottleCount: number,
    bottleFeePerBottle: number,
    enabled = dispense.addBottleFee,
  ) => {
    setDispense({
      ...dispense,
      addBottleFee: enabled,
      bottleCount,
      bottleFeePerBottle,
      containerFee: enabled
        ? Number((bottleCount * bottleFeePerBottle).toFixed(2))
        : 0,
    });
  };
  const saveAction = async (event: FormEvent) => {
    event.preventDefault();
    if (!action) return;
    setBusy(true);
    setError("");
    try {
      if (action.type === "reject") {
        await api.post(`/prescriptions/${action.rx.id}/reject`, { reason });
        closeAction();
        load();
      }
      if (action.type === "withdraw") {
        await api.post(
          `/payment-requests/${action.rx.paymentRequest.id}/cancel`,
          { reason },
        );
        closeAction();
        await load();
        const refreshed = await api.get(`/prescriptions/${action.rx.id}`);
        openEditor(refreshed.data.data);
      }
      if (action.type === "dispense") {
        const response = await api.post(`/prescriptions/${action.rx.id}/dispense`, {
          ...dispense,
          pickupPin: dispense.pickupPin || undefined,
        });
        setDispenseSuccess(response.data.data);
        load();
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const openPaymentPdf = async (
    request: any,
    kind: "handoff" | "receipt" = "handoff",
  ) => {
    setDocumentPreview({ id: request.id, kind, name: request.requestNumber });
  };
  const printBagLabel = (rx: Rx, issue: Dispensing) => {
    const win = window.open("", "_blank", "width=600,height=800");
    if (!win) return;
    // Names, product labels and directions may be entered by users. Escape all
    // values before building this print-only document so none can become HTML.
    const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]!);
    // The print window has no reason to retain a reference to the signed-in app.
    win.opener = null;

    const itemsHtml = issue.items
      .map(
        (item) => `
        <div style="border-bottom: 1px dashed #ccc; padding: 6px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>${escapeHtml(item.prescriptionItem.product.genericName)}</span>
            <span>Qty: ${escapeHtml(item.quantity)} ${escapeHtml(item.prescriptionItem.product.unit)}</span>
          </div>
          <div style="font-size: 11px; color: #555; margin-top: 2px; white-space: pre-wrap;">
            ${escapeHtml(item.prescriptionItem.dosageInstructions || "As directed.")}
          </div>
        </div>
      `
      )
      .join("");

    win.document.write(`
      <html>
        <head>
          <title>Print Bag Label - ${escapeHtml(rx.prescriptionNumber)}</title>
          <style>
            @page { size: A6; margin: 0; }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              margin: 15px;
              color: #000;
              background: #fff;
              font-size: 13px;
              line-height: 1.4;
            }
            .label-container {
              border: 2px solid #000;
              padding: 12px;
              border-radius: 8px;
              min-height: calc(100vh - 30px);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              border-bottom: 2px double #000;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .pharmacy-name {
              font-size: 18px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .title {
              font-size: 11px;
              font-weight: 600;
              color: #666;
              margin-top: 2px;
            }
            .patient-box {
              background: #f0f4f8;
              border: 1px solid #000;
              padding: 8px;
              margin-bottom: 8px;
              border-radius: 4px;
            }
            .patient-name {
              font-size: 16px;
              font-weight: 800;
            }
            .rx-info {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin-bottom: 8px;
              font-family: monospace;
            }
            .items-title {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
              margin-bottom: 4px;
            }
            .items-container {
              flex-grow: 1;
            }
            .footer-box {
              border-top: 1px solid #000;
              padding-top: 8px;
              margin-top: 8px;
              font-size: 11px;
            }
            .signature-line {
              margin-top: 15px;
              border-top: 1px dashed #000;
              padding-top: 4px;
              text-align: right;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div>
              <div class="header">
                <div class="pharmacy-name">MEDIFLOW PHARMACY</div>
                <div class="title">PATIENT DISPENSING LABEL</div>
              </div>
              
              <div class="patient-box">
                <div style="font-size: 10px; text-transform: uppercase; color: #555;">Patient</div>
                <div class="patient-name">${escapeHtml(rx.patient.user.fullName)}</div>
                <div style="font-size: 11px;">No: ${escapeHtml(rx.patient.patientNumber)}</div>
              </div>
              
              <div class="rx-info">
                <span>RX: <strong>${escapeHtml(rx.prescriptionNumber)}</strong></span>
                <span>Date: ${escapeHtml(new Date(issue.dispensedAt).toLocaleDateString())}</span>
              </div>
              
              <div class="items-title">Dispensed Medicines</div>
              <div class="items-container">
                ${itemsHtml}
              </div>
            </div>
            
            <div class="footer-box">
              <div>Dispensed by: <strong>${escapeHtml(issue.pharmacist.fullName)}</strong></div>
              <div>Time: ${escapeHtml(new Date(issue.dispensedAt).toLocaleTimeString())}</div>
              <div class="signature-line">
                Verified & Handed Over By (Signature)
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };
  const sendToCashier = async () => {
    if (!action || action.type !== "dispense") return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/prescriptions/${action.rx.id}/${action.rx.status === "PENDING" ? "send-to-cashier" : "payment-request"}`, {
        items: dispense.items.map((item: any) => ({
          prescriptionItemId: item.prescriptionItemId,
          quantity: Number(item.quantity),
        })),
        retailItems: dispense.retailItems.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
        couponCode: dispense.couponCode || null,
        containerFee: Number(dispense.containerFee || 0),
        tax: Number(dispense.tax),
        notes: dispense.notes || null,
        reservationHours: Number(dispense.reservationHours || operationSettings.cashReservationHours || 24),
      });
      closeAction();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const updateCashierBill = async () => {
    if (!action || action.type !== "dispense") return;
    setBusy(true);
    setError("");
    try {
      await api.put(`/prescriptions/${action.rx.id}/payment-request`, {
        revision: action.rx.paymentRequest.revision,
        revisionReason: dispense.revisionReason || null,
        items: dispense.items.map((item: any) => ({
          prescriptionItemId: item.prescriptionItemId,
          quantity: Number(item.quantity),
        })),
        retailItems: dispense.retailItems.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
        couponCode: dispense.couponCode || null,
        containerFee: Number(dispense.containerFee || 0),
        tax: Number(dispense.tax),
        notes: dispense.notes || null,
        reservationHours: Number(dispense.reservationHours || operationSettings.cashReservationHours || 24),
      });
      closeAction();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    setError("");
    try {
      await api.delete(`/prescriptions/${confirm.id}`);
      setConfirm(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const handleRefill = async (rx: Rx) => {
    setRefillTarget(rx);
  };
  const issueRefill = async () => {
    if (!refillTarget) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/prescriptions/${refillTarget.id}/refill`, {});
      setRefillTarget(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const createPatient = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await api.post("/patients", {
        ...patientForm,
        email: patientForm.onlineAccess ? patientForm.email : undefined,
        password: patientForm.onlineAccess ? patientForm.password : undefined,
        dateOfBirth: patientForm.dateOfBirth || null,
      });
      await load();
      setForm({ ...form, patientId: response.data.data.id });
      setPatientModal(false);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const submitDeclineInvoice = async (event: FormEvent) => {
    event.preventDefault();
    if (!declineInvoice) return;
    if (declineInvoice.reason.trim().length < 3) return setError("Enter a reason for declining the invoice.");
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${declineInvoice.rx.paymentRequest!.id}/decline`, {
        reason: declineInvoice.reason.trim(),
      });
      setDeclineInvoice(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const submitRequestCancel = async (event: FormEvent) => {
    event.preventDefault();
    if (!requestCancel?.rx.paymentRequest) return;
    if (requestCancel.reason.trim().length < 3) return setError("Enter a reason for requesting cancellation.");
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${requestCancel.rx.paymentRequest.id}/request-cancellation`, {
        reason: requestCancel.reason.trim(),
      });
      setRequestCancel(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  if (loading) return <Loading />;
  const workflowRx = editor?.rx || (action?.type !== 'history' ? action?.rx : null) || declineInvoice?.rx || requestCancel?.rx || confirm || refillTarget || collectionModal || reverify;
  const workflowResource = workflowRx?.id ? `prescription/${workflowRx.id}` : editor && form.sourceUploadId ? `upload/${form.sourceUploadId}` : null;

  return (
    <WorkflowGuard resource={workflowResource} onCancel={() => { setEditor(null); setAction(null); setDeclineInvoice(null); setRequestCancel(null); setConfirm(null); setRefillTarget(null); setCollectionModal(null); setReverify(null); }}>
      <datalist id="retail-quantity-options">
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="5" />
        <option value="10" />
      </datalist>
      <div className="page-intro">
        <div>
          <h2>{staff ? "Prescription workflow" : "My prescriptions"}</h2>
          <p>
            {staff
              ? "Structured directions, exact timestamps, pharmacist tracking, and FIFO dispensing."
              : "Your prescriptions, how to take each medicine, and what has been collected so far."}
          </p>
        </div>
        {staff && (
          <button className="btn btn-primary" onClick={() => openEditor()}>
            <i className="bi bi-plus-lg me-2" />
            New prescription
          </button>
        )}
      </div>
      <Alert message={error} />
      {historyControls}
      <div className="panel prescription-filters">
        <div className="prescription-filter-grid">
          <div>
            <label className="form-label small">Search prescriptions</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search" />
              </span>
              <PredictiveSearchInput
                value={listSearch}
                onChange={setListSearch}
                placeholder="RX number, patient, medicine or staff"
                suggestions={rows.flatMap((rx) => [
                  rx.prescriptionNumber,
                  rx.patient.user.fullName,
                  rx.prescriberName,
                  ...rx.items.map((item) => item.product.genericName),
                  ...rx.dispensings.map((issue) => issue.pharmacist.fullName),
                ])}
              />
            </div>
          </div>
          <div>
            <label className="form-label small">Processed by</label>
            <SearchableSelect
              options={processorOptions}
              value={processorFilter}
              onChange={setProcessorFilter}
              placeholder="All staff members"
            />
          </div>
          <div>
            <label className="form-label small">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="PARTIALLY_DISPENSED">Partially dispensed</option>
              <option value="DISPENSED">Dispensed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              disabled={!listSearch && !processorFilter && !statusFilter}
              onClick={() => {
                setListSearch("");
                setProcessorFilter("");
                setStatusFilter("");
              }}
            >
              <i className="bi bi-x-circle me-1" />
              Clear
            </button>
          </div>
        </div>
        <small className="text-secondary d-block mt-2">
          Showing {filteredRows.length} of {rows.length} prescriptions
        </small>
      </div>
      <div className="panel">
        {filteredRows.map((rx) => {
          const last = rx.dispensings[0];
          const invoices = rx.dispensings
            .map((issue) => issue.sale)
            .filter((sale): sale is NonNullable<Dispensing["sale"]> =>
              Boolean(sale),
            );
          const invoicedTotal = invoices.reduce(
            (sum, sale) => sum + Number(sale.total),
            0,
          );
          const paidTotal = invoices.reduce(
            (sum, sale) => sum + Number(sale.amountPaid),
            0,
          );
          const invoiceBalance = Math.max(0, invoicedTotal - paidTotal);
          const estimatedValue = rx.items.reduce(
            (sum, item) =>
              sum +
              Number(item.prescribedQuantity) *
                Number(item.product.sellingPrice || 0),
            0,
          );
          return (
            <div className="border rounded-3 p-3 mb-3" key={rx.id}>
              <div className="prescription-card-header">
                <div>
                  <strong>{rx.prescriptionNumber}</strong>
                  {rx.originalPrescriptionId && (
                    <span className="badge ms-2" style={{ backgroundColor: '#6f42c1', color: '#fff' }}>
                      <i className="bi bi-arrow-repeat me-1" />
                      Refill
                    </span>
                  )}
                  {rx.refillsAllowed !== undefined && rx.refillsAllowed > 0 && (
                    <span className="badge bg-info text-dark ms-2">
                      Refills: {rx.refillsUsed} / {rx.refillsAllowed}
                    </span>
                  )}
                  <div className="text-secondary small">
                    {rx.patient.user.fullName} · {prescriberLabel(rx)} ·{" "}
                    {new Date(rx.prescriptionDate).toLocaleString()}
                  </div>
                  <div className="small">
                    {rx.orderedForSelf ? (
                      <span className="text-secondary">Ordered for patient</span>
                    ) : (
                      <div>
                        <span className="fw-semibold text-primary">
                          <i className="bi bi-person-fill me-1" />
                          For {rx.recipientName} ({rx.recipientRelationship}){rx.recipientDateOfBirth ? ` · Age ${ageFromDob(rx.recipientDateOfBirth)}` : ""}
                        </span>
                        {(rx.recipientAllergies || rx.recipientConditions) && (
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {rx.recipientAllergies && (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                <i className="bi bi-shield-exclamation me-1" />
                                Allergies: {rx.recipientAllergies}
                              </span>
                            )}
                            {rx.recipientConditions && (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                                <i className="bi bi-heart-pulse me-1" />
                                Conditions: {rx.recipientConditions}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {(rx.plannedPickupAt || rx.pickupNote) && (
                    <div className="alert alert-info py-2 mt-2 mb-0 small d-flex flex-column align-items-start gap-1" style={{ borderLeft: '3px solid var(--c-info)' }}>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-clock-history me-1" />
                        <strong>Estimated collection:</strong>{" "}
                        {rx.plannedPickupAt
                          ? new Date(rx.plannedPickupAt).toLocaleString()
                          : "Not specified"}
                      </div>
                      {rx.pickupNote && (
                        <div className="text-dark">
                          <strong>Note for pharmacy:</strong> {rx.pickupNote}
                        </div>
                      )}
                    </div>
                  )}
                  {(rx.isOnline || rx.sourceUpload || rx.paymentRequest) && (
                    <div className="mt-2">
                      {(rx.isOnline || rx.sourceUpload) && (
                        <span className="badge text-bg-primary">
                          <i className="bi bi-cloud-check me-1" />
                          Online pharmacy order
                        </span>
                      )}
                      {rx.paymentRequest && (
                        <span className="ms-2 d-inline-flex align-items-center gap-1">
                          <small className="text-secondary">Billing:</small>
                          <Status value={rx.paymentRequest.status} />
                        </span>
                      )}
                      {rx.paymentRequest &&
                        ["PAID", "FULFILLED"].includes(
                          rx.paymentRequest.status,
                        ) && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link"
                            onClick={() =>
                              openPaymentPdf(rx.paymentRequest, "receipt")
                            }
                          >
                            <i className="bi bi-receipt me-1" />
                            Payment receipt
                          </button>
                        )}
                    </div>
                  )}
                  {rx.paymentRequest?.customerCancellationReason && !['CANCELLED', 'FULFILLED'].includes(rx.paymentRequest.status) && <div className="alert alert-warning mt-2"><strong>Collection on hold: customer requested cancellation.</strong><div>{rx.paymentRequest.customerCancellationReason}</div>{staff && <div>Resolve the request at the cashier desk before continuing.</div>}</div>}
                  {rx.paymentRequest?.status === "CANCELLED" && (
                    <div className="alert alert-danger py-2 mt-2 mb-0 small">
                      <strong>
                        Cashier bill {rx.paymentRequest.requestNumber} was cancelled.
                      </strong>
                      {rx.paymentRequest.cancellationReason && (
                        <span className="d-block">
                          Reason: {rx.paymentRequest.cancellationReason}
                        </span>
                      )}
                      <span className="d-block">
                        The prescription remains verified. Review the current items and use
                        &quot;Resend to Cashier&quot; to start a fresh billing cycle.
                      </span>
                    </div>
                  )}
                  <div className="workflow-actors">
                    {!staff && <>
                      <span><i className="bi bi-pencil-square" /><span><strong>Prescription prepared by {rx.createdBy?.fullName || "Not recorded"}</strong><small>{new Date(rx.createdAt).toLocaleString()}</small></span></span>
                      {rx.verifiedBy && <span><i className="bi bi-patch-check" /><span><strong>Verified by {rx.verifiedBy.fullName}</strong>{rx.verifiedAt && <small>{new Date(rx.verifiedAt).toLocaleString()}</small>}</span></span>}
                    </>}
                    {staff ? (
                      <>
                        <span>
                          <i className="bi bi-pencil-square" />
                          <span>
                            <strong>
                              Recorded by{" "}
                              {rx.createdBy?.fullName || "Unknown staff member"}
                            </strong>
                            <small>
                              {rx.createdBy?.role?.toLowerCase() || "staff"} ·{" "}
                              {new Date(rx.createdAt).toLocaleString()}
                            </small>
                          </span>
                        </span>
                        {rx.verifiedBy && rx.verifiedAt && (
                          <span>
                            <i className="bi bi-patch-check" />
                            <span>
                              <strong>
                                Verified by {rx.verifiedBy.fullName}
                              </strong>
                              <small>
                                {rx.verifiedBy.role?.toLowerCase() || "staff"} ·{" "}
                                {new Date(rx.verifiedAt).toLocaleString()}
                              </small>
                            </span>
                          </span>
                        )}
                        {last && (
                          <span>
                            <i className="bi bi-bag-check" />
                            <span>
                              <strong>
                                Dispensed by {last.pharmacist.fullName}
                              </strong>
                              <small>
                                {new Date(last.dispensedAt).toLocaleString()}
                              </small>
                            </span>
                          </span>
                        )}
                      </>
                    ) : last ? (
                      <span>
                        <i className="bi bi-bag-check" />
                        <span>
                          <strong>
                            Dispensed by {last.pharmacist.fullName}
                          </strong>
                          <small>
                            {new Date(last.dispensedAt).toLocaleString()}
                          </small>
                        </span>
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-hourglass-split" />
                        <span>
                          <strong>Not dispensed yet</strong>
                          <small>
                            No pharmacist has issued this prescription.
                          </small>
                        </span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`prescription-billing ${invoices.length ? "actual" : "estimate"}`}
                  >
                    <i
                      className={`bi bi-${invoices.length ? "receipt-cutoff" : "calculator"}`}
                    />
                    <div>
                      {invoices.length ? (
                        <>
                          <strong>
                            {invoices.length === 1
                              ? "Invoice value"
                              : "Total invoiced"}
                            : {money(invoicedTotal)}
                          </strong>
                          <small>
                            {invoices
                              .map((invoice) => invoice.invoiceNumber)
                              .join(", ")}{" "}
                            · Paid {money(paidTotal)} · Balance{" "}
                            {money(invoiceBalance)}
                          </small>
                        </>
                      ) : rx.paymentRequest && rx.paymentRequest.status !== "CANCELLED" ? (
                        <>
                          <strong>
                            Cashier bill: {money(rx.paymentRequest.total)}
                          </strong>
                          <small>
                            Bill {rx.paymentRequest.requestNumber} · Subtotal {money(rx.paymentRequest.subtotal)}
                            {Number(rx.paymentRequest.tax) > 0 ? ` · Tax ${money(rx.paymentRequest.tax)}` : ""}
                            {Number(rx.paymentRequest.discount) > 0 ? ` · Discount ${money(rx.paymentRequest.discount)}` : ""}
                            {` · ${rx.paymentRequest.status.replace(/_/g, " ")}`}
                          </small>
                        </>
                      ) : (
                        <>
                          <strong>
                            Estimated medicine value: {money(estimatedValue)}
                          </strong>
                          <small>
                            Before discounts and tax · finalized at cashier prior to dispensing
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2 prescription-card-status">
                  <small className="text-secondary">Prescription:</small>
                  <Status value={rx.status} />
                  {!staff && !["DISPENSED", "REJECTED"].includes(rx.status) && (
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openCollectionModal(rx)}>
                      <i className="bi bi-calendar-event me-1" />
                      Choose pickup time
                    </button>
                  )}
                  {/* Patient: decline a pending invoice they do not want to pay */}
                  {!staff && rx.paymentRequest?.status === "AWAITING_PAYMENT" && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeclineInvoice({ rx, reason: "" })}
                    >
                      <i className="bi bi-x-circle me-1" />
                      Decline invoice
                    </button>
                  )}
                  {/* Patient: request cancellation if slip submitted or paid before dispensing */}
                  {!staff &&
                    ["SLIP_SUBMITTED", "PAID"].includes(rx.paymentRequest?.status) &&
                    rx.status !== "DISPENSED" &&
                    !rx.paymentRequest?.cancellationReason?.startsWith("Customer cancellation requested:") && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => setRequestCancel({ rx, reason: "" })}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1" />
                        Request order cancellation
                      </button>
                    )}
                  {rx.paymentRequest?.cancellationReason?.startsWith("Customer cancellation requested:") && (
                    <span className="badge bg-warning text-dark">
                      <i className="bi bi-clock-history me-1" />
                      Cancellation requested
                    </span>
                  )}
                  {staff && (
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      {/* ── Status-aware PRIMARY action buttons ── */}
                      {/* PENDING: Verify or Send to Cashier */}
                      {rx.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => verify(rx)}
                          >
                            <i className="bi bi-check-circle me-1" />
                            Verify
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => openAction("dispense", rx)}
                          >
                            <i className="bi bi-send-check me-1" />
                            Verify &amp; Send to Cashier
                          </button>
                        </>
                      )}
                      {/* VERIFIED: Send to cashier (no bill yet) or view billing status */}
                      {rx.status === "VERIFIED" && !rx.paymentRequest && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => openAction("dispense", rx)}
                        >
                          <i className="bi bi-send me-1" />
                          Send to Cashier
                        </button>
                      )}
                      {rx.status === "VERIFIED" &&
                        rx.paymentRequest?.status === "CANCELLED" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() => openAction("dispense", rx)}
                          >
                            <i className="bi bi-arrow-repeat me-1" />
                            Resend to Cashier
                          </button>
                        )}
                      {/* PARTIALLY_DISPENSED: Bill remaining items when previous request fulfilled or cancelled */}
                      {rx.status === "PARTIALLY_DISPENSED" && (!rx.paymentRequest || rx.paymentRequest.status === "FULFILLED") && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => openAction("dispense", rx)}
                        >
                          <i className="bi bi-send me-1" />
                          Bill Remaining
                        </button>
                      )}
                      {rx.status === "PARTIALLY_DISPENSED" &&
                        rx.paymentRequest?.status === "CANCELLED" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() => openAction("dispense", rx)}
                          >
                            <i className="bi bi-arrow-repeat me-1" />
                            Resend Remainder to Cashier
                          </button>
                        )}
                      {/* VERIFIED/PARTIALLY_DISPENSED + AWAITING_PAYMENT: waiting badge */}
                      {["VERIFIED", "PARTIALLY_DISPENSED"].includes(rx.status) &&
                        rx.paymentRequest?.status === "AWAITING_PAYMENT" && (
                          <span className="badge bg-info text-dark">
                            <i className="bi bi-hourglass-split me-1" />
                            Awaiting cashier payment
                          </span>
                        )}
                      {/* VERIFIED/PARTIALLY_DISPENSED + PAID: Dispense button */}
                      {["VERIFIED", "PARTIALLY_DISPENSED"].includes(rx.status) &&
                        rx.paymentRequest?.status === "PAID" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => openAction("dispense", rx)}
                          >
                            <i className="bi bi-shield-check me-1" />
                            {operationSettings.requirePickupPin
                              ? "Verify PIN & Dispense"
                              : "Dispense"}
                          </button>
                        )}
                      {/* DISPENSED: done badge + Refill button */}
                      {rx.status === "DISPENSED" && (
                        <>
                          <span className="badge bg-success">
                            <i className="bi bi-bag-check me-1" />
                            Dispensed
                          </span>
                          {(rx.refillsAllowed || 0) > (rx.refillsUsed || 0) && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              disabled={busy}
                              onClick={() => handleRefill(rx)}
                            >
                              <i className="bi bi-arrow-repeat me-1" />
                              Refill prescription
                            </button>
                          )}
                        </>
                      )}
                      {/* REJECTED: badge */}
                      {rx.status === "REJECTED" && (
                        <span className="badge bg-danger">
                          <i className="bi bi-x-octagon me-1" />
                          Rejected
                        </span>
                      )}

                      {/* ── Compact overflow menu for secondary actions ── */}
                      <ActionsDropdown
                        actions={[
                          ...(["PENDING", "VERIFIED", "PARTIALLY_DISPENSED"].includes(rx.status)
                            ? [
                                {
                                  label: rx.status === "PARTIALLY_DISPENSED" ? "Update directions for remaining medicines" : "Edit prescription",
                                  icon: "pencil",
                                  onClick: () => openEditor(rx),
                                },
                              ]
                            : []),
                          ...(["PENDING", "VERIFIED"].includes(rx.status)
                            ? [
                                {
                                  label: "Reject",
                                  icon: "x-circle",
                                  onClick: () => openAction("reject", rx),
                                },
                              ]
                            : []),
                          ...(rx.paymentRequest?.status === "AWAITING_PAYMENT"
                            ? [
                                {
                                  label: "Withdraw bill & edit prescription",
                                  icon: "x-square",
                                  onClick: () => openAction("withdraw", rx),
                                },
                              ]
                            : []),
                          ...(rx.status === "DISPENSED" && (rx.refillsAllowed || 0) > (rx.refillsUsed || 0)
                            ? [
                                {
                                  label: "Refill prescription",
                                  icon: "arrow-repeat",
                                  onClick: () => handleRefill(rx),
                                },
                              ]
                            : []),
                          {
                            label: "Issue history",
                            icon: "clock-history",
                            onClick: () => openAction("history", rx),
                          },
                          ...(rx.status === "PENDING"
                            ? [
                                {
                                  label: "Delete prescription",
                                  icon: "trash",
                                  danger: true,
                                  onClick: () => setConfirm(rx),
                                },
                              ]
                            : []),
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="table-responsive mt-3">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Calculation</th>
                      <th>Directions</th>
                      <th>Prescribed</th>
                      <th>Dispensed</th>
                      <th>Cancelled</th>
                      <th>Not supplied</th>
                      <th>Pending in this order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.product.genericName} {item.product.strength}
                        </td>
                        <td>
                          {item.doseInputUnit &&
                          item.doseInputUnit.toLowerCase() !== "ml" ? (
                            <>
                              <strong>
                                {item.doseInputAmount} {item.doseInputUnit}
                              </strong>{" "}
                              using {item.concentrationAmount}{" "}
                              {item.concentrationUnit}/
                              {item.concentrationVolume} mL
                              <br />
                              <small>
                                = {item.quantityPerDose} mL per dose ×{" "}
                                {item.timesPerDay}/day × {item.daysSupply} days
                              </small>
                            </>
                          ) : (
                            <>
                              {doseText(Number(item.quantityPerDose))}{" "}
                              {displayUnit(
                                item.product.unit,
                                Number(item.quantityPerDose),
                              )}{" "}
                              × {item.timesPerDay}/day × {item.daysSupply} days
                            </>
                          )}
                          {item.asNeeded && (
                            <>
                              <br />
                              <small className="text-warning">
                                Maximum quantity for when-required use
                              </small>
                            </>
                          )}
                        </td>
                        <td>
                          {/* Dosage directions are clinical — reveal them once paid or dispensed.
                              Staff always see the full details. */}
                          {(!staff && rx.status !== "DISPENSED" && !["PAID", "FULFILLED"].includes(rx.paymentRequest?.status)) ? (
                            <small className="text-secondary fst-italic">
                              <i className="bi bi-lock me-1" />
                              Instructions unlocked once payment is confirmed by cashier
                            </small>
                          ) : (
                            <>
                              {item.dosageInstructions}
                              {item.specialInstructions &&
                                !item.dosageInstructions
                                  ?.toLowerCase()
                                  .includes(
                                    item.specialInstructions.toLowerCase(),
                                  ) && (
                                <>
                                  <br />
                                  <small>{item.specialInstructions}</small>
                                </>
                              )}
                              {item.product.storageInstructions && (
                                <>
                                  <br />
                                  <small className="text-primary">
                                    <i className="bi bi-thermometer-snow me-1" />
                                    Storage: {item.product.storageInstructions}
                                  </small>
                                </>
                              )}
                            </>
                          )}
                        </td>
                        <td>{Number(item.prescribedQuantity)}</td>
                        <td>{Number(item.dispensedQuantity)}</td>
                        <td>{Number(item.cancelledQuantity || 0)}</td>
                        <td>
                          {Number(item.notSuppliedQuantity ?? Math.max(0, Number((Number(item.prescribedQuantity) - Number(item.dispensedQuantity)).toFixed(3))))}
                          {Number(item.cancelledQuantity || 0) > 0 && <div className="small text-secondary mt-1">
                            {(item.cancellationReasons?.length ? item.cancellationReasons : ['Reason not recorded — ask the pharmacy.']).map((reason, index) => <div key={index}>Cancellation reason: {reason}</div>)}
                          </div>}
                        </td>
                        <td>{Math.max(0, Number((Number(item.prescribedQuantity) - Number(item.dispensedQuantity) - Number(item.cancelledQuantity || 0)).toFixed(3)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small text-secondary mt-2 mb-0">
                Not supplied includes cancelled quantities. Pending in this order excludes cancelled quantities and is not a stock reservation.
                {rx.items.some(item => Number(item.cancelledQuantity || 0) > 0) && ' Supplying cancelled quantities requires pharmacist review and a new bill; it does not reopen this order.'}
              </p>
            </div>
          );
        })}
        {!filteredRows.length && (
          <Empty text="No prescriptions match the selected filters." />
        )}
      </div>

      {editor && (
        <Modal
          title={
            editor.mode === "create"
              ? "Record prescription"
              : editor.rx?.status === "VERIFIED"
                ? "Edit verified prescription"
                : "Edit pending prescription"
          }
          onClose={closeEditor}
          size={sourceFileUrl ? "xl" : "lg"}
        >
          {editor.mode === "edit" && editor.rx?.status === "VERIFIED" && (
            <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle me-2" />
              Changes to medicines, clinical instructions, patient details or refills
              move this prescription back to <strong>Pending</strong> for pharmacist review.
              Collection-note and collection-time changes keep verification.
            </div>
          )}
          <div className={sourceFileUrl ? "prescription-editor-split" : ""}>
            {sourceFileUrl && (
              <aside className="prescription-source-pane">
                {form.sourceUploadId && <UploadAttachmentSelector uploadId={form.sourceUploadId} onLoad={loadSourceAttachment} />}
                <div className="document-viewer-toolbar">
                  <strong>Customer-submitted prescription</strong>
                  <div className="btn-group btn-group-sm" aria-label="Document size">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight((height) => Math.max(320, height - 140))} title="Make viewer shorter">
                      <i className="bi bi-dash-lg" />
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight(Math.max(320, Math.min(760, window.innerHeight - 230)))}>Fit</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight((height) => Math.min(1000, height + 140))} title="Make viewer taller">
                      <i className="bi bi-plus-lg" />
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => window.open(sourceFileUrl, "_blank", "noopener,noreferrer")} title="Open full size">
                      <i className="bi bi-arrows-fullscreen" />
                    </button>
                  </div>
                </div>
                <small className="d-block text-secondary mb-2">
                  Keep the source visible while entering medicines and preparing
                  the cashier request.
                </small>
                {sourceFileText ? (
                  <pre className="prescription-text-viewer" style={{ height: sourceViewerHeight }}>{sourceFileText}</pre>
                ) : sourceFileMimeType.startsWith("image/") ? (
                  <div className="prescription-image-viewer" style={{ height: sourceViewerHeight }}>
                    <img src={sourceFileUrl} alt="Customer submitted prescription" />
                  </div>
                ) : (
                  <iframe
                    src={sourceFileUrl}
                    title="Customer submitted prescription"
                    style={{ height: sourceViewerHeight }}
                  />
                )}
              </aside>
            )}
            <form onSubmit={save} className="prescription-editor-form">
              {editor?.rx?.status === "PARTIALLY_DISPENSED" && (
                <div className="alert alert-info">
                  <strong>Remaining medicine directions</strong><br />
                  Update label directions or special instructions only for medicines that still have quantity remaining. Previously dispensed quantities and receipts keep their original directions.
                </div>
              )}
              <div className="form-grid">
                <div>
                  <label className="form-label">Patient</label>
                  <div className="patient-picker-row">
                    <div className="flex-grow-1 min-width-0">
                      <SearchableSelect
                        options={patients.map((patient) => ({
                          value: patient.id,
                          label: patient.user.fullName,
                          description: `${patient.patientNumber} · ${patient.user.phone || "No phone"}${patient.onlineAccess === false ? " · Walk-in — no online login" : ""}`,
                        }))}
                        value={form.patientId}
                        onChange={(patientId) => {
                          setForm({ ...form, patientId: Number(patientId) });
                        }}
                        onQueryChange={searchPatients}
                        placeholder="Search patient name or number"
                        required
                        disabled={Boolean(form.sourceUploadId)}
                      />
                    </div>
                    {!form.sourceUploadId && (
                      <button type="button" className="btn btn-outline-primary patient-picker-add" onClick={() => setPatientModal(true)} title="Create patient" aria-label="Create patient">
                        <i className="bi bi-person-plus" />
                      </button>
                    )}
                  </div>
                  {form.sourceUploadId && (
                    <small className="text-success d-block mt-2">
                      <i className="bi bi-person-check me-1" />
                      Automatically selected from the patient who sent this prescription.
                    </small>
                  )}
                  {form.sourceUploadId && (() => {
                    const sender = patients.find((candidate) => candidate.id === Number(form.patientId));
                    return sender ? (
                      <div className="alert alert-light border small mt-2 mb-0 patient-source-summary">
                        <strong>{sender.user.fullName}</strong>
                        <span>{sender.patientNumber} · {sender.user.phone || "No phone"} · {sender.user.email}</span>
                      </div>
                    ) : null;
                  })()}
                </div>
                <div>
                  <label className="form-label">
                    Doctor-issued date and time
                  </label>
                  <FriendlyDateTimePicker value={form.prescriptionDate} onChange={(prescriptionDate) => setForm({ ...form, prescriptionDate })} pastOnly required />
                  <small className="text-secondary">
                    The original date and time the prescriber wrote or issued this prescription — not the upload or processing time.
                  </small>
                </div>
                <div className="full">
                  <PatientClinicalWarning
                    patient={patients.find(
                      (candidate) => candidate.id === Number(form.patientId),
                    )}
                    recipientDateOfBirth={form.orderedForSelf ? undefined : form.recipientDateOfBirth}
                    thirdPartyRecipient={!form.orderedForSelf}
                    recipientName={form.recipientName}
                    recipientRelationship={form.recipientRelationship}
                    recipientAllergies={form.recipientAllergies}
                    recipientConditions={form.recipientConditions}
                    referenceDate={form.prescriptionDate}
                    medicines={form.items.map((item: Line) => products.find((product) => product.id === Number(item.productId))).filter(Boolean)}
                  />
                </div>
                <div>
                  <label className="form-label">Prescriber title and name</label>
                  <div className="input-group">
                    <select
                      className="form-select prescriber-title-select"
                      aria-label="Prescriber title"
                      value={form.prescriberTitle}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          prescriberTitle: event.target.value,
                        })
                      }
                    >
                      <option value="">No title</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Rev.">Rev.</option>
                    </select>
                    <input
                      className="form-control"
                      list="prescriber-options"
                      value={form.prescriberName}
                      {...personNameInputProps((prescriberName) => setForm({ ...form, prescriberName }))}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          prescriberName: event.target.value,
                        })
                      }
                      placeholder="Prescriber name"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setForm({
                          ...form,
                          prescriberTitle: "",
                          prescriberName: "Not Mentioned",
                        })
                      }
                    >
                      Not mentioned
                    </button>
                  </div>
                  <datalist id="prescriber-options">
                    {[...new Set(rows.map((row) => row.prescriberName))].map(
                      (name) => (
                        <option key={name} value={name} />
                      ),
                    )}
                  </datalist>
                </div>
                <div>
                  <label className="form-label">Prescriber reference</label>
                  <input
                    className="form-control"
                    value={form.prescriberReference}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        prescriberReference: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="full">
                  <label className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.orderedForSelf}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          orderedForSelf: event.target.checked,
                        })
                      }
                    />{" "}
                    <span className="form-check-label">
                      The patient is ordering these medicines for themselves
                    </span>
                  </label>
                </div>
                {!form.orderedForSelf && (
                  <div className="full border rounded-3 p-3 bg-light-subtle">
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                      <span className="fw-semibold small text-primary d-flex align-items-center gap-1">
                        <i className="bi bi-person-heart" />
                        Recipient Information &amp; Clinical Safety
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary small">
                        Third-party recipient
                      </span>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-md-5">
                        <label className="form-label small mb-1">
                          Recipient name <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          value={form.recipientName}
                          {...personNameInputProps((recipientName) => setForm({ ...form, recipientName }))}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              recipientName: event.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">
                          Relationship to patient <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={form.recipientRelationship}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              recipientRelationship: event.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select relationship</option>
                          <option>Child</option>
                          <option>Parent</option>
                          <option>Spouse</option>
                          <option>Sibling</option>
                          <option>Relative</option>
                          <option>Carer</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small mb-1">
                          Recipient age <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={130}
                            step={1}
                            placeholder="Age"
                            value={ageFromDob(form.recipientDateOfBirth)}
                            onChange={(event) =>
                              setForm({
                                ...form,
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

                    <div className="row g-2">
                      <div className="col-md-6">
                        <label className="form-label small mb-1 text-danger-emphasis d-flex align-items-center gap-1">
                          <i className="bi bi-shield-exclamation text-danger" />
                          Recipient allergies
                        </label>
                        <input
                          className="form-control"
                          value={form.recipientAllergies || ""}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              recipientAllergies: event.target.value,
                            })
                          }
                          placeholder="e.g. Penicillin, Aspirin, or None"
                        />
                        <small className="text-secondary d-block mt-1">
                          Pharmacist review required. No automated allergy check was performed.
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small mb-1 text-warning-emphasis d-flex align-items-center gap-1">
                          <i className="bi bi-heart-pulse text-warning" />
                          Recipient chronic illnesses / conditions
                        </label>
                        <input
                          className="form-control"
                          value={form.recipientConditions || ""}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              recipientConditions: event.target.value,
                            })
                          }
                          placeholder="e.g. Asthma, Diabetes, Hypertension, or None"
                        />
                        <small className="text-secondary d-block mt-1">
                          Pharmacist review required. No automated interaction check was performed.
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h4 className="fs-6 mt-4">Medicine items</h4>
              {form.items.map((item: Line, index: number) => {
                const auto = calculated(item);
                const liquid = isLiquid(auto.product);
                return (
                  <div className="border rounded-3 p-2 mb-3" key={index}>
                    <div className="row g-2">
                    <div className="col-md-5">
                      <label className="form-label small">Medicine</label>
                      <SearchableSelect
                        options={products
                          .filter(
                            (product) =>
                              product.active &&
                              product.productType !== "NON_MEDICINAL",
                          )
                          .map((product) => ({
                            value: product.id,
                            label: `${product.genericName} ${product.strength}`,
                            description: `${product.brandName || "Generic"} · ${product.dosageForm} · ${product.sku}`,
                          }))}
                        value={item.productId}
                        onChange={(productId) =>
                          selectMedicine(index, Number(productId))
                        }
                        onQueryChange={searchMedicines}
                        placeholder="Search name, brand, strength or SKU"
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">
                        {liquid ? "mL each time" : "Dose each time"}
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        list={liquid ? undefined : "solid-dose-options"}
                        step={liquid ? "0.1" : "0.25"}
                        min={liquid ? "0.1" : "0.25"}
                        value={
                          liquid && item.liquidDoseMode === "STRENGTH"
                            ? auto.dose
                            : item.quantityPerDose
                        }
                        readOnly={liquid && item.liquidDoseMode === "STRENGTH"}
                        onChange={(event) =>
                          updateLine(index, {
                            quantityPerDose: event.target.value,
                            doseInputAmount: liquid
                              ? event.target.value
                              : item.doseInputAmount,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">
                        {item.asNeeded ? "Maximum/day" : "Frequency"}
                      </label>
                      <select
                        className="form-select"
                        value={item.timesPerDay}
                        onChange={(event) =>
                          updateLine(index, { timesPerDay: event.target.value })
                        }
                      >
                        <option value="1">Once daily</option>
                        <option value="2">Twice daily</option>
                        <option value="3">Three times daily</option>
                        <option value="4">Four times daily</option>
                        <option value="6">Every 4 hours</option>
                        <option value="8">Every 3 hours</option>
                        <option value="12">Every 2 hours</option>
                        <option value="24">Every hour</option>
                      </select>
                    </div>
                    <div className="col-md-1">
                      <label className="form-label small">Days</label>
                      <input
                        className="form-control"
                        type="number"
                        min="1"
                        value={item.daysSupply}
                        onChange={(event) =>
                          updateLine(index, { daysSupply: event.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">Auto total</label>
                      <div className="form-control bg-light">
                        {auto.total} {auto.product?.unit || "units"}
                      </div>
                    </div>
                    {liquid && (
                      <div className="col-12">
                        <div className="liquid-dose-card">
                          <div className="liquid-dose-header">
                            <div>
                              <strong>Liquid dose calculator</strong>
                              <small>
                                Enter the prescribed volume directly, or
                                calculate mL from the medicine concentration.
                              </small>
                            </div>
                            <select
                              className="form-select"
                              value={item.liquidDoseMode}
                              onChange={(event) => {
                                const mode = event.target
                                  .value as Line["liquidDoseMode"];
                                updateLine(
                                  index,
                                  mode === "VOLUME"
                                    ? {
                                        liquidDoseMode: mode,
                                        quantityPerDose: auto.dose || 1,
                                        doseInputAmount: auto.dose || 1,
                                        doseInputUnit: "ml",
                                      }
                                    : { liquidDoseMode: mode },
                                );
                              }}
                            >
                              <option value="VOLUME">Dose written in mL</option>
                              <option value="STRENGTH">
                                Dose written in mg/mcg/g
                              </option>
                            </select>
                          </div>
                          {item.liquidDoseMode === "STRENGTH" ? (
                            <div className="liquid-dose-grid">
                              <div>
                                <label className="form-label small">
                                  Prescribed amount
                                </label>
                                <input
                                  className="form-control"
                                  type="number"
                                  min="0.001"
                                  step="0.001"
                                  value={item.doseInputAmount}
                                  onChange={(event) =>
                                    updateLine(index, {
                                      doseInputAmount: event.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <label className="form-label small">
                                  Dose unit
                                </label>
                                <select
                                  className="form-select"
                                  value={item.doseInputUnit}
                                  onChange={(event) =>
                                    updateLine(index, {
                                      doseInputUnit: event.target.value,
                                    })
                                  }
                                >
                                  <option value="mcg">mcg</option>
                                  <option value="mg">mg</option>
                                  <option value="g">g</option>
                                </select>
                              </div>
                              <div>
                                <label className="form-label small">
                                  Medicine contains
                                </label>
                                <input
                                  className="form-control"
                                  type="number"
                                  min="0.001"
                                  step="0.001"
                                  value={item.concentrationAmount}
                                  onChange={(event) =>
                                    updateLine(index, {
                                      concentrationAmount: event.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <label className="form-label small">
                                  Strength unit
                                </label>
                                <select
                                  className="form-select"
                                  value={item.concentrationUnit}
                                  onChange={(event) =>
                                    updateLine(index, {
                                      concentrationUnit: event.target.value,
                                    })
                                  }
                                >
                                  <option value="mcg">mcg</option>
                                  <option value="mg">mg</option>
                                  <option value="g">g</option>
                                </select>
                              </div>
                              <div>
                                <label className="form-label small">
                                  In this volume
                                </label>
                                <div className="input-group">
                                  <input
                                    className="form-control"
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    value={item.concentrationVolume}
                                    onChange={(event) =>
                                      updateLine(index, {
                                        concentrationVolume: event.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <span className="input-group-text">mL</span>
                                </div>
                              </div>
                              <div className="liquid-dose-result">
                                <small>Give each time</small>
                                <strong>
                                  {auto.dose
                                    ? `${cleanNumber(auto.dose)} mL`
                                    : "Enter dose and concentration"}
                                </strong>
                                <span>Total: {auto.total} mL</span>
                              </div>
                            </div>
                          ) : (
                            <div className="liquid-volume-note">
                              <i className="bi bi-droplet-half" />
                              <span>
                                Enter the number of mL for each dose in the
                                field above. Total volume is calculated from
                                frequency and days.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {auto.product?.storageInstructions && (
                      <div className="col-12">
                        <div className="alert alert-info py-2 mb-0 small">
                          <i className="bi bi-thermometer-snow me-2" />
                          <strong>Storage:</strong>{" "}
                          {auto.product.storageInstructions}
                        </div>
                      </div>
                    )}
                    <div className="col-md-3">
                      <label className="form-label small">
                        Administration route
                      </label>
                      <select
                        className="form-select"
                        value={item.administrationRoute}
                        onChange={(event) =>
                          updateLine(index, {
                            administrationRoute: event.target.value,
                          })
                        }
                      >
                        <option>Oral</option>
                        <option>Topical</option>
                        <option>Inhalation</option>
                        <option>Ophthalmic</option>
                        <option>Otic</option>
                        <option>Nasal</option>
                        <option>Rectal</option>
                        <option>Vaginal</option>
                        <option>Subcutaneous</option>
                        <option>Intramuscular</option>
                        <option>Intravenous</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Food timing</label>
                      <select
                        className="form-select"
                        value={item.mealTiming}
                        onChange={(event) =>
                          updateLine(index, { mealTiming: event.target.value })
                        }
                      >
                        <option value="ANY_TIME">Any time</option>
                        <option value="BEFORE_FOOD">Before food</option>
                        <option value="WITH_FOOD">With food</option>
                        <option value="AFTER_FOOD">After food</option>
                        <option value="EMPTY_STOMACH">
                          On an empty stomach
                        </option>
                      </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end pb-2">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.asNeeded}
                          onChange={(event) =>
                            updateLine(index, {
                              asNeeded: event.target.checked,
                            })
                          }
                        />{" "}
                        <span className="form-check-label">
                          Take only when required (PRN)
                        </span>
                      </label>
                    </div>
                    <div className="col-md-3 d-flex align-items-end pb-2">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.overrideEnabled}
                          onChange={(event) =>
                            updateLine(index, {
                              overrideEnabled: event.target.checked,
                              overrideQuantity: event.target.checked
                                ? auto.total
                                : "",
                            })
                          }
                        />{" "}
                        <span className="form-check-label">
                          Override calculated total
                        </span>
                      </label>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">
                        Special instructions
                      </label>
                      <input
                        className="form-control"
                        list="instruction-options"
                        value={item.specialInstructions}
                        onChange={(event) =>
                          updateLine(index, {
                            specialInstructions: event.target.value,
                          })
                        }
                        placeholder="For example: shake well before use"
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small">
                        Label directions
                      </label>
                      <textarea
                        className="form-control"
                        value={
                          item.dosageInstructions || generatedDirections(item)
                        }
                        onChange={(event) =>
                          updateLine(index, {
                            dosageInstructions: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-1 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        disabled={form.items.length === 1}
                        onClick={() =>
                          setForm({
                            ...form,
                            items: form.items.filter(
                              (_: Line, itemIndex: number) =>
                                itemIndex !== index,
                            ),
                          })
                        }
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                    {item.overrideEnabled && (
                      <>
                        <div className="col-md-3">
                          <label className="form-label small">
                            Override total
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            min={isCountableUnit(auto.product?.unit) ? "1" : "0.1"}
                            step={isCountableUnit(auto.product?.unit) ? "1" : "0.1"}
                            value={item.overrideQuantity}
                            onChange={(event) =>
                              updateLine(index, {
                                overrideQuantity: event.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-9">
                          <label className="form-label small">
                            Clinical override reason
                          </label>
                          <input
                            className="form-control"
                            value={item.overrideReason}
                            onChange={(event) =>
                              updateLine(index, {
                                overrideReason: event.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </>
                    )}
                    </div>
                  </div>
                );
              })}
              <datalist id="solid-dose-options">
                <option value="0.25" label="¼ tablet" />
                <option value="0.5" label="½ tablet" />
                <option value="0.75" label="¾ tablet" />
                <option value="1" label="1 tablet" />
                <option value="1.5" label="1½ tablets" />
                <option value="2" label="2 tablets" />
              </datalist>
              <datalist id="instruction-options">
                <option value="Shake well before use" />
                <option value="Swallow whole; do not crush or chew" />
                <option value="Complete the full course" />
                <option value="Avoid alcohol" />
                <option value="May cause drowsiness; avoid driving" />
                <option value="Rinse mouth after use" />
                <option value="Apply a thin layer to the affected area" />
              </datalist>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setForm({ ...form, items: [...form.items, line()] })
                  }
                >
                  + Add medicine
                </button>
              </div>
              {/* Bug #9: Estimated price preview computed from catalogue selling prices */}
              {form.items.some((item: any) => item.productId) && (() => {
                const priceLines = form.items
                  .map((item: any) => {
                    const product = products.find((p: any) => p.id === Number(item.productId));
                    if (!product || !product.sellingPrice) return null;
                    const qty = item.overrideEnabled && item.overrideQuantity
                      ? Number(item.overrideQuantity)
                      : calculated(item).total || 0;
                    const lineTotal = Number(product.sellingPrice) * qty;
                    return { name: `${product.genericName} ${product.strength}`.trim(), unit: product.unit, qty, unitPrice: Number(product.sellingPrice), lineTotal };
                  })
                  .filter(Boolean);
                const retailLines = form.retailItems
                  .map((item: any) => {
                    const product = products.find((p: any) => p.id === Number(item.productId));
                    if (!product || !product.sellingPrice) return null;
                    const lineTotal = Number(product.sellingPrice) * Number(item.quantity);
                    return { name: `${product.genericName}`.trim(), unit: product.unit, qty: Number(item.quantity), unitPrice: Number(product.sellingPrice), lineTotal };
                  })
                  .filter(Boolean);
                const allLines = [...priceLines, ...retailLines];
                if (!allLines.length) return null;
                const subtotal = allLines.reduce((sum, l: any) => sum + l.lineTotal, 0);
                return (
                  <div className="alert alert-light border mt-3 p-2 small">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-calculator text-secondary" />
                      <strong className="text-secondary">Estimated price preview</strong>
                      <small className="text-muted ms-auto">Based on current catalogue prices. Final amount set at cashier.</small>
                    </div>
                    <table className="table table-sm mb-1">
                      <tbody>
                        {allLines.map((l: any, i: number) => (
                          <tr key={i}>
                            <td className="text-secondary">{l.name}</td>
                            <td className="text-secondary">{l.qty} {l.unit}</td>
                            <td className="text-secondary text-end">{money(l.unitPrice)} / {l.unit}</td>
                            <td className="fw-semibold text-end">{money(l.lineTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-top">
                          <td colSpan={3} className="text-end fw-bold">Estimated subtotal</td>
                          <td className="fw-bold text-primary text-end">{money(subtotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                );
              })()}
              <section className="prescription-retail-request">
                <div className="prescription-retail-heading">
                  <div>
                    <span className="prescription-retail-icon">
                      <i className="bi bi-bag-plus" />
                    </span>
                    <span>
                      <strong>Retail items for the same invoice</strong>
                      <small>
                        Optional non-prescription products requested with this
                        prescription. They are saved now and automatically
                        prefilled during cashier billing.
                      </small>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      setForm({
                        ...form,
                        retailItems: [
                          ...form.retailItems,
                          { productId: 0, quantity: 1 },
                        ],
                      })
                    }
                  >
                    <i className="bi bi-plus-lg me-1" />
                    Add retail item
                  </button>
                </div>
                {!form.retailItems.length ? (
                  <div className="prescription-retail-empty">
                    No retail products requested. Use “Add retail item” for OTC
                    medicines, personal-care products, drinks, devices, or
                    other pharmacy goods.
                  </div>
                ) : (
                  <div className="prescription-retail-lines">
                    {form.retailItems.map(
                      (retailItem: any, retailIndex: number) => {
                        const selectedProduct = products.find(
                          (product) =>
                            product.id === Number(retailItem.productId),
                        );
                        const selectedIds = form.retailItems
                          .filter(
                            (_item: any, index: number) =>
                              index !== retailIndex,
                          )
                          .map((item: any) => Number(item.productId));
                        return (
                          <div
                            className="prescription-retail-line"
                            key={`${retailItem.productId}-${retailIndex}`}
                          >
                            <div>
                              <label className="form-label">Retail item</label>
                              <SearchableSelect
                                options={products
                                  .filter(
                                    (product) =>
                                      product.active &&
                                      !product.prescriptionRequired &&
                                      usableStock(product) > 0 &&
                                      !selectedIds.includes(
                                        Number(product.id),
                                      ),
                                  )
                                  .map((product) => ({
                                    value: product.id,
                                    label: `${product.genericName}${product.strength && product.strength !== "N/A" ? ` ${product.strength}` : ""}`,
                                    description: `${product.sku}${product.barcode ? ` · ${product.barcode}` : ""} · ${money(product.sellingPrice)} · Stock ${usableStock(product)} ${product.unit}`,
                                  }))}
                                value={retailItem.productId}
                                onChange={(productId) => {
                                  const retailItems = [...form.retailItems];
                                  retailItems[retailIndex] = {
                                    ...retailItem,
                                    productId: Number(productId),
                                    quantity: 1,
                                  };
                                  setForm({ ...form, retailItems });
                                }}
                                placeholder="Search product, SKU or barcode"
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
                                list="retail-quantity-options"
                                min={stockQuantityStep(selectedProduct?.unit)}
                                max={
                                  selectedProduct
                                    ? usableStock(selectedProduct)
                                    : undefined
                                }
                                step={stockQuantityStep(selectedProduct?.unit)}
                                value={retailItem.quantity}
                                onChange={(event) => {
                                  const retailItems = [...form.retailItems];
                                  retailItems[retailIndex] = {
                                    ...retailItem,
                                    quantity: event.target.value,
                                  };
                                  setForm({ ...form, retailItems });
                                }}
                                required
                              />
                            </div>
                            <div className="prescription-retail-price">
                              <small>Estimated line value</small>
                              <strong>
                                {selectedProduct
                                  ? money(
                                      Number(selectedProduct.sellingPrice) *
                                        Number(retailItem.quantity),
                                    )
                                  : "—"}
                              </strong>
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-icon"
                              title="Remove retail item"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  retailItems: form.retailItems.filter(
                                    (_item: any, index: number) =>
                                      index !== retailIndex,
                                  ),
                                })
                              }
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </section>
              <Alert message={error} />
              <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
                <button type="button" className="btn btn-light" onClick={closeEditor}>
                  Cancel
                </button>
                {editor.mode === "create" ? (
                  <>
                    {!form.sourceUploadId && <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={busy}
                      onClick={() => save(undefined, { autoVerify: false, sendToCashier: false })}
                    >
                      {busy ? "Saving..." : "Save as Draft"}
                    </button>}
                    {!form.sourceUploadId && <button
                      type="button"
                      className="btn btn-outline-primary"
                      disabled={busy}
                      onClick={() => save(undefined, { autoVerify: true, sendToCashier: false })}
                    >
                      <i className="bi bi-check-circle me-1" />
                      {busy ? "Saving..." : "Save & Verify"}
                    </button>}
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={busy}
                      onClick={() => save(undefined, { autoVerify: true, sendToCashier: true })}
                    >
                      <i className="bi bi-send-check me-1" />
                      {busy
                        ? "Processing..."
                        : form.sourceUploadStatus === "READY_TO_PREPARE"
                          ? "Save & Ready to Dispense"
                          : form.sourceUploadId
                            ? "Save, Verify & Send to Cashier"
                            : "Save, Verify & Send to Cashier"}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={busy}
                  >
                    {busy ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </Modal>
      )}

      {reverify && (
        <Modal
          title={
            reverify.verifiedAt
              ? `Reverify clinical details — ${reverify.prescriptionNumber}`
              : `Verify clinical details — ${reverify.prescriptionNumber}`
          }
          onClose={() => setReverify(null)}
          size="md"
        >
          <form onSubmit={(e) => confirmVerify(e, false)}>
            <div className="alert alert-info small">
              Double-check the clinical details below before confirming verification.
            </div>
            <PatientClinicalWarning
              patient={reverify.patient}
              recipientDateOfBirth={reverify.recipientDateOfBirth}
              thirdPartyRecipient={!reverify.orderedForSelf}
              recipientName={reverify.recipientName}
              recipientRelationship={reverify.recipientRelationship}
              recipientAllergies={reverify.recipientAllergies}
              recipientConditions={reverify.recipientConditions}
              referenceDate={reverify.prescriptionDate}
              medicines={reverify.items.map((item: any) => item.product)}
            />
            <ul className="list-unstyled small mb-0">
              {reverify.items.map((item: any) => (
                <li key={item.id} className="mb-1">
                  <strong>
                    {item.product.genericName} {item.product.strength}
                  </strong>{" "}
                  — {item.dosageInstructions}
                </li>
              ))}
            </ul>
            <Alert message={error} />
            <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setReverify(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={busy}
                onClick={(e) => confirmVerify(e, false)}
              >
                {busy ? "Verifying..." : "Verify only"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={(e) => confirmVerify(e, true)}
              >
                <i className="bi bi-send-check me-1" />
                {busy ? "Processing..." : "Review bill & send to cashier"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {action?.type === "reject" && (
        <Modal
          title={`Reject ${action.rx.prescriptionNumber}`}
          onClose={() => setAction(null)}
          size="sm"
        >
          <form onSubmit={saveAction}>
            <label className="form-label">Mandatory rejection reason</label>
            <textarea
              className="form-control"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setAction(null)}
              submitLabel="Reject prescription"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {action?.type === "withdraw" && (
        <Modal
          title={`Withdraw bill · ${action.rx.prescriptionNumber}`}
          onClose={() => setAction(null)}
          size="sm"
        >
          <form onSubmit={saveAction}>
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2" />
              This pulls {action.rx.paymentRequest?.requestNumber} back from the
              cashier so it can no longer be paid. The prescription stays
              verified. Next, the editor opens for corrections. Clinical changes need
              pharmacist review; the replacement invoice needs fresh customer approval.
            </div>
            <label className="form-label">Mandatory reason</label>
            <textarea
              className="form-control"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setAction(null)}
              submitLabel="Withdraw & edit prescription"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {action?.type === "dispense" && (
        <Modal
          title={
            action.rx.paymentRequest?.status === "PAID"
              ? `Dispense Prescription · ${action.rx.prescriptionNumber}`
              : action.rx.paymentRequest?.status === "AWAITING_PAYMENT"
                ? `Update Cashier Invoice · ${action.rx.prescriptionNumber}`
                : `Prepare Cashier Invoice · ${action.rx.prescriptionNumber}`
          }
          onClose={closeAction}
          size={action.rx.sourceUpload ? "xl" : "lg"}
        >
          <div
            className={
              action.rx.sourceUpload ? "prescription-editor-split" : ""
            }
          >
            {action.rx.sourceUpload && (
              <aside className="prescription-source-pane">
                <UploadAttachmentSelector uploadId={action.rx.sourceUpload.id} onLoad={loadSourceAttachment} />
                <div className="document-viewer-toolbar">
                  <strong>Customer-submitted prescription</strong>
                  <div className="btn-group btn-group-sm" aria-label="Document size">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight((height) => Math.max(320, height - 140))} title="Make viewer shorter"><i className="bi bi-dash-lg" /></button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight(620)}>Fit</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setSourceViewerHeight((height) => Math.min(1000, height + 140))} title="Make viewer taller"><i className="bi bi-plus-lg" /></button>
                    {sourceFileUrl && <button type="button" className="btn btn-outline-secondary" onClick={() => window.open(sourceFileUrl, "_blank", "noopener,noreferrer")} title="Open full size"><i className="bi bi-arrows-fullscreen" /></button>}
                  </div>
                </div>
                <small className="d-block text-secondary mb-2">
                  Visible while calculating the cashier request and confirming
                  dispensing.
                </small>
                {sourceFileText ? (
                  <pre className="prescription-text-viewer" style={{ height: sourceViewerHeight }}>{sourceFileText}</pre>
                ) : sourceFileUrl ? (
                  <iframe
                    src={sourceFileUrl}
                    title="Customer submitted prescription"
                    style={{ height: sourceViewerHeight }}
                  />
                ) : (
                  <div className="loading">Loading prescription…</div>
                )}
              </aside>
            )}
            <form onSubmit={saveAction} className="prescription-editor-form">
              <div className="alert alert-primary small">
                <i className="bi bi-shield-lock me-2" />
                <strong>One combined checkout.</strong> Confirm the prescribed
                medicines, add any non-prescription retail products requested
                by the customer, then send one total to the cashier.{" "}
                {operationSettings.cashierCanDispenseAtPayment
                  ? "The cashier hands the medicine over as soon as it is paid for."
                  : operationSettings.requirePickupPin
                    ? "Dispensing remains locked until payment and PIN verification."
                    : "Dispensing remains locked until the cashier takes payment."}
              </div>
              <PatientClinicalWarning
                patient={patients.find((p) => p.id === action.rx.patient.id)}
                recipientDateOfBirth={action.rx.orderedForSelf ? undefined : action.rx.recipientDateOfBirth}
                thirdPartyRecipient={!action.rx.orderedForSelf}
                recipientName={action.rx.recipientName}
                recipientRelationship={action.rx.recipientRelationship}
                recipientAllergies={action.rx.recipientAllergies}
                recipientConditions={action.rx.recipientConditions}
                referenceDate={action.rx.prescriptionDate}
                medicines={action.rx.items.map((item) => item.product)}
              />
              <div className="workflow-section-heading">
                <span className="workflow-step">1</span>
                <div>
                  <strong>Prescription medicines</strong>
                  <small>Confirm the quantities being issued now.</small>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Maximum remaining</th>
                      <th>Issue now</th>
                      <th>Unit price</th>
                      <th>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispense.items.map((item: any, index: number) => (
                      <tr key={item.prescriptionItemId}>
                        <td>{item.name}</td>
                        <td>
                          {item.maximum} {item.unit}
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            step={stockQuantityStep(item.unit)}
                            min={stockQuantityStep(item.unit)}
                            max={item.maximum}
                            value={item.quantity}
                            disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                            onChange={(event) => {
                              const items = [...dispense.items];
                              items[index] = {
                                ...item,
                                quantity: event.target.value,
                              };
                              setDispense({ ...dispense, items });
                            }}
                          />
                        </td>
                        <td>
                          {quote
                            ? money(
                                quote.lines.find(
                                  (line: any) =>
                                    line.prescriptionItemId ===
                                    item.prescriptionItemId,
                                )?.unitPrice,
                              )
                            : "—"}
                        </td>
                        <td>
                          <strong>
                            {quote
                              ? money(
                                  quote.lines.find(
                                    (line: any) =>
                                      line.prescriptionItemId ===
                                      item.prescriptionItemId,
                                  )?.lineTotal,
                                )
                              : quoteBusy
                                ? "Calculating…"
                                : "—"}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <section className="combined-retail-panel">
                <div className="combined-retail-header">
                  <div className="workflow-section-heading mb-0">
                    <span className="workflow-step">2</span>
                    <div>
                      <strong>Add retail items to this invoice</strong>
                      <small>
                        Optional OTC medicines and pharmacy goods will appear
                        on the same cashier receipt and final invoice.
                      </small>
                    </div>
                  </div>
                  {!action.rx.paymentRequest && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        setDispense({
                          ...dispense,
                          retailItems: [
                            ...dispense.retailItems,
                            { productId: 0, quantity: 1 },
                          ],
                        })
                      }
                    >
                      <i className="bi bi-plus-lg me-1" />
                      Add retail item
                    </button>
                  )}
                </div>
                {!dispense.retailItems.length ? (
                  <div className="combined-retail-empty">
                    <i className="bi bi-bag-plus" />
                    <span>
                      No retail goods added. This invoice currently contains
                      prescription medicines only.
                    </span>
                  </div>
                ) : (
                  <div className="combined-retail-lines">
                    {dispense.retailItems.map(
                      (retailItem: any, index: number) => {
                        const product = products.find(
                          (candidate) =>
                            candidate.id === Number(retailItem.productId),
                        );
                        const quoteLine = quote?.lines.find(
                          (line: any) =>
                            line.source === "RETAIL" &&
                            line.productId === Number(retailItem.productId),
                        );
                        const available = usableStock(product);
                        return (
                          <div
                            className="combined-retail-line"
                            key={`${retailItem.productId}-${index}`}
                          >
                            <div className="retail-product-field">
                              <label className="form-label">Retail item</label>
                              {action.rx.paymentRequest ? (
                                <div className="locked-field">
                                  <strong>
                                    {retailItem.name ||
                                      product?.genericName ||
                                      "Retail item"}
                                  </strong>
                                  <small>
                                    Included in paid cashier request
                                  </small>
                                </div>
                              ) : (
                                <SearchableSelect
                                  options={retailProductOptions.filter(
                                    (option) =>
                                      String(option.value) ===
                                        String(retailItem.productId) ||
                                      !dispense.retailItems.some(
                                        (selected: any, selectedIndex: number) =>
                                          selectedIndex !== index &&
                                          String(selected.productId) ===
                                            String(option.value),
                                      ),
                                  )}
                                  value={retailItem.productId}
                                  onChange={(productId) => {
                                    const selectedProduct = products.find(
                                      (candidate) =>
                                        candidate.id === Number(productId),
                                    );
                                    const retailItems = [
                                      ...dispense.retailItems,
                                    ];
                                    retailItems[index] = {
                                      ...retailItem,
                                      productId: Number(productId),
                                      name: selectedProduct?.genericName,
                                      unit: selectedProduct?.unit,
                                      dosageForm:
                                        selectedProduct?.dosageForm,
                                      quantity: 1,
                                    };
                                    setDispense({
                                      ...dispense,
                                      retailItems,
                                    });
                                  }}
                                  placeholder="Search by item, SKU or barcode"
                                  required
                                />
                              )}
                            </div>
                            <div>
                              <label className="form-label">Quantity</label>
                              <input
                                className="form-control"
                                type="number"
                                list="retail-quantity-options"
                                min={stockQuantityStep(product?.unit)}
                                max={available || undefined}
                                step={stockQuantityStep(product?.unit)}
                                disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                                value={retailItem.quantity}
                                onChange={(event) => {
                                  const retailItems = [
                                    ...dispense.retailItems,
                                  ];
                                  retailItems[index] = {
                                    ...retailItem,
                                    quantity: event.target.value,
                                  };
                                  setDispense({ ...dispense, retailItems });
                                }}
                              />
                              {product && (
                                <small className="field-hint">
                                  {available} {product.unit} available
                                </small>
                              )}
                            </div>
                            <div className="retail-line-value">
                              <small>Unit price</small>
                              <strong>
                                {quoteLine
                                  ? money(quoteLine.unitPrice)
                                  : product
                                    ? money(product.sellingPrice)
                                    : "—"}
                              </strong>
                            </div>
                            <div className="retail-line-value">
                              <small>Line total</small>
                              <strong>
                                {quoteLine
                                  ? money(quoteLine.lineTotal)
                                  : quoteBusy
                                    ? "Calculating…"
                                    : "—"}
                              </strong>
                            </div>
                            {!action.rx.paymentRequest && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-icon retail-remove"
                                title="Remove retail item"
                                onClick={() =>
                                  setDispense({
                                    ...dispense,
                                    retailItems:
                                      dispense.retailItems.filter(
                                        (_: any, itemIndex: number) =>
                                          itemIndex !== index,
                                      ),
                                  })
                                }
                              >
                                <i className="bi bi-trash" />
                              </button>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
                {action.rx.paymentRequest && (
                  <small className="text-secondary d-block mt-2">
                    Invoice items are locked after the request is sent to the
                    cashier.
                  </small>
                )}
              </section>
              <div
                className={`bottle-fee-panel ${!dispenseHasLiquid ? "bottle-fee-disabled" : ""}`}
              >
                  <div className="bottle-fee-prompt">
                    <div>
                      <i className="bi bi-droplet-half" />
                      <span>
                        <strong>Liquid medicine container</strong>
                        <small>
                          Should a bottle or dispensing-container fee be added?
                        </small>
                      </span>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                          dispenseHasLiquid &&
                          Boolean(dispense.addBottleFee)
                        }
                        disabled={
                          (Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)) ||
                          !dispenseHasLiquid
                        }
                        onChange={(event) =>
                          updateDispenseBottleFee(
                            Number(dispense.bottleCount || 1),
                            Number(dispense.bottleFeePerBottle || 0),
                            event.target.checked,
                          )
                        }
                      />
                    </div>
                  </div>
                  {!dispenseHasLiquid && (
                    <small className="bottle-fee-help">
                      Select or issue a liquid medicine to enable this fee.
                    </small>
                  )}
                  {dispenseHasLiquid && dispense.addBottleFee && (
                    <div className="bottle-fee-fields">
                      <div>
                        <label className="form-label">Number of bottles</label>
                        <input
                          className="form-control"
                          type="number"
                          min="1"
                          step="1"
                          disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                          value={dispense.bottleCount}
                          onChange={(event) =>
                            updateDispenseBottleFee(
                              Math.max(1, Number(event.target.value)),
                              Number(dispense.bottleFeePerBottle || 0),
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
                            disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                            value={dispense.bottleFeePerBottle}
                            onChange={(event) =>
                              updateDispenseBottleFee(
                                Number(dispense.bottleCount || 1),
                                Math.max(0, Number(event.target.value)),
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="bottle-fee-summary">
                        <small>Total bottle fee</small>
                        <strong>{money(dispense.containerFee)}</strong>
                      </div>
                    </div>
                  )}
                  {action.rx.paymentRequest && (
                    <small className="text-secondary d-block mt-2">
                      Bottle fees are locked after the request is sent to the
                      cashier.
                    </small>
                  )}
              </div>
              <div className="alert alert-info small">
                Eligible administrator-configured discounts are calculated
                securely by the server. Enter a coupon only when the patient has
                one.
              </div>
              <div className="form-grid">
                <div>
                  <label className="form-label">Coupon code (optional)</label>
                  <input
                    className="form-control text-uppercase"
                    value={dispense.couponCode}
                    disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                    onChange={(event) =>
                      setDispense({
                        ...dispense,
                        couponCode: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Tax</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={dispense.tax}
                    disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                    onChange={(event) =>
                      setDispense({
                        ...dispense,
                        tax: Number(event.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Cash stock reservation</label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      max="168"
                      step="1"
                      value={dispense.reservationHours}
                      disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                      onChange={(event) => setDispense({ ...dispense, reservationHours: Number(event.target.value) })}
                      required
                    />
                    <span className="input-group-text">hours</span>
                  </div>
                  <small className="text-secondary">Used only if the customer acknowledges the invoice and chooses cash. The administrator default is {operationSettings.cashReservationHours || 24} hours.</small>
                </div>
                <div>
                  <label className="form-label">Note to customer (optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    value={dispense.notes}
                    disabled={Boolean(action.rx.paymentRequest) && !["AWAITING_PAYMENT", "CANCELLED"].includes(action.rx.paymentRequest.status)}
                    onChange={(event) => setDispense({ ...dispense, notes: event.target.value })}
                    placeholder="Collection instructions or information about this final invoice"
                  />
                </div>
                {action.rx.paymentRequest?.status === "AWAITING_PAYMENT" && (
                  <div>
                    <label className="form-label">Reason for invoice changes</label>
                    <textarea className="form-control" rows={2} maxLength={500}
                      value={dispense.revisionReason}
                      onChange={(event) => setDispense({ ...dispense, revisionReason: event.target.value })}
                      placeholder="Explain changes to items or charges for the customer" />
                    <small className="text-secondary">Required when items or charges change. Note-only saves keep the customer's approval.</small>
                  </div>
                )}
                {action.rx.paymentRequest?.customerNote && (
                  <div className="alert alert-info"><strong>Customer note: </strong>{action.rx.paymentRequest.customerNote}</div>
                )}
              </div>
              {quoteError && (
                <div className="alert alert-danger mt-3 mb-0">{quoteError}</div>
              )}
              {quoteBusy && !quote && (
                <div className="invoice-preview-loading">
                  <span className="spinner-border spinner-border-sm" />{" "}
                  Calculating invoice…
                </div>
              )}
              {quote && (
                <div className="invoice-preview mt-3">
                  <div className="invoice-preview-title">
                    <div>
                      <strong>Invoice preview</strong>
                      <small>
                        One total for prescription medicines, optional retail
                        goods, discounts, fees, and tax
                      </small>
                    </div>
                  </div>
                  <div className="invoice-preview-row">
                    <span>Subtotal</span>
                    <strong>{money(quote.subtotal)}</strong>
                  </div>
                  {Number(quote.discount) > 0 && (
                    <>
                      <div className="invoice-preview-row discount">
                        <span>Discount</span>
                        <strong>− {money(quote.discount)}</strong>
                      </div>
                      <div className="invoice-discounts">
                        {(quote.appliedDiscounts || []).map(
                          (rule: any, index: number) => (
                            <span key={`${rule.ruleId}-${index}`}>
                              {rule.ruleName}: −{money(rule.amount)}
                            </span>
                          ),
                        )}
                      </div>
                    </>
                  )}
                  <div className="invoice-preview-row">
                    <span>Bottle / container fee</span>
                    <strong>{money(quote.containerFee)}</strong>
                  </div>
                  <div className="invoice-preview-row">
                    <span>Tax</span>
                    <strong>{money(quote.tax)}</strong>
                  </div>
                  <div className="invoice-preview-row total">
                    <span>Total to collect</span>
                    <strong>{money(quote.total)}</strong>
                  </div>
                  <div className="invoice-payment-grid">
                    <div>
                      <small>Cashier must collect</small>
                      <strong>{money(quote.total)}</strong>
                    </div>
                    <div>
                      <small>Next step</small>
                      <strong>Send cashier request</strong>
                    </div>
                  </div>
                </div>
              )}
              <Alert message={error} />
              {action.rx.paymentRequest?.status === "CANCELLED" && (
                <div className="alert alert-danger mt-3">
                  <strong>This bill was cancelled.</strong>
                  <small className="d-block">
                    {action.rx.paymentRequest.requestNumber}
                    {action.rx.paymentRequest.cancellationReason
                      ? ` · Reason: ${action.rx.paymentRequest.cancellationReason}`
                      : ""}
                  </small>
                  <small className="d-block">
                    The prescription itself is still verified. Sending it to
                    the cashier again starts a new billing cycle with a new
                    request number
                    {operationSettings.requirePickupPin ? " and PIN" : ""}.
                  </small>
                </div>
              )}
              {(!action.rx.paymentRequest ||
                ["AWAITING_PAYMENT", "CANCELLED", "FULFILLED"].includes(
                  action.rx.paymentRequest.status,
                )) && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={closeAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={busy || quoteBusy || !quote || !!quoteError}
                    onClick={
                      action.rx.paymentRequest?.status === "AWAITING_PAYMENT"
                        ? updateCashierBill
                        : sendToCashier
                    }
                  >
                    <i className="bi bi-send me-2" />
                    {action.rx.paymentRequest?.status === "AWAITING_PAYMENT"
                      ? "Update bill sent to cashier"
                      : action.rx.paymentRequest?.status === "CANCELLED"
                        ? "Resend to cashier"
                        : action.rx.paymentRequest?.status === "FULFILLED"
                          ? "Send remainder invoice to cashier"
                          : "Send combined invoice to cashier"}
                  </button>
                </div>
              )}
              {action.rx.paymentRequest?.status === "AWAITING_PAYMENT" && (
                <div className="alert alert-warning mt-3">
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div>
                      <strong>Awaiting cashier payment</strong>
                      <small className="d-block">
                        {action.rx.paymentRequest.requestNumber} ·{" "}
                        {money(action.rx.paymentRequest.total)}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openPaymentPdf(action.rx.paymentRequest)}
                    >
                      <i className="bi bi-printer me-1" />
                      Cashier slip
                    </button>
                  </div>
                </div>
              )}
              {action.rx.paymentRequest?.status === "PAID" && (
                <div className="alert alert-success mt-3">
                  <strong>Cashier payment confirmed.</strong>
                  <div className="row align-items-end mt-2">
                    {operationSettings.requirePickupPin && (
                      <div className="col-md-7">
                        <label className="form-label">
                          Six-digit PIN from customer receipt
                        </label>
                        <input
                          className="form-control form-control-lg text-center"
                          inputMode="numeric"
                          maxLength={6}
                          pattern="[0-9]{6}"
                          value={dispense.pickupPin || ""}
                          onChange={(event) =>
                            setDispense({
                              ...dispense,
                              pickupPin: event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6),
                              paymentRequestId: action.rx.paymentRequest.id,
                            })
                          }
                          placeholder="______"
                          required
                        />
                      </div>
                    )}
                    {!operationSettings.requirePickupPin && (
                      <div className="col-md-7">
                        <small className="text-secondary">
                          PIN verification is turned off for this pharmacy —
                          confirm with the patient and dispense directly.
                        </small>
                      </div>
                    )}
                    <div className="col-md-5">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={() =>
                          openPaymentPdf(action.rx.paymentRequest, "receipt")
                        }
                      >
                        <i className="bi bi-receipt me-1" />
                        View paid receipt
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {action.rx.paymentRequest?.status === "PAID" && (
                <ModalActions
                  onClose={closeAction}
                  submitLabel={
                    operationSettings.requirePickupPin
                      ? "Verify PIN and dispense"
                      : "Dispense"
                  }
                  busy={
                    busy ||
                    quoteBusy ||
                    !quote ||
                    !!quoteError ||
                    (operationSettings.requirePickupPin &&
                      Boolean((dispense.pickupPin || "").length !== 6))
                  }
                  busyLabel={busy ? "Dispensing…" : "Calculating…"}
                />
              )}
            </form>
          </div>
        </Modal>
      )}
      {action?.type === "history" && (
        <Modal
          title={`Issue history — ${action.rx.prescriptionNumber}`}
          onClose={() => setAction(null)}
          size="lg"
        >
          {action.rx.dispensings.map((issue) => (
            <div className="border rounded-3 p-3 mb-3" key={issue.id}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{issue.pharmacist.fullName}</strong>
                  <br />
                  <small>{issue.pharmacist.email}</small>
                </div>
                <div className="text-end d-flex flex-column align-items-end gap-1">
                  <strong>
                    {new Date(issue.dispensedAt).toLocaleString()}
                  </strong>
                  <small>
                    {issue.sale?.invoiceNumber || "No invoice"} ·{" "}
                    {issue.sale?.status || ""}
                  </small>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-1"
                    style={{ fontSize: '11px', minHeight: '24px', padding: '2px 8px' }}
                    onClick={() => printBagLabel(action.rx, issue)}
                  >
                    <i className="bi bi-printer me-1" />
                    Print bag label
                  </button>
                </div>
              </div>
              <ul className="mb-0 mt-2">
                {issue.items.map((item, index) => (
                  <li key={index}>
                    {item.prescriptionItem.product.genericName}: {item.quantity}{" "}
                    {item.prescriptionItem.product.unit}
                  </li>
                ))}
              </ul>
              {issue.sale && (
                <div className="d-flex flex-wrap justify-content-between gap-2 border-top pt-2 mt-2 small">
                  <span>
                    Bottle / container fee:{" "}
                    <strong>{money(issue.sale.containerFee)}</strong>
                  </span>
                  <span>
                    Invoice total: <strong>{money(issue.sale.total)}</strong>
                  </span>
                </div>
              )}
            </div>
          ))}
          {!action.rx.dispensings.length && (
            <Empty text="This prescription has not been issued yet." />
          )}
        </Modal>
      )}
      {patientModal && (
        <Modal
          title="Add patient without leaving prescription"
          onClose={() => setPatientModal(false)}
        >
          <form onSubmit={createPatient}>
            <div className="form-grid">
              <div className="full alert alert-light border mb-0">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="patient-online-access"
                    checked={patientForm.onlineAccess}
                    onChange={(event) => setPatientForm({ ...patientForm, onlineAccess: event.target.checked })}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="patient-online-access">
                    Create an online patient login
                  </label>
                </div>
                <small className="text-secondary d-block mt-1">
                  Leave this off for a walk-in or unregistered customer. Their prescription, clinical details, bill, and stock transaction remain in the pharmacy record, but they cannot sign in or receive online acknowledgements.
                </small>
              </div>
              {(
                [
                  ["fullName", "Full name", "text"],
                  ["phone", "Phone", "tel"],
                  ["dateOfBirth", "Date of birth", "date"],
                ] as const
              ).map(([key, label, type]) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    type={type}
                    inputMode={key === "phone" ? "numeric" : undefined}
                    pattern={key === "phone" ? "0[0-9]{9}" : undefined}
                    maxLength={key === "phone" ? 10 : undefined}
                    {...(key === "fullName" ? personNameInputProps((fullName) => setPatientForm((previous) => ({ ...previous, fullName }))) : {})}
                    max={key === "dateOfBirth" ? new Date().toISOString().slice(0, 10) : undefined}
                    value={patientForm[key]}
                    onChange={(event) =>
                      setPatientForm({
                        ...patientForm,
                        [key]:
                          key === "phone"
                            ? event.target.value.replace(/\D/g, "").slice(0, 10)
                            : event.target.value,
                      })
                    }
                    required
                  />
                </div>
              ))}
              {patientForm.onlineAccess && (
                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={patientForm.email}
                    onChange={(event) => setPatientForm({ ...patientForm, email: event.target.value })}
                    required
                  />
                </div>
              )}
              <div className="full">
                <label className="form-label">Allergies</label>
                <textarea
                  className="form-control"
                  value={patientForm.allergies}
                  onChange={(event) =>
                    setPatientForm({ ...patientForm, allergies: event.target.value })
                  }
                  placeholder="Enter known allergies or leave blank"
                  rows={2}
                />
              </div>
              <div className="full">
                <label className="form-label">Chronic conditions</label>
                <textarea
                  className="form-control"
                  value={patientForm.chronicConditions}
                  onChange={(event) =>
                    setPatientForm({ ...patientForm, chronicConditions: event.target.value })
                  }
                  placeholder="Enter chronic conditions or leave blank"
                  rows={2}
                />
              </div>
              {patientForm.onlineAccess && <div className="full">
                <PasswordField
                  value={patientForm.password}
                  onChange={(password) =>
                    setPatientForm({ ...patientForm, password })
                  }
                  label="Temporary password"
                />
              </div>}
            </div>
            <Alert message={error} />
            <ModalActions
              onClose={() => setPatientModal(false)}
              submitLabel="Create and select patient"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {confirm && (
        <ConfirmModal
          title="Delete pending prescription?"
          message={`${confirm.prescriptionNumber} will be permanently removed. Only pending prescriptions can be deleted.`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          busy={busy}
        />
      )}
      {refillTarget && (
        <ConfirmModal
          title="Issue prescription refill?"
          message={`Issue refill #${(refillTarget.refillsUsed || 0) + 1} of ${refillTarget.refillsAllowed} for ${refillTarget.prescriptionNumber}? A new prescription record will be created for pharmacist review.`}
          confirmLabel="Issue refill"
          danger={false}
          onConfirm={issueRefill}
          onClose={() => setRefillTarget(null)}
          busy={busy}
        />
      )}
      {dispenseSuccess && (
        <Modal
          title="Dispensing Completed Successfully"
          onClose={() => {
            setDispenseSuccess(null);
            closeAction();
          }}
          size="md"
        >
          <div className="text-center py-3">
            <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block" />
            <h4 className="mb-1">Invoice Generated</h4>
            <code className="fs-5">{dispenseSuccess.invoiceNumber}</code>
          </div>

          <div className="border rounded p-3 mb-3 bg-light">
            <div className="d-flex justify-content-between mb-2">
              <span>Invoice Number:</span>
              <strong>{dispenseSuccess.invoiceNumber}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Collected:</span>
              <strong>{money(dispenseSuccess.total)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Prescription Status:</span>
              <span className="badge bg-success">{dispenseSuccess.prescriptionStatus}</span>
            </div>
          </div>

          <div className="alert alert-info py-2">
            The items have been successfully deducted from the inventory batches and recorded. You can now print the invoice copy.
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setDispenseSuccess(null);
                closeAction();
              }}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => openPaymentPdf({ id: dispenseSuccess.paymentRequestId || dispense.paymentRequestId }, "receipt")}
            >
              <i className="bi bi-printer me-2" />
              Print Receipt
            </button>
          </div>
        </Modal>
      )}

      {collectionModal && (
        <Modal
          title={`Schedule Collection — ${collectionModal.prescriptionNumber}`}
          onClose={() => setCollectionModal(null)}
          size="md"
        >
          <form onSubmit={saveCollection}>
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-clock-history me-2" />
              Specify when you plan to collect the medicine so we can prepare your pack in advance.
            </div>
            <div className="mb-3">
              <label className="form-label">Pickup date and time</label>
              <FriendlyDateTimePicker value={collectionForm.plannedPickupAt} onChange={(plannedPickupAt) => setCollectionForm({ ...collectionForm, plannedPickupAt })} futureOnly required />
            </div>
            <div className="mb-3">
              <label className="form-label">Collection Note (Optional)</label>
              <textarea
                className="form-control"
                placeholder="e.g. My spouse will collect this around 6 PM after work, please package in paper bag if possible."
                value={collectionForm.pickupNote}
                onChange={(event) =>
                  setCollectionForm({
                    ...collectionForm,
                    pickupNote: event.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <Alert message={error} />
            <ModalActions
              onClose={() => setCollectionModal(null)}
              submitLabel="Save Collection Details"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {/* ── Patient: decline an invoice they do not want to pay ── */}
      {declineInvoice && (
        <Modal
          title="Decline invoice"
          onClose={() => setDeclineInvoice(null)}
          size="sm"
        >
          <form onSubmit={submitDeclineInvoice}>
            <div className="alert alert-warning small">
              <i className="bi bi-exclamation-triangle me-2" />
              <strong>Are you sure you want to decline this invoice?</strong>
              <br />
              This will cancel the pharmacy bill. If you still need your
              medicine, contact the pharmacy directly.
            </div>
            <label className="form-label">Reason for declining</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={declineInvoice.reason}
              onChange={(event) =>
                setDeclineInvoice({ ...declineInvoice, reason: event.target.value })
              }
              placeholder="e.g. I no longer need these medicines, or I found them elsewhere."
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setDeclineInvoice(null)}
              submitLabel="Decline invoice"
              busy={busy}
            />
          </form>
        </Modal>
      )}

      {/* ── Patient: request cancellation/refund for submitted slip or paid order ── */}
      {requestCancel && (
        <Modal
          title={`Request cancellation — ${requestCancel.rx.prescriptionNumber}`}
          onClose={() => setRequestCancel(null)}
          size="sm"
        >
          <form onSubmit={submitRequestCancel}>
            <div className="alert alert-warning small">
              <i className="bi bi-exclamation-triangle me-2" />
              <strong>Request cancellation for this order</strong>
              <br />
              Our cashier team will review your cancellation request and process any refund or payment void before the medicines are prepared.
            </div>
            <label className="form-label">Reason for cancellation request (required)</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={requestCancel.reason}
              onChange={(event) =>
                setRequestCancel({ ...requestCancel, reason: event.target.value })
              }
              placeholder="e.g. Doctor changed prescription, duplicate order, need refund..."
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setRequestCancel(null)}
              submitLabel="Submit cancellation request"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {documentPreview && <DocumentPreview document={documentPreview} onClose={() => setDocumentPreview(null)} />}
    </WorkflowGuard>
  );
}

const padDatePart = (value: number) => String(value).padStart(2, "0");
const localPickerValue = (date: Date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${padDatePart(date.getHours())}:${padDatePart(Math.floor(date.getMinutes() / 15) * 15)}`;

function FriendlyDateTimePicker({ value, onChange, futureOnly = false, pastOnly = false, optional = false, required = false }: { value: string; onChange(value: string): void; futureOnly?: boolean; pastOnly?: boolean; optional?: boolean; required?: boolean }) {
  const fallback = new Date();
  if (futureOnly) fallback.setDate(fallback.getDate() + 1);
  fallback.setHours(9, 0, 0, 0);
  const initialDate = value ? new Date(value) : fallback;
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  if (optional && !value) {
    return <button type="button" className="friendly-date-add" onClick={() => { onChange(localPickerValue(fallback)); setViewMonth(new Date(fallback.getFullYear(), fallback.getMonth(), 1)); setOpen(true); }}><i className="bi bi-calendar-plus me-2" />Add pickup date and time</button>;
  }
  const parts = value ? value.split("T") : localPickerValue(fallback).split("T");
  const [year, month, day] = parts[0].split("-").map(Number);
  const rawTime = parts[1]?.slice(0, 5) || "09:00";
  const time = `${rawTime.slice(0, 2)}:${padDatePart(Math.floor(Number(rawTime.slice(3, 5)) / 15) * 15)}`;
  const times = Array.from({ length: 96 }, (_, index) => {
    const minutes = index * 15;
    return `${padDatePart(Math.floor(minutes / 60))}:${padDatePart(minutes % 60)}`;
  });
  const selectedDate = new Date(year, month - 1, day);
  const calendarStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1 - viewMonth.getDay());
  const calendarDays = Array.from({ length: 42 }, (_, index) => { const date = new Date(calendarStart); date.setDate(calendarStart.getDate() + index); return date; });
  const chooseDate = (date: Date) => {
    let selectedTime = time;
    if (pastOnly && date.toDateString() === new Date().toDateString()) {
      const now = new Date();
      const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time.slice(0, 2)), Number(time.slice(3, 5)));
      if (selected > now) selectedTime = `${padDatePart(now.getHours())}:${padDatePart(Math.floor(now.getMinutes() / 15) * 15)}`;
    }
    onChange(`${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${selectedTime}`);
  };
  const quickDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    date.setHours(Number(time.slice(0, 2)), Number(time.slice(3, 5)), 0, 0);
    onChange(localPickerValue(date));
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div className="friendly-datetime-picker">
      <button type="button" className="friendly-date-trigger" onClick={() => { setViewMonth(new Date(year, month - 1, 1)); setOpen(!open); }} aria-expanded={open}>
        <span><i className="bi bi-calendar3 me-2" />{selectedDate.toLocaleDateString([], { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
        <strong>{new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</strong>
        <i className={`bi bi-chevron-${open ? "up" : "down"}`} />
      </button>
      {open && <div className="friendly-calendar-popover">
        <div className="friendly-calendar-header">
          <strong>{viewMonth.toLocaleDateString([], { month: "long", year: "numeric" })}</strong>
          <div><button type="button" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} aria-label="Previous month"><i className="bi bi-chevron-left" /></button><button type="button" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} aria-label="Next month"><i className="bi bi-chevron-right" /></button></div>
        </div>
        <div className="friendly-calendar-grid friendly-calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name) => <span key={name}>{name}</span>)}</div>
        <div className="friendly-calendar-grid">{calendarDays.map((date) => {
          const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const selected = date.toDateString() === selectedDate.toDateString();
          const disabled = (futureOnly && new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) < new Date()) || (pastOnly && new Date(date.getFullYear(), date.getMonth(), date.getDate()) > new Date());
          return <button type="button" key={dateKey} className={`${date.getMonth() !== viewMonth.getMonth() ? "outside" : ""} ${selected ? "selected" : ""}`} disabled={disabled} onClick={() => chooseDate(date)}>{date.getDate()}</button>;
        })}</div>
        <div className="friendly-calendar-time"><i className="bi bi-clock" /><label>Time</label><select className="form-select" aria-label="Time" value={time} onChange={(event) => onChange(`${parts[0]}T${event.target.value}`)} required={required}>
          {times.map((item) => {
            const now = new Date();
            const futureTimeToday = pastOnly && selectedDate.toDateString() === now.toDateString() && (Number(item.slice(0, 2)) * 60 + Number(item.slice(3, 5))) > (now.getHours() * 60 + now.getMinutes());
            return <option key={item} value={item} disabled={futureTimeToday}>{new Date(`2000-01-01T${item}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</option>;
          })}
        </select></div>
      </div>}
      <div className="friendly-date-shortcuts">
        <button type="button" onClick={() => quickDate(0)}>Today</button>
        <button type="button" onClick={() => quickDate(pastOnly ? -1 : 1)}>{pastOnly ? "Yesterday" : "Tomorrow"}</button>
        <button type="button" onClick={() => quickDate(pastOnly ? -7 : 7)}>{pastOnly ? "Last week" : "Next week"}</button>
        {optional && value && <button type="button" className="clear" onClick={() => onChange("")}>Clear</button>}
      </div>
    </div>
  );
}

function PatientClinicalWarning({
  patient,
  recipientDateOfBirth,
  thirdPartyRecipient = false,
  recipientName,
  recipientRelationship,
  recipientAllergies,
  recipientConditions,
  referenceDate,
  medicines = [],
}: {
  patient?: any;
  recipientDateOfBirth?: string;
  thirdPartyRecipient?: boolean;
  recipientName?: string;
  recipientRelationship?: string;
  recipientAllergies?: string | null;
  recipientConditions?: string | null;
  referenceDate?: string;
  medicines?: any[];
}) {
  if (!patient) return null;
  const isRecorded = (value?: string | null) =>
    Boolean(value?.trim() && !["none", "no", "n/a", "nil"].includes(value.trim().toLowerCase()));

  const effectiveAllergies = thirdPartyRecipient ? recipientAllergies : patient.allergies;
  const effectiveConditions = thirdPartyRecipient ? recipientConditions : patient.chronicConditions;
  const hasAllergies = isRecorded(effectiveAllergies);
  const hasConditions = isRecorded(effectiveConditions);

  const medicineRecipientDateOfBirth = thirdPartyRecipient
    ? recipientDateOfBirth
    : patient.dateOfBirth;
  const age = medicineRecipientDateOfBirth ? (() => {
    const birth = new Date(medicineRecipientDateOfBirth);
    const today = referenceDate ? new Date(referenceDate) : new Date();
    let years = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years -= 1;
    return years;
  })() : null;
  const unsuitable = age == null ? [] : medicines.filter((medicine) =>
    (medicine.minimumAgeYears != null && age < Number(medicine.minimumAgeYears)) ||
    (medicine.maximumAgeYears != null && age > Number(medicine.maximumAgeYears)),
  );

  const isWarning = hasAllergies || hasConditions || unsuitable.length > 0;

  return (
    <div
      className={`patient-clinical-warning alert ${isWarning ? "alert-warning" : "alert-light border"} mb-3`}
      role="status"
      aria-live="polite"
    >
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h5 className="alert-heading fs-6 mb-0">
          <i className="bi bi-clipboard2-pulse me-2" />
          {thirdPartyRecipient
            ? `Recipient clinical safety ${recipientName ? `(${recipientName})` : ""}`
            : "Patient clinical information"}
        </h5>
        {thirdPartyRecipient && (
          <span className="badge bg-secondary-subtle text-secondary border small">
            {recipientRelationship ? `Third-party (${recipientRelationship})` : "Third-party recipient"}
          </span>
        )}
      </div>
      <div className="patient-clinical-details">
        <div className={`small ${age == null ? "text-danger fw-semibold" : ""}`}>
          <strong>Age:</strong>{" "}
          {age == null
            ? "Recipient age required before prescribing"
            : thirdPartyRecipient
              ? `${age} years`
              : `${age} years (${new Date(medicineRecipientDateOfBirth!).toLocaleDateString()})`}
        </div>

        <div className="small mt-1">
          <strong>Allergies:</strong>{" "}
          {hasAllergies ? (
            <span className="text-danger fw-semibold">
              <i className="bi bi-shield-exclamation text-danger me-1" />
              {effectiveAllergies}
            </span>
          ) : (
            <span className="text-secondary">{thirdPartyRecipient ? "None reported for recipient" : "None recorded"}</span>
          )}
        </div>

        <div className="small mt-1">
          <strong>Chronic conditions / illnesses:</strong>{" "}
          {hasConditions ? (
            <span className="fw-semibold text-warning-emphasis">
              <i className="bi bi-heart-pulse text-warning me-1" />
              {effectiveConditions}
            </span>
          ) : (
            <span className="text-secondary">{thirdPartyRecipient ? "None reported for recipient" : "None recorded"}</span>
          )}
        </div>

        {unsuitable.length > 0 && (
          <div className="small text-danger fw-semibold mt-2">
            <i className="bi bi-exclamation-triangle me-1" />
            Age warning: {unsuitable.map((medicine) => `${medicine.genericName} (allowed ${medicine.minimumAgeYears ?? 0}–${medicine.maximumAgeYears ?? "no maximum"} years)`).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
