import { useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { Modal } from './Modal';
import { Alert } from './Ui';
import { billMarkup, slipMarkup } from './billingMarkup';

export type DocumentTarget = { id: number; kind: 'invoice' | 'handoff' | 'receipt'; name?: string };

export function DocumentPreview({ document, onClose }: { document: DocumentTarget; onClose: () => void }) {
  const { user } = useAuth();
  const patient = user?.role === 'PATIENT';
  const preferenceKey = `mediflow-thermal-width-${user?.id}`;
  const [width, setWidth] = useState(() => { try { return localStorage.getItem(preferenceKey) === '58' ? 58 : 80; } catch { return 80; } });
  const [url, setUrl] = useState('');
  const [markup, setMarkup] = useState('');
  const [slip, setSlip] = useState<any>(null);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [detailedReceipt, setDetailedReceipt] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => { setDetailedReceipt(false); }, [document.id, document.kind]);
  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';
    setUrl(''); setMarkup(''); setSlip(null); setPatientDetails(null); setError(''); setReady(false);
    (async () => {
      try {
        let path = document.kind === 'invoice' ? `/sales/${document.id}/invoice.pdf` : `/payment-requests/${document.id}/${document.kind}.pdf`;
        if (document.kind === 'receipt') {
          const response = await api.get(`/payment-requests/${document.id}/collection-slip`);
          if (cancelled) return;
          setSlip(response.data.data);
          if (patient) {
            const details = response.data.data;
            const preview = await api.get(details.status === 'FULFILLED' && details.saleId ? `/sales/${details.saleId}/preview` : `/payment-requests/${document.id}/preview`);
            if (!cancelled) setPatientDetails(preview.data.data);
            return;
          }
          if (response.data.data.status === 'PAID' && response.data.data.pin && detailedReceipt) {
            path = `/payment-requests/${document.id}/receipt.pdf?format=full`;
            const preview = await api.get(`/payment-requests/${document.id}/preview`);
            if (cancelled) return;
            setMarkup(billMarkup(preview.data.data, true, { pickupPin: response.data.data.pin, title: 'Itemized payment receipt with collection PIN' }));
          } else if (response.data.data.status === 'FULFILLED' && response.data.data.saleId) {
            path = `/sales/${response.data.data.saleId}/invoice.pdf`;
            const preview = await api.get(`/sales/${response.data.data.saleId}/preview`);
            if (cancelled) return;
            setMarkup(billMarkup(preview.data.data,true));
          } else setMarkup(slipMarkup(response.data.data,width));
        } else {
          const preview = await api.get(document.kind === 'invoice' ? `/sales/${document.id}/preview` : `/payment-requests/${document.id}/preview`);
          if (cancelled) return;
          setMarkup(billMarkup(preview.data.data,document.kind === 'invoice'));
        }
        const response = await api.get(path, { responseType: 'blob', params: { width } });
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data); setUrl(objectUrl);
      } catch (caught) { if (!cancelled) setError(errorMessage(caught)); }
    })();
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [document.id, document.kind, patient, width, detailedReceipt]);
  const fullCashierReceipt = !patient && detailedReceipt && slip?.status === 'PAID' && Boolean(slip?.pin);
  const thermal = document.kind === 'receipt' && slip?.status === 'PAID' && !fullCashierReceipt;
  const title = document.kind === 'invoice' ? 'Final invoice' : document.kind === 'handoff' ? 'Bill preview' : fullCashierReceipt ? 'Itemized receipt with PIN' : thermal ? 'Collection receipt' : 'Receipt';
  return <Modal title={title} onClose={onClose} size="xl">
    <Alert message={error} />
    {slip && (!fullCashierReceipt) && <section className="border rounded p-3 mb-3" aria-label="Collection receipt details">
      <div className="text-secondary small">Customer name</div><strong>{slip.customerName}</strong>
      <div className="text-secondary small mt-2">Reference number</div><div style={{ overflowWrap: 'anywhere' }}>{slip.referenceNumber}</div>
      {slip.pin ? <><div className="text-secondary small mt-3">Collection PIN</div><strong className="fs-2" style={{ letterSpacing: '.2em' }}>{slip.pin}</strong><p className="small mb-0">Show this PIN only when collecting your order.</p></> : <p className="mt-2 mb-0">{slip.deliveryFee ? 'Delivery service payment confirmed.' : slip.delivery && slip.delivery.status !== 'CANCELLED' ? `Home delivery: ${slip.delivery.status.replaceAll('_', ' ')}. Track your order under Home deliveries.` : slip.status === 'FULFILLED' ? 'Order collected. No PIN is required.' : 'Collect at the pharmacy.'}</p>}
    </section>}
    {!patient && slip?.status === 'PAID' && slip?.pin && <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
      <span className="small text-secondary">Cashier print format:</span>
      <button type="button" className={`btn btn-sm ${fullCashierReceipt ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setDetailedReceipt(true)}>Itemized receipt + PIN (A4)</button>
      <button type="button" className={`btn btn-sm ${!fullCashierReceipt ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setDetailedReceipt(false)}>Compact PIN slip</button>
    </div>}
    {patientDetails && <section aria-label="Prescription preparation and medicine directions" className="mb-3">
      <p className="small">Prescription prepared by: <strong>{patientDetails.preparedBy || 'Not recorded'}</strong>{patientDetails.verifiedBy && <> · Verified by: <strong>{patientDetails.verifiedBy}</strong></>}{patientDetails.dispensedBy && <> · Dispensed by: <strong>{patientDetails.dispensedBy}</strong></>}</p>
      {patientDetails.medicineInstructions?.length > 0 && <><h4>Medicine directions</h4><p className="small text-secondary">{slip?.status === 'FULFILLED' ? 'Recorded directions for medicines supplied with this invoice.' : 'Recorded directions for medicines in this order. Payment is not confirmation of collection.'} If a medicine was returned or its instructions changed, confirm the current directions with the pharmacist.</p>{patientDetails.medicineInstructions.map((item: any) => <article className="border rounded p-3 mb-2" key={item.id}><strong>{item.name}</strong><small className="d-block text-secondary">Quantity: {item.quantity} {item.unit}</small><p className="mt-2 mb-1" style={{whiteSpace:'pre-wrap'}}>{item.directions}</p>{item.specialInstructions && <p className="mb-1" style={{whiteSpace:'pre-wrap'}}>Additional instructions: {item.specialInstructions}</p>}{item.storageInstructions && <small className="d-block">Storage: {item.storageInstructions}</small>}</article>)}</>}
    </section>}
    {!patient && thermal && <div className="d-flex align-items-center gap-2 mb-3"><label htmlFor="thermal-width">Printer paper width</label><select id="thermal-width" className="form-select w-auto" value={width} onChange={(event) => { const value = Number(event.target.value); setWidth(value); try { localStorage.setItem(preferenceKey, String(value)); } catch { /* Preference is optional. */ } }}><option value={58}>58 mm</option><option value={80}>80 mm</option></select><small className="text-secondary">Saved for your account on this device. Print at actual size.</small></div>}
    {markup ? <iframe ref={frame} title={`${title} preview`} srcDoc={markup} onLoad={() => setReady(true)} style={{ width: '100%', height: '60vh', border: '1px solid var(--line)', borderRadius: 8 }} /> : !slip && !error ? <p role="status">Loading document…</p> : null}
    <div className="modal-actions">
      <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
      {url && <a className="btn btn-outline-secondary" href={url} download={`${document.name || title}.pdf`}>Download PDF</a>}
      {markup && document.kind !== 'handoff' && <button type="button" className="btn btn-primary" disabled={!ready} onClick={() => { try { frame.current?.contentWindow?.focus(); frame.current?.contentWindow?.print(); } catch { setError('Printing is unavailable in this browser. Download the PDF and print it using your printer software.'); } }}>Print {thermal ? `${width} mm slip` : fullCashierReceipt ? 'A4 receipt with PIN' : 'final invoice'}</button>}
    </div>
  </Modal>;
}
