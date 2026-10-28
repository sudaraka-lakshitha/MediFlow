export type BulkProgress = { stage: string; completed?: number; total?: number };

export function BulkOperationStatus({ progress }: { progress: BulkProgress }) {
  const measured = progress.completed !== undefined && progress.total !== undefined && progress.total > 0;
  return <div className="alert alert-info my-3" role="status" aria-live="polite" aria-atomic="true">
    <div className="d-flex align-items-center gap-2">
      <span className="spinner-border spinner-border-sm flex-shrink-0" aria-hidden="true" />
      <strong>{progress.stage}</strong>
    </div>
    {measured ? <>
      <div className="small mt-2">{progress.completed} of {progress.total} rows confirmed by the server</div>
      <div className="progress mt-2" role="progressbar" aria-label="Rows confirmed by the server"
        aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={progress.total} style={{ height: '10px' }}>
        <div className="progress-bar" style={{ width: `${progress.completed! / progress.total! * 100}%` }} />
      </div>
    </> : <div className="small mt-2">Please keep this window open. No completion estimate is available for this step.</div>}
  </div>;
}
