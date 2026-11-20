// DRUG RESEARCH PAGE
// Search drug information (uses, warnings, label sections). It only reads information; it does not
// change prescriptions or stock.

import { formatPharmacyTime } from "../utils/pharmacyTime";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { api, errorMessage } from '../api/client';
import { Alert, Empty, Loading } from '../components/Ui';
import { PredictiveSearchInput } from '../components/PredictiveSearchInput';

// The page.
export function DrugResearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const sequence = useRef(0);

  // Search for a drug name and show the results.
  const runSearch = async (term: string) => {
    const normalized = term.trim();
    if (normalized.length < 2) {
      setResult(null);
      return;
    }
    const request = ++sequence.current;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/drug-information/search', {
        params: { q: normalized },
      });
      if (request === sequence.current) setResult(response.data.data);
    } catch (caught) {
      if (request === sequence.current) setError(errorMessage(caught));
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setResult(null);
      return;
    }
    const suggestionTimer = window.setTimeout(
      () =>
        api
          .get('/drug-information/suggestions', { params: { q: query.trim() } })
          .then((response) => setSuggestions(response.data.data))
          .catch(() => setSuggestions([])),
      180,
    );
    const searchTimer = window.setTimeout(() => runSearch(query), 700);
    return () => {
      window.clearTimeout(suggestionTimer);
      window.clearTimeout(searchTimer);
    };
  }, [query]);

  // Search when the form is sent.
  const submit = (event: FormEvent) => {
    event.preventDefault();
    runSearch(query);
  };

  const hasResults =
    result &&
    (result.localProducts?.length ||
      result.candidates?.length ||
      result.compounds?.length ||
      result.labels?.length);

  return (
    <>
      {/* Page header */}
      <div className="page-intro">
        <div>
          <h2>Drug research</h2>
          <p>
            Search medicines using RxNorm approximate matching, PubChem compound
            data, and openFDA public drug labels. Local catalogue matches are
            always checked first.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning d-flex gap-2 align-items-start">
        <i className="bi bi-exclamation-triangle-fill flex-shrink-0 mt-1" />
        <div>
          <strong>Reference tool only.</strong> Results are sourced from public
          databases and may be incomplete, delayed, or US-specific. Always
          confirm using approved clinical references before dispensing.
        </div>
      </div>

      {/* Search form */}
      <div className="panel">
        <form onSubmit={submit}>
          <div className="input-group input-group-lg">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <PredictiveSearchInput
              value={query}
              onChange={setQuery}
              suggestions={suggestions.flatMap((item) => [
                item.value,
                item.label,
              ])}
              placeholder="Type a generic name, brand name, or approximate spelling…"
              minLength={2}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || query.trim().length < 2}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Searching…
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2" />
                  Search
                </>
              )}
            </button>
          </div>
          <small className="text-secondary d-block mt-2">
            Results refresh automatically after you pause typing. Enter at least
            2 characters to begin.
          </small>
        </form>
      </div>

      {/* Error */}
      <Alert message={error} />

      {/* Loading skeleton */}
      {loading && !result && <Loading />}

      {/* Empty state — search done but nothing found */}
      {!loading && result && !hasResults && (
        <div className="panel mt-4 text-center py-5">
          <i className="bi bi-journal-x fs-1 text-secondary d-block mb-3" />
          <h4 className="text-secondary">No results found for "{result.query}"</h4>
          <p className="text-secondary mb-0">
            Try a generic ingredient name, a different spelling, or check the
            local catalogue manually.
          </p>
        </div>
      )}

      {/* Welcome state — nothing searched yet */}
      {!loading && !result && !error && (
        <div className="panel mt-4 text-center py-5">
          <i className="bi bi-capsule fs-1 text-secondary d-block mb-3" />
          <h4 className="text-secondary">Start your drug research</h4>
          <p className="text-secondary mb-0">
            Enter a medicine name above to search local catalogue, RxNorm
            concepts, PubChem compounds, and FDA drug labels.
          </p>
        </div>
      )}

      {/* Results */}
      {result && hasResults && (
        <div className="drug-results mt-4">

          {/* Unavailable sources notice */}
          {result.unavailable?.length > 0 && (
            <div className="alert alert-secondary d-flex gap-2 align-items-center">
              <i className="bi bi-wifi-off flex-shrink-0" />
              <span>
                <strong>Partial results.</strong> The following online source
                {result.unavailable.length > 1 ? 's were' : ' was'} unavailable:{' '}
                {result.unavailable.join(', ')}. Local catalogue and other
                available sources are still shown.
              </span>
            </div>
          )}

          {/* Cached notice */}
          {result.cached && (
            <div className="alert alert-info d-flex gap-2 align-items-center py-2">
              <i className="bi bi-lightning-charge flex-shrink-0" />
              <small>
                Results are from a recent cache (valid for 10 minutes). Search
                again to force a refresh.
              </small>
            </div>
          )}

          {/* Local catalogue matches */}
          {result.localProducts?.length > 0 && (
            <div className="panel mb-4">
              <div className="panel-header">
                <div>
                  <h3>
                    <i className="bi bi-shop me-2 text-primary" />
                    Local catalogue matches
                  </h3>
                  <small className="text-secondary">
                    Products already configured in MediFlow
                  </small>
                </div>
                <span className="badge text-bg-primary">
                  {result.localProducts.length}
                </span>
              </div>
              <div className="research-chips">
                {result.localProducts.map((item: any) => (
                  <span
                    className="badge text-bg-light p-2 border"
                    key={item.id}
                  >
                    <i className="bi bi-capsule me-1 text-primary" />
                    {item.genericName} {item.strength}
                    {item.brandName && (
                      <span className="text-secondary ms-1">
                        · {item.brandName}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* RxNorm candidates */}
          {result.candidates?.length > 0 && (
            <div className="panel mb-4">
              <div className="panel-header">
                <div>
                  <h3>
                    <i className="bi bi-list-check me-2 text-primary" />
                    RxNorm approximate matches
                  </h3>
                  <small className="text-secondary">
                    Click a result to refine your search
                  </small>
                </div>
                {result.cached && (
                  <span className="badge text-bg-light border">Cached</span>
                )}
              </div>
              <div className="research-chips">
                {result.candidates.map((item: any, index: number) => (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    key={`${item.rxcui}-${index}`}
                    type="button"
                    onClick={() => setQuery(item.name)}
                    title={`RxCUI: ${item.rxcui}`}
                  >
                    {item.name}
                    <small className="ms-1 opacity-75">
                      #{item.rxcui}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PubChem + FDA Labels side by side */}
          <div className="row g-4">
            {/* PubChem compounds */}
            <div className="col-xl-5">
              <div className="panel h-100">
                <div className="panel-header mb-3">
                  <div>
                    <h3>
                      <i className="bi bi-diagram-3 me-2 text-primary" />
                      PubChem compounds
                    </h3>
                    <small className="text-secondary">
                      Molecular structure data
                    </small>
                  </div>
                </div>
                {result.compounds?.length > 0 ? (
                  result.compounds.map((compound: any) => (
                    <div key={compound.cid} className="research-record">
                      <h4>{compound.title || result.query}</h4>
                      <dl>
                        <dt>CID</dt>
                        <dd>
                          <code>{compound.cid}</code>
                        </dd>
                        <dt>Formula</dt>
                        <dd>{compound.molecularFormula || '—'}</dd>
                        <dt>Molecular weight</dt>
                        <dd>
                          {compound.molecularWeight
                            ? `${compound.molecularWeight} g/mol`
                            : '—'}
                        </dd>
                        {compound.inchiKey && (
                          <>
                            <dt>InChIKey</dt>
                            <dd>
                              <code className="small">{compound.inchiKey}</code>
                            </dd>
                          </>
                        )}
                      </dl>
                      <a
                        href={compound.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-box-arrow-up-right me-1" />
                        Open PubChem record
                      </a>
                    </div>
                  ))
                ) : (
                  <Empty text="No PubChem compound matched." />
                )}
              </div>
            </div>

            {/* FDA public drug labels */}
            <div className="col-xl-7">
              <div className="panel h-100">
                <div className="panel-header mb-3">
                  <div>
                    <h3>
                      <i className="bi bi-file-medical me-2 text-primary" />
                      FDA public drug labels
                    </h3>
                    <small className="text-secondary">
                      openFDA label sections
                    </small>
                  </div>
                </div>
                {result.labels?.length > 0 ? (
                  result.labels.map((label: any, index: number) => (
                    <div className="research-record" key={index}>
                      <h4>
                        {label.brandNames[0] ||
                          label.genericNames[0] ||
                          result.query}
                      </h4>
                      {label.genericNames?.length > 0 && (
                        <p className="text-secondary small mb-2">
                          Generic:{' '}
                          {label.genericNames.slice(0, 3).join(', ')}
                        </p>
                      )}
                      <LabelSection
                        title="Indications & usage"
                        text={label.indications}
                        icon="check2-circle"
                      />
                      <LabelSection
                        title="Dosage & administration"
                        text={label.dosage}
                        icon="droplet"
                      />
                      <LabelSection
                        title="Warnings"
                        text={label.warnings}
                        icon="exclamation-triangle"
                      />
                      <LabelSection
                        title="Drug interactions"
                        text={label.interactions}
                        icon="arrows-collapse"
                      />
                      <LabelSection
                        title="Storage & handling"
                        text={label.storage}
                        icon="box-seam"
                      />
                      {label.sourceUrl && (
                        <a
                          href={label.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary mt-2"
                        >
                          <i className="bi bi-box-arrow-up-right me-1" />
                          View on openFDA
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <Empty text="No FDA label matched." />
                )}
              </div>
            </div>
          </div>

          {/* Data sources footer */}
          {result.sources?.length > 0 && (
            <div className="mt-4 p-3 rounded border bg-white">
              <small className="text-secondary">
                <i className="bi bi-database me-1" />
                <strong>Data sources: </strong>
                {result.sources.map((source: any, index: number) => (
                  <span key={source.name}>
                    {index > 0 && ' · '}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-secondary"
                    >
                      {source.name}
                    </a>
                  </span>
                ))}
                {result.searchedAt && (
                  <span className="ms-2">
                    · Searched{' '}
                    {formatPharmacyTime(result.searchedAt)}
                  </span>
                )}
              </small>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// One section of a drug label (for example warnings or dosage).
function LabelSection({
  title,
  text,
  icon,
}: {
  title: string;
  text?: string;
  icon?: string;
}) {
  if (!text) return null;
  return (
    <details className="label-section">
      <summary>
        {icon && <i className={`bi bi-${icon} me-1`} />}
        {title}
      </summary>
      <p>{text}</p>
    </details>
  );
}
