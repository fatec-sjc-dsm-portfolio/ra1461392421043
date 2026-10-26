import { useEffect, useRef, useState, type RefObject } from 'react';
import { useLang } from '../i18n/LangContext';
import { useAnimationFrame, useOnEnterView, useReducedMotion, useTimeline } from '../hooks/motion';

/** Rotating gold edge on a panel while its demo is running. */
function useSpin(ref: RefObject<HTMLDivElement | null>, running: boolean) {
  const angle = useRef(0);
  useAnimationFrame(() => {
    angle.current = (angle.current + 1.6) % 360;
    ref.current?.style.setProperty('--ang', `${angle.current}deg`);
  }, running);
}

/* ------------------------------------------------------------------ extraction */

// Each extracted field: where it sits on the invoice and the JSON value it becomes
const VALUES: [string, 'v' | 'n'][] = [
  ['"Comercial Andrade Ltda"', 'v'],
  ['"3009447182"', 'v'],
  ['"2026-04"', 'v'],
  ['"2026-05-12"', 'v'],
  ['1284', 'n'],
  ['1137.46', 'n'],
];
// last 12 months of consumption, drawn as the little history chart found on real energy bills
const HISTORY = [62, 70, 66, 74, 81, 77, 69, 72, 80, 88, 84, 92];

type Phase = 'away' | 'arriving' | 'reading' | 'extracting' | 'validating' | 'done';
interface Flight { text: string; from: [number, number]; to: [number, number]; go: boolean }

export function ExtractionDemo() {
  const { t } = useLang();
  const e = t.extraction;
  const still = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const tl = useTimeline();
  // typed[i] = characters shown for field i; null = full value (rest state)
  const [typed, setTyped] = useState<(number | null)[]>(VALUES.map(() => null));
  const [hit, setHit] = useState<number | null>(null);
  const [got, setGot] = useState(VALUES.length);
  const [phase, setPhase] = useState<Phase>('done');
  const [flight, setFlight] = useState<Flight | null>(null);

  /** Position of a field on the invoice and of its value in the JSON, relative to the panel body. */
  const route = (i: number): Pick<Flight, 'from' | 'to'> | null => {
    const b = body.current;
    const src = b?.querySelector<HTMLElement>(`[data-f="${i}"] .fv`);
    const dst = b?.querySelector<HTMLElement>(`[data-v="${i}"]`);
    if (!b || !src || !dst) return null;
    const o = b.getBoundingClientRect();
    const r1 = src.getBoundingClientRect();
    const r2 = dst.getBoundingClientRect();
    return { from: [r1.left - o.left, r1.top - o.top], to: [r2.left - o.left, r2.top - o.top] };
  };

  const run = () => {
    tl.clear();
    setTyped(VALUES.map(() => 0));
    setGot(0);
    setHit(null);
    setFlight(null);
    setPhase('away');
    tl.at(60, () => setPhase('arriving'));
    tl.at(900, () => setPhase('reading'));
    let at = 2000;
    tl.at(at, () => setPhase('extracting'));
    VALUES.forEach(([val], i) => {
      tl.at(at, () => setHit(i));
      at += 420;
      tl.at(at, () => {
        const r = route(i);
        if (r) setFlight({ text: val, ...r, go: false });
      });
      tl.at(at + 40, () => setFlight((f) => (f ? { ...f, go: true } : f)));
      at += 640;
      tl.at(at, () => {
        setFlight(null);
        setGot(i + 1);
      });
      for (let c = 1; c <= val.length; c++) {
        tl.at(at + c * 20, () => setTyped((prev) => prev.map((n, k) => (k === i ? c : n))));
      }
      at += val.length * 20 + 160;
    });
    tl.at(at, () => {
      setHit(null);
      setPhase('validating');
    });
    tl.at(at + 700, () => {
      setTyped(VALUES.map(() => null));
      setPhase('done');
    });
  };

  useOnEnterView(panel, () => !still && run());
  const busy = phase !== 'done';
  useSpin(panel, busy && phase !== 'validating');

  const statusText = {
    away: e.downloading,
    arriving: e.downloading,
    reading: e.reading,
    extracting: e.running,
    validating: e.validating,
    done: e.done,
  }[phase];
  const field = (i: number) => `sh-f${hit === i ? ' hit' : ''}${i < got && hit !== i ? ' got' : ''}`;

  return (
    <div className={`panel${busy ? ' running' : ''}`} ref={panel} role="img" aria-label={e.aria}>
      <div className="p-h">
        <span>{e.head} · <b>fatura_0423.pdf</b></span>
        <span className="tag">structured output</span>
      </div>
      <div className="x-b" ref={body}>
        <div className="doc">
          <div className={`sheet ${phase}`}>
            <div className="sh-top">
              <i className="sh-logo" />
              <div className="sh-id"><b>{e.docTitle}</b><span>Distribuidora de energia · 2ª via</span></div>
              <span className="sh-no">Nº 0423</span>
            </div>
            <div className={field(0)} data-f="0" data-k={e.keys[0]}><small>Cliente</small><span className="fv">COMERCIAL ANDRADE LTDA</span></div>
            <div className="sh-cols">
              <div className={field(1)} data-f="1" data-k={e.keys[1]}><small>Nº da instalação</small><span className="fv">3009 4471 82</span></div>
              <div className="sh-f"><small>Classe</small><span>B3 · trifásico</span></div>
            </div>
            <div className="sh-cols">
              <div className={field(2)} data-f="2" data-k={e.keys[2]}><small>Referência</small><span className="fv">ABR/2026</span></div>
              <div className={field(3)} data-f="3" data-k={e.keys[3]}><small>Vencimento</small><span className="fv">12/05/2026</span></div>
            </div>
            <div className="sh-cols">
              <div className={field(4)} data-f="4" data-k={e.keys[4]}><small>Consumo ativo</small><span className="fv">1.284 kWh</span></div>
              <div className="sh-hist" aria-hidden="true">
                {HISTORY.map((h, k) => <i key={k} style={{ height: `${h}%` }} />)}
              </div>
            </div>
            <div className={`${field(5)} sh-total`} data-f="5" data-k={e.keys[5]}><small>Total a pagar</small><span className="fv">R$ 1.137,46</span></div>
            <div className="sh-code" aria-hidden="true" />
            <span className="sh-stamp">{e.stamp}</span>
            <i className="sh-sweep" />
          </div>
        </div>
        <div className="json">
          {'{\n'}
          {VALUES.map(([val, kind], i) => {
            const n = typed[i];
            const shown = n === null ? val : val.slice(0, n);
            return (
              <span key={i} className={`row${n === null || n > 0 || hit === i ? ' on' : ''}`}>
                {'  '}<span className="k">"{e.keys[i]}"</span>: <span className={kind} data-v={i}>{shown}{n !== null && n > 0 && n < val.length && <i className="caret" />}</span>
                {i < VALUES.length - 1 ? ',' : ''}{'\n'}
              </span>
            );
          })}
          {'}'}
        </div>
        {flight && (
          <span
            className={`fly${flight.go ? ' go' : ''}`}
            style={{ transform: `translate(${(flight.go ? flight.to : flight.from).map((v) => `${v}px`).join(',')})` }}
            aria-hidden="true"
          >
            {flight.text}
          </span>
        )}
      </div>
      <div className={`p-f ${busy ? 'busy' : 'ok'}`}>
        <span className="st"><i className="dot" />{statusText}</span>
        <span>{busy ? '— s · — tokens' : '1.8 s · 2.1k tokens'}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ trace */

const SPANS: { name: string; cls: string; left: number; width: number; val: (t: ReturnType<typeof useLang>['t']) => string; ok?: boolean }[] = [
  { name: 'pdf.extrair_texto', cls: 'tool', left: 0, width: 10, val: () => 'PyMuPDF' },
  { name: 'slm.gerar_queries', cls: 'llm', left: 10.4, width: 18.8, val: () => '5 queries' },
  { name: 'busca.vetorial', cls: 'ret', left: 29.2, width: 10.4, val: () => 'top‑k 20' },
  { name: 'llm.juiz', cls: 'llm', left: 39.6, width: 54, val: (t) => t.trace.score },
  { name: 'ranking.precedentes', cls: 'ev', left: 93.8, width: 6.2, val: (t) => t.trace.applicable, ok: true },
];

export function TraceDemo() {
  const { t } = useLang();
  const still = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'rest' | 'reset' | 'grow'>('rest');
  const tl = useTimeline();

  useOnEnterView(panel, () => {
    if (still) return;
    tl.clear();
    setPhase('reset');
    tl.at(40, () => setPhase('grow'));
    tl.at(3000, () => setPhase('rest'));
  });
  useSpin(panel, phase !== 'rest');

  return (
    <div className={`panel${phase === 'reset' ? ' reset' : ''}${phase !== 'rest' ? ' running' : ''}`} ref={panel} role="img" aria-label={t.trace.aria}>
      <div className="p-h">
        <span>trace · <b>themis.buscar_precedentes</b></span>
        <span className="tag">peticao_inicial.pdf</span>
      </div>
      <div className="tr">
        <div className="tr-in">
          <div className="tr-axis">
            <span>span</span>
            <span className="ticks"><span>0 s</span><span>1.2</span><span>2.4</span><span>3.6</span><span>4.8</span></span>
            <span style={{ textAlign: 'right' }}>{t.trace.detail}</span>
          </div>
          <div className="tr-row">
            <span className="nm"><i>▾</i>pipeline.rag</span>
            <span className="lane"><span className="bar root" style={{ left: 0, width: '100%' }} /></span>
            <span className="val">4.8 s</span>
          </div>
          {SPANS.map((s, i) => (
            <div key={s.name} className={`tr-row child${s.ok ? ' ok' : ''}`}>
              <span className="nm">{s.name}</span>
              <span className="lane">
                <span className={`bar ${s.cls}`} data-d={i} style={{ left: `${s.left}%`, width: `${s.width}%`, transitionDelay: phase === 'grow' ? `${0.25 + i * 0.42}s` : undefined }} />
              </span>
              <span className="val">{s.val(t)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-f">
        <span className="legend">
          {['#d8b878', '#7f97c2', '#6d8f9c', '#93c8a2'].map((c, i) => (
            <span key={c}><i style={{ background: c }} />{t.trace.legend[i]}</span>
          ))}
        </span>
        <span>{t.trace.footer}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ chat */

const PRODUCTS = [
  ['Blackview A95', '128 GB · Helio P70 · 20 MP'],
  ['Moto G23', '128 GB · Helio G85 · 50 MP'],
  ['Samsung Galaxy M54 5G', '256 GB · Exynos 1380 · 108 MP'],
];

export function ChatDemo() {
  const { t } = useLang();
  const c = t.chat;
  const still = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const tl = useTimeline();
  const sqlLines = [
    <><span className="kw">SELECT</span> {c.sql.cols}</>,
    <><span className="kw">FROM</span> {c.sql.table}</>,
    <><span className="kw">WHERE</span> {c.sql.cat}</>,
    <>{'  '}<span className="kw">AND</span> {c.sql.color} <span className="kw">AND</span> ram_gb = 8</>,
    <><span className="kw">ORDER BY</span> {c.sql.order} <span className="kw">DESC</span></>,
    <><span className="kw">LIMIT</span> 3;</>,
  ];
  // null everywhere = finished conversation (rest state)
  const [chars, setChars] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [lines, setLines] = useState<number | null>(null);
  const [products, setProducts] = useState<number | null>(null);
  const [status, setStatus] = useState<'done' | 'typing' | 'thinking' | 'answering'>('done');

  // switching language mid-animation: just show the finished state
  useEffect(() => {
    tl.clear();
    setChars(null);
    setSteps(null);
    setLines(null);
    setProducts(null);
    setStatus('done');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c]);

  const run = () => {
    tl.clear();
    setChars(0);
    setSteps(0);
    setLines(0);
    setProducts(-1);
    setStatus('typing');
    let at = 300;
    for (let i = 1; i <= c.question.length; i++) tl.at(at + i * 32, () => setChars(i));
    at += c.question.length * 32 + 350;
    tl.at(at, () => setStatus('thinking'));
    c.steps.forEach((_, k) => {
      tl.at(at, () => setSteps(k + 1));
      at += 420;
      if (k === 3) {
        sqlLines.forEach((_, n) => tl.at(at + n * 140, () => setLines(n + 1)));
        at += sqlLines.length * 140 + 200;
      }
    });
    tl.at(at, () => {
      setStatus('answering');
      setProducts(0);
    });
    at += 350;
    PRODUCTS.forEach((_, k) => {
      tl.at(at, () => setProducts(k + 1));
      at += 260;
    });
    tl.at(at + 300, () => {
      setChars(null);
      setSteps(null);
      setLines(null);
      setProducts(null);
      setStatus('done');
    });
  };

  useOnEnterView(panel, () => !still && run());
  useSpin(panel, status !== 'done');

  const statusText = { done: c.done, typing: c.typing, thinking: c.thinking, answering: c.answering }[status];
  const question = chars === null ? c.question : c.question.slice(0, chars);
  const botHidden = products !== null && products < 0;

  return (
    <div className={`panel chat${status !== 'done' ? ' running' : ''}`} ref={panel} role="img" aria-label={c.aria}>
      <div className="p-h">
        <span>{c.head}</span>
        <span className="tag">LangChain · Qdrant</span>
      </div>
      <div className="c-b">
        <div className="conv">
          <div className="msg user">{question}</div>
          <div className={`msg bot${botHidden ? ' hide' : ''}`}>
            <p>{c.answer}</p>
            {PRODUCTS.map(([name, spec], k) => (
              <div key={name} className={`prod${products !== null && k >= products ? ' hide' : ''}`}>
                <b>{name}</b>
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="think">
          <div className="label">{c.reasoning}</div>
          <ol className="steps">
            {c.steps.map(([label, detail], k) => (
              <li key={label} className={steps !== null && k >= steps ? 'off' : undefined}>
                <i />
                <span>{label}</span>
                <em>{detail}</em>
              </li>
            ))}
          </ol>
          <pre className="sql">
            {sqlLines.slice(0, lines === null ? sqlLines.length : lines).map((l, n, arr) => (
              <span key={n}>{l}{n < arr.length - 1 ? '\n' : ''}</span>
            ))}
          </pre>
        </div>
      </div>
      <div className={`p-f ${status === 'done' ? 'ok' : 'busy'}`}>
        <span className="st"><i className="dot" />{statusText}</span>
        <span>guardrails ✓</span>
      </div>
    </div>
  );
}

