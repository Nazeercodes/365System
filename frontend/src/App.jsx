import { useState, useEffect, useCallback } from 'react';
import * as api from './api';

// ── CSS ────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080807;--surface:#0f0f0d;--surface2:#161614;
  --border:#1e1e1b;--border2:#2a2a26;
  --gold:#c8a84b;--gold-dim:#6b5a28;--gold-glow:rgba(200,168,75,0.15);
  --white:#e8e5dc;--muted:#4a4845;--muted2:#6a6760;
  --red:#7a3228;--red-bright:#c0503a;
  --green:#2a4a32;--green-bright:#4a8c5a;
  --fd:'Bebas Neue',sans-serif;
  --fs:'Cormorant Garamond',serif;
  --fm:'DM Mono',monospace;
}
body{background:var(--bg);color:var(--white);font-family:var(--fm);min-height:100vh;overflow-x:hidden;}
body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--border2);}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 15px rgba(200,168,75,0.1)}50%{box-shadow:0 0 35px rgba(200,168,75,0.25)}}
@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}

.fu{animation:fadeUp .45s ease both}
.fu1{animation:fadeUp .45s .08s ease both}
.fu2{animation:fadeUp .45s .16s ease both}
.fu3{animation:fadeUp .45s .24s ease both}
.fu4{animation:fadeUp .45s .32s ease both}
.fi{animation:fadeIn .3s ease both}

.btn-p{background:var(--gold);color:var(--bg);border:none;font-family:var(--fm);font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;padding:.85rem 2.2rem;cursor:pointer;transition:all .2s;display:inline-block;}
.btn-p:hover{background:#e0bc58;transform:translateY(-1px);}
.btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-g{background:none;color:var(--muted2);border:1px solid var(--border2);font-family:var(--fm);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;padding:.7rem 1.4rem;cursor:pointer;transition:all .2s;}
.btn-g:hover{border-color:var(--gold-dim);color:var(--gold);}
.btn-d{background:none;color:var(--red-bright);border:1px solid var(--red);font-family:var(--fm);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .9rem;cursor:pointer;transition:all .2s;}
.btn-d:hover{background:var(--red);color:var(--white);}

.inp{background:var(--surface2);border:1px solid var(--border);color:var(--white);font-family:var(--fm);font-size:.75rem;padding:.8rem 1rem;width:100%;outline:none;transition:border-color .2s;}
.inp:focus{border-color:var(--gold-dim);}
.inp::placeholder{color:var(--muted);}
select.inp{cursor:pointer;}
select.inp option{background:var(--surface2);}

.ta{background:transparent;border:none;border-top:1px solid var(--border);color:var(--white);font-family:var(--fs);font-size:.95rem;font-style:italic;padding:.9rem 0;width:100%;outline:none;resize:none;line-height:1.75;min-height:80px;}
.ta::placeholder{color:var(--muted);font-style:italic;}

.nav{position:fixed;top:0;left:0;right:0;height:56px;background:rgba(8,8,7,0.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 2rem;z-index:100;}
.nav-logo{font-family:var(--fd);font-size:1.4rem;letter-spacing:.15em;cursor:pointer;}
.nav-logo span{color:var(--gold);}
.nav-links{display:flex;gap:1.8rem;align-items:center;}
.nl{background:none;border:none;color:var(--muted2);font-family:var(--fm);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:color .2s;padding:0;}
.nl:hover,.nl.active{color:var(--gold);}

.page{padding-top:56px;min-height:100vh;}
.sec{max-width:1100px;margin:0 auto;padding:3.5rem 2rem;}
.sec-sm{max-width:580px;margin:0 auto;padding:3.5rem 2rem;}
.lbl{font-size:.56rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem;display:block;}
.card{background:var(--surface);border:1px solid var(--border);padding:1.4rem;}
.divider{height:1px;background:var(--border);margin:1.8rem 0;}

.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease;padding:1rem;}
.modal{background:var(--surface);border:1px solid var(--border2);width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:fadeUp .3s ease;}
.modal-hd{padding:1.4rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
.modal-bd{padding:1.4rem;}
.close-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.3rem;line-height:1;transition:color .2s;}
.close-btn:hover{color:var(--white);}

.toast{position:fixed;bottom:2rem;right:2rem;background:var(--surface2);border:1px solid var(--border2);padding:.75rem 1.4rem;font-size:.62rem;letter-spacing:.12em;z-index:300;animation:slideIn .3s ease;color:var(--gold);}

.spinner{width:18px;height:18px;border:2px solid var(--border2);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
.loading-full{display:flex;align-items:center;justify-content:center;height:60vh;flex-direction:column;gap:1rem;}
.loading-full .spinner{width:32px;height:32px;}
`;

const PILLAR_COLORS = ['#c8a84b','#4a8c5a','#4a6a9c','#8c4a6a','#6a4a8c','#8c6a4a'];
const VOID_REASONS = ['Travel','Illness','Emergency','Rest','Other'];
const DEFAULT_PILLARS = [
  {id:'sleep',name:'Sleep',hours:7,description:'The foundation',icon:'🌙',color:'#4a6a9c'},
  {id:'body',name:'Body',hours:3,description:'Walk + Lift',icon:'⚡',color:'#4a8c5a'},
  {id:'trading',name:'Trading',hours:2,description:'Discipline over instinct',icon:'📈',color:'#c8a84b'},
  {id:'dev',name:'Dev',hours:3,description:'React · FastAPI · Build',icon:'⌨️',color:'#8c4a6a'},
  {id:'business',name:'Business',hours:3,description:'Build what lasts',icon:'🏗️',color:'#6a4a8c'},
  {id:'hunt',name:'Hunt',hours:2,description:'Jobs · Projects · Contracts',icon:'🎯',color:'#8c6a4a'},
];

function getToday() { return new Date().toISOString().slice(0,10); }

function getYearStart(startDate) {
  const d = new Date(startDate || getToday());
  const dates = [];
  for (let i = 0; i < 365; i++) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + i);
    dates.push(nd.toISOString().slice(0,10));
  }
  return dates;
}

// ── HEAT SQUARE ───────────────────────────────────────────
function HeatSquare({ date, score, total, isToday, voidReason }) {
  const pct = total > 0 ? score / total : 0;
  const isFuture = date > getToday();
  const isVoid = voidReason && score === 0;
  let bg = 'transparent', border = 'var(--border)', glow = 'none';
  if (!isFuture) {
    if (isVoid) { bg = 'rgba(122,50,40,0.3)'; border = 'var(--red)'; }
    else if (pct > 0) {
      bg = `rgba(200,168,75,${0.15 + pct * 0.85})`;
      border = pct === 1 ? 'var(--gold)' : 'var(--gold-dim)';
      if (pct === 1) glow = '0 0 8px rgba(200,168,75,0.35)';
    }
  }
  if (isToday) border = 'var(--gold)';
  return (
    <div title={date} style={{
      width:'100%',aspectRatio:'1',background:bg,
      border:`1px solid ${border}`,boxShadow:glow,
      transition:'all .3s ease',position:'relative',
    }}>
      {isToday && <div style={{position:'absolute',inset:0,border:'1px solid var(--gold)',animation:'glowPulse 2s infinite'}}/>}
    </div>
  );
}

// ── YEAR GRID ──────────────────────────────────────────────
function YearGrid({ history, pillars, startDate }) {
  const today = getToday();
  const dates = getYearStart(startDate);
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(26,1fr)',gap:'3px'}}>
      {dates.map(date => {
        const d = history[date] || {};
        return <HeatSquare key={date} date={date} score={(d.done||[]).length}
          total={pillars.length} isToday={date===today} voidReason={d.void_reason}/>;
      })}
    </div>
  );
}

// ── PILLAR CARD ───────────────────────────────────────────
function PillarCard({ pillar, done, journal, onToggle, onJournalChange, onOpenArchive, disabled }) {
  const [showJ, setShowJ] = useState(false);
  const [text, setText] = useState(journal || '');

  useEffect(() => { setText(journal || ''); }, [journal]);

  function handleBlur() { onJournalChange(pillar.id, text); }

  return (
    <div style={{
      background: done ? 'rgba(15,15,13,.95)' : 'var(--surface)',
      border:`1px solid ${done ? pillar.color+'55' : 'var(--border)'}`,
      padding:'1.2rem',position:'relative',
      opacity: disabled ? .35 : 1,
      transition:'all .3s',
      boxShadow: done ? `0 0 18px ${pillar.color}18` : 'none',
    }}>
      <div style={{position:'absolute',bottom:0,left:0,width:done?'100%':'0%',height:'2px',background:pillar.color,transition:'width .6s ease'}}/>
      <div style={{display:'flex',alignItems:'flex-start',gap:'.8rem',marginBottom:'.8rem'}}>
        <div style={{width:'36px',height:'36px',background:pillar.color+'1a',border:`1px solid ${pillar.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
          {pillar.icon}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'var(--fd)',fontSize:'1.1rem',letterSpacing:'.08em',color:done?pillar.color:'var(--white)',transition:'color .3s'}}>{pillar.name}</div>
          <div style={{fontSize:'.58rem',color:'var(--muted)',letterSpacing:'.1em',marginTop:'.1rem'}}>{pillar.hours}h · {pillar.description}</div>
        </div>
        <button onClick={() => !disabled && onToggle(pillar.id)} disabled={disabled} style={{
          width:'28px',height:'28px',background:done?pillar.color:'transparent',
          border:`1px solid ${done?pillar.color:'var(--border2)'}`,
          cursor:disabled?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',
          flexShrink:0,transition:'all .2s',color:done?'var(--bg)':'var(--muted)',fontSize:'.75rem',
        }}>{done?'✓':'○'}</button>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={()=>setShowJ(!showJ)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'.56rem',letterSpacing:'.18em',textTransform:'uppercase',cursor:'pointer',fontFamily:'var(--fm)',padding:0,transition:'color .2s'}}>
          {showJ?'↑ Close':'↓ Journal'}{journal?' ·':''}
        </button>
        <button onClick={()=>onOpenArchive(pillar)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'.54rem',letterSpacing:'.14em',textTransform:'uppercase',cursor:'pointer',fontFamily:'var(--fm)',padding:0}}>
          Archive ↗
        </button>
      </div>
      {showJ && (
        <div style={{animation:'fadeUp .2s ease'}}>
          <textarea className="ta" placeholder="How did this session go..."
            value={text} onChange={e=>setText(e.target.value)} onBlur={handleBlur}
            style={{marginTop:'.4rem'}}/>
        </div>
      )}
    </div>
  );
}

// ── ARCHIVE MODAL ─────────────────────────────────────────
function ArchiveModal({ pillar, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPillarArchive(pillar.id).then(data => {
      setEntries(data.entries || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [pillar.id]);

  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <div style={{fontFamily:'var(--fd)',fontSize:'1.2rem',letterSpacing:'.1em',color:pillar.color}}>{pillar.icon} {pillar.name} Archive</div>
            <div style={{fontSize:'.56rem',color:'var(--muted)',marginTop:'.2rem',letterSpacing:'.14em'}}>{entries.length} entries</div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-bd">
          {loading ? <div className="spinner"/> : entries.length === 0 ? (
            <div style={{color:'var(--muted)',fontStyle:'italic',fontFamily:'var(--fs)',fontSize:'.9rem'}}>No entries yet. Your archive builds as you write.</div>
          ) : entries.map(e => (
            <div key={e.id} style={{marginBottom:'1.4rem',paddingBottom:'1.4rem',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'.56rem',color:'var(--muted)',letterSpacing:'.18em',marginBottom:'.4rem'}}>{e.log_date}</div>
              <div style={{fontFamily:'var(--fs)',fontStyle:'italic',fontSize:'.95rem',color:'var(--white)',lineHeight:1.75}}>{e.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VOID MODAL ────────────────────────────────────────────
function VoidModal({ onSelect, onClose }) {
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" style={{maxWidth:'360px'}} onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div style={{fontFamily:'var(--fd)',fontSize:'1.2rem',letterSpacing:'.1em'}}>Mark Void Day</div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-bd">
          <div style={{fontSize:'.62rem',color:'var(--muted)',marginBottom:'1rem',lineHeight:1.6}}>This day will be permanently marked. Choose your reason honestly.</div>
          {VOID_REASONS.map(r => (
            <button key={r} onClick={()=>onSelect(r)} style={{
              display:'block',width:'100%',background:'none',border:'1px solid var(--border)',
              color:'var(--white)',fontFamily:'var(--fm)',fontSize:'.68rem',letterSpacing:'.14em',
              padding:'.75rem 1rem',cursor:'pointer',textAlign:'left',marginBottom:'.4rem',
              transition:'all .2s',textTransform:'uppercase',
            }}
            onMouseEnter={e=>{e.target.style.borderColor='var(--red-bright)';e.target.style.color='var(--red-bright)';}}
            onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--white)';}}>
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────
function Landing({ onNav }) {
  return (
    <div className="page">
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 2rem',maxWidth:'900px',margin:'0 auto',position:'relative'}}>
        <div style={{position:'absolute',right:'-2rem',top:'50%',transform:'translateY(-50%)',fontFamily:'var(--fd)',fontSize:'clamp(6rem,18vw,14rem)',color:'rgba(200,168,75,0.03)',letterSpacing:'.05em',userSelect:'none',pointerEvents:'none',lineHeight:1}}>365</div>
        <div className="fu" style={{fontSize:'.58rem',letterSpacing:'.38em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1.4rem'}}>Personal Operating System</div>
        <h1 className="fu1" style={{fontFamily:'var(--fd)',fontSize:'clamp(3.5rem,11vw,8.5rem)',letterSpacing:'.08em',lineHeight:.9,marginBottom:'1.8rem'}}>
          365<span style={{color:'var(--gold)'}}>SYSTEM</span>
        </h1>
        <p className="fu2" style={{fontFamily:'var(--fs)',fontSize:'clamp(1.1rem,2.8vw,1.7rem)',fontStyle:'italic',color:'var(--muted2)',marginBottom:'2.8rem',maxWidth:'480px',lineHeight:1.55}}>
          Everyone has goals.<br/><span style={{color:'var(--white)'}}>Few have systems.</span>
        </p>
        <div className="fu3" style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          <button className="btn-p" onClick={()=>onNav('signup')}>Start Your System</button>
          <button className="btn-g" onClick={()=>onNav('login')}>Sign In</button>
        </div>
        <div className="fu4" style={{marginTop:'3.5rem',display:'flex',gap:'2.5rem',flexWrap:'wrap'}}>
          {[{n:'365',l:'Days in a system'},{n:'6',l:'Pillars maximum'},{n:'1',l:'Version of you'}].map(s=>(
            <div key={s.n}>
              <div style={{fontFamily:'var(--fd)',fontSize:'2.2rem',color:'var(--gold)',letterSpacing:'.05em'}}>{s.n}</div>
              <div style={{fontSize:'.56rem',color:'var(--muted)',letterSpacing:'.18em',textTransform:'uppercase'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{borderTop:'1px solid var(--border)',padding:'4.5rem 2rem',background:'var(--surface)'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{fontSize:'.56rem',letterSpacing:'.32em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'2.8rem'}}>How it works</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'2rem'}}>
            {[
              {step:'01',title:'Define Your System',desc:'Write your why. Set up to 6 pillars — the non-negotiable areas of your life.'},
              {step:'02',title:'Show Up Daily',desc:'Log sleep first. It unlocks your day. Mark pillars done. Journal honestly.'},
              {step:'03',title:'Watch the Grid Fill',desc:'365 squares. Each one earned. No shortcuts. No exceptions.'},
            ].map(i=>(
              <div key={i.step}>
                <div style={{fontFamily:'var(--fd)',fontSize:'2.8rem',color:'var(--gold-dim)',letterSpacing:'.1em',marginBottom:'.9rem'}}>{i.step}</div>
                <div style={{fontFamily:'var(--fd)',fontSize:'1.15rem',letterSpacing:'.08em',marginBottom:'.5rem'}}>{i.title}</div>
                <div style={{fontSize:'.68rem',color:'var(--muted2)',lineHeight:1.7}}>{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:'4.5rem 2rem',textAlign:'center'}}>
        <div style={{maxWidth:'560px',margin:'0 auto'}}>
          <p style={{fontFamily:'var(--fs)',fontSize:'clamp(1rem,2.3vw,1.4rem)',fontStyle:'italic',color:'var(--muted2)',lineHeight:1.85,marginBottom:'2rem'}}>
            "This isn't for the motivated. It's for the <span style={{color:'var(--white)'}}>committed</span>. The ones who already know what needs to be done — and just need a system worthy of their discipline."
          </p>
          <button className="btn-p" onClick={()=>onNav('signup')}>Begin Day One</button>
        </div>
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────
function Auth({ mode, onNav, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) { setError('All fields required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      if (mode === 'signup') await api.register(email, password);
      else await api.login(email, password);
      onSuccess();
    } catch(e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="page">
      <div className="sec-sm">
        <div className="fu" style={{marginBottom:'2.2rem'}}>
          <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.7rem'}}>
            {mode==='signup'?'Begin your system':'Return to your system'}
          </div>
          <h2 style={{fontFamily:'var(--fd)',fontSize:'2.4rem',letterSpacing:'.1em'}}>{mode==='signup'?'Create Account':'Sign In'}</h2>
        </div>
        <div className="fu1" style={{display:'flex',flexDirection:'column',gap:'.9rem'}}>
          <div><label className="lbl">Email</label><input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div><label className="lbl">Password</label><input className="inp" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/></div>
          {error && <div style={{fontSize:'.62rem',color:'var(--red-bright)'}}>{error}</div>}
          <button className="btn-p" onClick={handleSubmit} disabled={loading} style={{marginTop:'.4rem'}}>
            {loading ? <span className="spinner"/> : mode==='signup'?'Create Account':'Sign In'}
          </button>
          <div style={{fontSize:'.6rem',color:'var(--muted)',textAlign:'center'}}>
            {mode==='signup'?'Already have an account? ':'No account? '}
            <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={()=>onNav(mode==='signup'?'login':'signup')}>
              {mode==='signup'?'Sign In':'Create one'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [why, setWhy] = useState('');
  const [dayOne, setDayOne] = useState('');
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);
  const [resetHour, setResetHour] = useState(0);
  const [newP, setNewP] = useState({name:'',hours:1,description:'',icon:'⚡',color:PILLAR_COLORS[0]});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleComplete() {
    setLoading(true); setError('');
    try {
      await api.onboard({ why, day_one: dayOne, pillars, reset_hour: resetHour, start_date: getToday() });
      onComplete();
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function addPillar() {
    if (!newP.name || pillars.length >= 6) return;
    setPillars([...pillars, {...newP, id: Date.now().toString()}]);
    setNewP({name:'',hours:1,description:'',icon:'⚡',color:PILLAR_COLORS[pillars.length % PILLAR_COLORS.length]});
  }

  const steps = [{n:1,l:'Your Why'},{n:2,l:'Pillars'},{n:3,l:'Reset Time'}];

  return (
    <div className="page">
      <div className="sec-sm">
        <div style={{display:'flex',gap:'.4rem',marginBottom:'2.8rem'}}>
          {steps.map(s=>(
            <div key={s.n} style={{flex:1}}>
              <div style={{height:'2px',background:step>=s.n?'var(--gold)':'var(--border)',transition:'background .3s',marginBottom:'.35rem'}}/>
              <div style={{fontSize:'.52rem',color:step>=s.n?'var(--gold)':'var(--muted)',letterSpacing:'.14em'}}>{s.n}. {s.l}</div>
            </div>
          ))}
        </div>

        {step===1 && (
          <div className="fi">
            <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.7rem'}}>The foundation</div>
            <h2 style={{fontFamily:'var(--fd)',fontSize:'2.1rem',letterSpacing:'.1em',marginBottom:'.4rem'}}>Why Are You Here?</h2>
            <p style={{fontSize:'.68rem',color:'var(--muted2)',lineHeight:1.7,marginBottom:'1.8rem'}}>Write your reason. This is for you only.</p>
            <div style={{marginBottom:'1.2rem'}}>
              <label className="lbl">Your Why</label>
              <textarea className="inp ta" style={{border:'1px solid var(--border)',minHeight:'90px',padding:'.8rem 1rem',fontFamily:'var(--fs)',fontSize:'1rem',fontStyle:'italic'}}
                placeholder="I want to build a life that..." value={why} onChange={e=>setWhy(e.target.value)}/>
            </div>
            <div style={{marginBottom:'1.8rem'}}>
              <label className="lbl">Who Are You Today? (locked forever)</label>
              <textarea className="inp ta" style={{border:'1px solid var(--border)',minHeight:'75px',padding:'.8rem 1rem',fontFamily:'var(--fs)',fontSize:'1rem',fontStyle:'italic'}}
                placeholder="Right now I am..." value={dayOne} onChange={e=>setDayOne(e.target.value)}/>
            </div>
            <button className="btn-p" onClick={()=>why&&setStep(2)} style={{opacity:why?1:.4}}>Continue →</button>
          </div>
        )}

        {step===2 && (
          <div className="fi">
            <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.7rem'}}>Your architecture</div>
            <h2 style={{fontFamily:'var(--fd)',fontSize:'2.1rem',letterSpacing:'.1em',marginBottom:'.4rem'}}>Define Your Pillars</h2>
            <p style={{fontSize:'.68rem',color:'var(--muted2)',lineHeight:1.7,marginBottom:'1.8rem'}}>Maximum 6. Choose carefully.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'.4rem',marginBottom:'1.2rem'}}>
              {pillars.map(p=>(
                <div key={p.id} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.75rem 1rem',background:'var(--surface2)',border:'1px solid var(--border)'}}>
                  <div style={{width:'8px',height:'8px',background:p.color,borderRadius:'50%',flexShrink:0}}/>
                  <div style={{fontFamily:'var(--fd)',fontSize:'.95rem',letterSpacing:'.07em',flex:1}}>{p.icon} {p.name}</div>
                  <div style={{fontSize:'.58rem',color:'var(--muted)'}}>{p.hours}h</div>
                  <button onClick={()=>setPillars(pillars.filter(x=>x.id!==p.id))} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'1rem'}}>×</button>
                </div>
              ))}
            </div>
            {pillars.length < 6 && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.4rem',marginBottom:'1rem'}}>
                <input className="inp" placeholder="Name" value={newP.name} onChange={e=>setNewP({...newP,name:e.target.value})}/>
                <input className="inp" type="number" placeholder="Hours" min=".5" max="12" step=".5" value={newP.hours} onChange={e=>setNewP({...newP,hours:parseFloat(e.target.value)})}/>
                <input className="inp" placeholder="Description" value={newP.description} onChange={e=>setNewP({...newP,description:e.target.value})} style={{gridColumn:'1/-1'}}/>
                <div style={{display:'flex',gap:'.35rem',gridColumn:'1/-1'}}>
                  {PILLAR_COLORS.map(c=><div key={c} onClick={()=>setNewP({...newP,color:c})} style={{width:'18px',height:'18px',background:c,cursor:'pointer',borderRadius:'50%',border:newP.color===c?'2px solid var(--white)':'2px solid transparent'}}/>)}
                </div>
                <button className="btn-g" onClick={addPillar} style={{gridColumn:'1/-1'}}>+ Add Pillar ({pillars.length}/6)</button>
              </div>
            )}
            <div style={{display:'flex',gap:'.7rem'}}>
              <button className="btn-g" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn-p" onClick={()=>setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="fi">
            <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.7rem'}}>Final step</div>
            <h2 style={{fontFamily:'var(--fd)',fontSize:'2.1rem',letterSpacing:'.1em',marginBottom:'.4rem'}}>When Does Your Day Reset?</h2>
            <p style={{fontSize:'.68rem',color:'var(--muted2)',lineHeight:1.7,marginBottom:'1.8rem'}}>Journal locks and a new day begins at this hour.</p>
            <div style={{marginBottom:'1.8rem'}}>
              <label className="lbl">Day Resets At</label>
              <select className="inp" value={resetHour} onChange={e=>setResetHour(parseInt(e.target.value))}>
                {Array.from({length:24},(_,i)=>(
                  <option key={i} value={i}>{String(i).padStart(2,'0')}:00{i===0?' — Midnight':i===5?' — Early Bird':''}</option>
                ))}
              </select>
            </div>
            <div className="card" style={{marginBottom:'1.8rem'}}>
              <div className="lbl">Your System</div>
              <div style={{fontFamily:'var(--fs)',fontStyle:'italic',color:'var(--gold)',marginBottom:'.5rem',fontSize:'1rem'}}>"{why}"</div>
              <div style={{fontSize:'.62rem',color:'var(--muted2)'}}>{pillars.length} pillars · Resets at {String(resetHour).padStart(2,'0')}:00</div>
            </div>
            {error && <div style={{fontSize:'.62rem',color:'var(--red-bright)',marginBottom:'.8rem'}}>{error}</div>}
            <div style={{display:'flex',gap:'.7rem'}}>
              <button className="btn-g" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn-p" onClick={handleComplete} disabled={loading}>
                {loading?<span className="spinner"/>:'Begin Day One →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────
function Dashboard({ user, onRefresh }) {
  const today = getToday();
  const [todayData, setTodayData] = useState({done:[], void_reason:null});
  const [journals, setJournals] = useState({});
  const [history, setHistory] = useState({});
  const [archivePillar, setArchivePillar] = useState(null);
  const [showVoid, setShowVoid] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const startDate = new Date(user.start_date);
  const dayNum = Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  const pillars = user.pillars || [];
  const sleepPillar = pillars[0];
  const isSleepDone = todayData.done.includes(sleepPillar?.id);

  useEffect(() => {
    Promise.all([
      api.getDaily(today),
      api.getDayJournals(today),
      api.getDailyRange(user.start_date, today),
    ]).then(([daily, jrnls, hist]) => {
      setTodayData(daily);
      setJournals(jrnls);
      setHistory(hist);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [today, user.start_date]);

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(''), 2500); }

  async function handleToggle(pillarId) {
    const newDone = todayData.done.includes(pillarId)
      ? todayData.done.filter(x=>x!==pillarId)
      : [...todayData.done, pillarId];
    const updated = {...todayData, done: newDone};
    setTodayData(updated);
    setHistory(h => ({...h, [today]: updated}));
    try {
      await api.saveDaily({log_date: today, done: newDone, void_reason: todayData.void_reason});
      if (!todayData.done.includes(pillarId)) showToast(`${pillars.find(p=>p.id===pillarId)?.name} complete`);
    } catch(e) { showToast('Failed to save'); }
  }

  async function handleJournalChange(pillarId, text) {
    setJournals(j => ({...j, [pillarId]: {...(j[pillarId]||{}), content: text}}));
    try { await api.saveJournal({log_date: today, pillar_id: pillarId, content: text}); }
    catch(e) { console.error(e); }
  }

  async function handleVoid(reason) {
    const updated = {...todayData, done: [], void_reason: reason};
    setTodayData(updated);
    setHistory(h => ({...h, [today]: updated}));
    setShowVoid(false);
    try {
      await api.saveDaily({log_date: today, done: [], void_reason: reason});
      showToast(`Void day — ${reason}`);
    } catch(e) { showToast('Failed to save'); }
  }

  function getPillarStreak(pillarId) {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0,10);
      const dd = history[key];
      if (dd && dd.done && dd.done.includes(pillarId)) { streak++; d.setDate(d.getDate()-1); }
      else break;
    }
    return streak;
  }

  if (loading) return <div className="page"><div className="loading-full"><div className="spinner"/><div style={{fontSize:'.62rem',color:'var(--muted)',letterSpacing:'.2em'}}>LOADING</div></div></div>;

  const doneCount = todayData.done.length;

  return (
    <div className="page" style={{paddingBottom:'4rem'}}>
      <div className="sec">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2.8rem'}}>
          <div className="fu">
            <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'.25rem'}}>
              {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
            </div>
            <h1 style={{fontFamily:'var(--fd)',fontSize:'clamp(2rem,6vw,3.8rem)',letterSpacing:'.08em',lineHeight:1}}>
              Day <span style={{color:'var(--gold)'}}>{dayNum}</span>
            </h1>
            <div style={{fontFamily:'var(--fs)',fontStyle:'italic',color:'var(--muted2)',marginTop:'.4rem',fontSize:'.9rem',maxWidth:'400px'}}>
              {user.why}
            </div>
          </div>
          <div className="fu1" style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--fd)',fontSize:'2.4rem',color:doneCount===pillars.length?'var(--gold)':'var(--white)',letterSpacing:'.05em',animation:doneCount===pillars.length?'glowPulse 2s infinite':'none'}}>
              {doneCount}<span style={{color:'var(--muted)',fontSize:'1.4rem'}}>/{pillars.length}</span>
            </div>
            <div style={{fontSize:'.54rem',color:'var(--muted)',letterSpacing:'.18em'}}>
              {doneCount===pillars.length?'COMPLETE':!isSleepDone?'LOG SLEEP FIRST':'IN PROGRESS'}
            </div>
            {!todayData.void_reason
              ? <button className="btn-d" style={{marginTop:'.5rem'}} onClick={()=>setShowVoid(true)}>Void Day</button>
              : <div style={{fontSize:'.54rem',color:'var(--red-bright)',marginTop:'.5rem',letterSpacing:'.14em'}}>VOID · {todayData.void_reason?.toUpperCase()}</div>
            }
          </div>
        </div>

        {!isSleepDone && (
          <div className="fu" style={{background:'rgba(74,106,156,0.08)',border:'1px solid rgba(74,106,156,0.25)',padding:'.75rem 1.1rem',marginBottom:'1.8rem',fontSize:'.62rem',color:'#6a8abc',letterSpacing:'.1em'}}>
            ↑ Log your sleep first to unlock today's pillars.
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'2rem'}}>
          <div>
            <div className="lbl" style={{marginBottom:'.9rem'}}>Today's Pillars</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
              {pillars.map((p,i)=>(
                <div key={p.id} style={{animation:`fadeUp .4s ${i*.07}s ease both`}}>
                  <PillarCard
                    pillar={p}
                    done={todayData.done.includes(p.id)}
                    journal={journals[p.id]?.content || ''}
                    onToggle={handleToggle}
                    onJournalChange={handleJournalChange}
                    onOpenArchive={setArchivePillar}
                    disabled={!isSleepDone && p.id !== sleepPillar?.id}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'1.4rem'}}>
            <div>
              <div className="lbl" style={{marginBottom:'.7rem',display:'flex',justifyContent:'space-between'}}>
                <span>Year Grid</span>
                <span style={{color:'var(--gold-dim)'}}>Day {dayNum}/365</span>
              </div>
              <YearGrid history={history} pillars={pillars} startDate={user.start_date}/>
              <div style={{display:'flex',gap:'.8rem',marginTop:'.7rem',fontSize:'.5rem',color:'var(--muted)',letterSpacing:'.08em'}}>
                <span>□ Empty</span><span style={{color:'var(--gold-dim)'}}>▪ Partial</span>
                <span style={{color:'var(--gold)'}}>■ Full</span><span style={{color:'var(--red-bright)'}}>□ Void</span>
              </div>
            </div>

            <div>
              <div className="lbl" style={{marginBottom:'.7rem'}}>Pillar Streaks</div>
              <div style={{display:'flex',flexDirection:'column',gap:'.35rem'}}>
                {pillars.map(p=>{
                  const s = getPillarStreak(p.id);
                  return (
                    <div key={p.id} style={{display:'flex',alignItems:'center',gap:'.55rem'}}>
                      <div style={{width:'6px',height:'6px',background:p.color,borderRadius:'50%',flexShrink:0}}/>
                      <div style={{fontSize:'.62rem',flex:1,color:'var(--muted2)'}}>{p.name}</div>
                      <div style={{fontFamily:'var(--fd)',fontSize:'.95rem',color:s>0?p.color:'var(--muted)',letterSpacing:'.05em'}}>{s}</div>
                      <div style={{fontSize:'.48rem',color:'var(--muted)',letterSpacing:'.08em'}}>days</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {archivePillar && <ArchiveModal pillar={archivePillar} onClose={()=>setArchivePillar(null)}/>}
      {showVoid && <VoidModal onSelect={handleVoid} onClose={()=>setShowVoid(false)}/>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────
function Profile({ user }) {
  const dayNum = Math.max(1, Math.floor((new Date() - new Date(user.start_date)) / 86400000) + 1);
  return (
    <div className="page">
      <div className="sec-sm">
        <div className="fu" style={{marginBottom:'2.8rem'}}>
          <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.5rem'}}>Your System</div>
          <h2 style={{fontFamily:'var(--fd)',fontSize:'2.4rem',letterSpacing:'.1em'}}>Profile</h2>
        </div>
        <div className="fu1" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1px',background:'var(--border)',marginBottom:'1.8rem'}}>
          {[{l:'Day',v:dayNum},{l:'Pillars',v:(user.pillars||[]).length},{l:'Started',v:user.start_date}].map(s=>(
            <div key={s.l} style={{background:'var(--surface)',padding:'1.1rem',textAlign:'center'}}>
              <div style={{fontFamily:'var(--fd)',fontSize:'1.8rem',color:'var(--gold)',letterSpacing:'.05em'}}>{s.v}</div>
              <div style={{fontSize:'.52rem',color:'var(--muted)',letterSpacing:'.18em',textTransform:'uppercase'}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="fu2 card" style={{marginBottom:'1.2rem'}}>
          <label className="lbl">Your Why</label>
          <div style={{fontFamily:'var(--fs)',fontStyle:'italic',fontSize:'1.05rem',color:'var(--white)',lineHeight:1.75}}>"{user.why}"</div>
        </div>
        <div className="fu3 card" style={{marginBottom:'1.2rem'}}>
          <label className="lbl">Day One Snapshot — {user.start_date} · Locked Forever</label>
          <div style={{fontFamily:'var(--fs)',fontStyle:'italic',fontSize:'.9rem',color:'var(--muted2)',lineHeight:1.75}}>{user.day_one || 'No snapshot recorded.'}</div>
        </div>
        <div className="fu4">
          <label className="lbl" style={{marginBottom:'.7rem'}}>Your Pillars</label>
          <div style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
            {(user.pillars||[]).map(p=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.75rem 1rem',background:'var(--surface)',border:'1px solid var(--border)'}}>
                <div style={{width:'7px',height:'7px',background:p.color,borderRadius:'50%'}}/>
                <div style={{fontFamily:'var(--fd)',fontSize:'.95rem',letterSpacing:'.07em',flex:1}}>{p.icon} {p.name}</div>
                <div style={{fontSize:'.58rem',color:'var(--muted)'}}>{p.hours}h/day</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────
function Settings({ user, onUpdate, onLogout }) {
  const [resetHour, setResetHour] = useState(user.reset_hour || 0);
  const [pillars, setPillars] = useState(user.pillars || []);
  const [newP, setNewP] = useState({name:'',hours:1,description:'',icon:'⚡',color:PILLAR_COLORS[0]});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const updated = await api.updateSettings({why: user.why, reset_hour: resetHour, pillars});
      onUpdate(updated);
      setSaved(true); setTimeout(()=>setSaved(false), 2000);
    } catch(e) {} finally { setLoading(false); }
  }

  function addPillar() {
    if (!newP.name || pillars.length >= 6) return;
    setPillars([...pillars, {...newP, id: Date.now().toString()}]);
    setNewP({name:'',hours:1,description:'',icon:'⚡',color:PILLAR_COLORS[pillars.length % PILLAR_COLORS.length]});
  }

  return (
    <div className="page">
      <div className="sec-sm">
        <div className="fu" style={{marginBottom:'2.8rem'}}>
          <div style={{fontSize:'.56rem',letterSpacing:'.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.5rem'}}>Configuration</div>
          <h2 style={{fontFamily:'var(--fd)',fontSize:'2.4rem',letterSpacing:'.1em'}}>Settings</h2>
        </div>
        <div className="fu1" style={{marginBottom:'1.8rem'}}>
          <label className="lbl">Day Resets At</label>
          <select className="inp" value={resetHour} onChange={e=>setResetHour(parseInt(e.target.value))}>
            {Array.from({length:24},(_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
          </select>
        </div>
        <div className="divider"/>
        <div className="fu2" style={{marginBottom:'1.8rem'}}>
          <label className="lbl" style={{marginBottom:'.7rem'}}>Pillars ({pillars.length}/6)</label>
          <div style={{display:'flex',flexDirection:'column',gap:'.4rem',marginBottom:'.9rem'}}>
            {pillars.map(p=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.75rem 1rem',background:'var(--surface2)',border:'1px solid var(--border)'}}>
                <div style={{width:'7px',height:'7px',background:p.color,borderRadius:'50%'}}/>
                <div style={{fontFamily:'var(--fd)',fontSize:'.9rem',letterSpacing:'.07em',flex:1}}>{p.icon} {p.name}</div>
                <div style={{fontSize:'.58rem',color:'var(--muted)'}}>{p.hours}h</div>
                <button onClick={()=>setPillars(pillars.filter(x=>x.id!==p.id))} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'1rem'}}>×</button>
              </div>
            ))}
          </div>
          {pillars.length < 6 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.4rem'}}>
              <input className="inp" placeholder="Name" value={newP.name} onChange={e=>setNewP({...newP,name:e.target.value})}/>
              <input className="inp" type="number" placeholder="Hours" min=".5" max="12" step=".5" value={newP.hours} onChange={e=>setNewP({...newP,hours:parseFloat(e.target.value)})}/>
              <input className="inp" placeholder="Description" value={newP.description} onChange={e=>setNewP({...newP,description:e.target.value})} style={{gridColumn:'1/-1'}}/>
              <div style={{display:'flex',gap:'.35rem',gridColumn:'1/-1'}}>
                {PILLAR_COLORS.map(c=><div key={c} onClick={()=>setNewP({...newP,color:c})} style={{width:'17px',height:'17px',background:c,cursor:'pointer',borderRadius:'50%',border:newP.color===c?'2px solid var(--white)':'2px solid transparent'}}/>)}
              </div>
              <button className="btn-g" onClick={addPillar} style={{gridColumn:'1/-1'}}>+ Add Pillar</button>
            </div>
          )}
        </div>
        <div className="divider"/>
        <div className="fu3" style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
          <button className="btn-p" onClick={handleSave} disabled={loading}>
            {loading?<span className="spinner"/>:saved?'✓ Saved':'Save Changes'}
          </button>
          <button className="btn-d" onClick={onLogout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getMe().then(u => {
        setUser(u);
        setPage(u.onboarded ? 'dashboard' : 'onboarding');
      }).catch(() => {
        setPage('landing');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function handleAuthSuccess() {
    const u = await api.getMe();
    setUser(u);
    setPage(u.onboarded ? 'dashboard' : 'onboarding');
  }

  async function handleOnboardComplete() {
    const u = await api.getMe();
    setUser(u);
    setPage('dashboard');
  }

  function handleLogout() {
    api.logout();
    setUser(null);
    setPage('landing');
  }

  function handleUserUpdate(updatedUser) {
    setUser(updatedUser);
  }

  const loggedIn = !!user && user.onboarded;

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="loading-full" style={{height:'100vh'}}>
        <div className="spinner" style={{width:'32px',height:'32px'}}/>
        <div style={{fontFamily:'var(--fd)',fontSize:'1.4rem',letterSpacing:'.15em',color:'var(--gold)'}}>365SYSTEM</div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={()=>setPage(loggedIn?'dashboard':'landing')}>
          365<span>SYSTEM</span>
        </div>
        <div className="nav-links">
          {loggedIn ? (
            <>
              <button className={`nl ${page==='dashboard'?'active':''}`} onClick={()=>setPage('dashboard')}>Dashboard</button>
              <button className={`nl ${page==='profile'?'active':''}`} onClick={()=>setPage('profile')}>Profile</button>
              <button className={`nl ${page==='settings'?'active':''}`} onClick={()=>setPage('settings')}>Settings</button>
            </>
          ) : (
            <>
              <button className="nl" onClick={()=>setPage('login')}>Sign In</button>
              <button className="btn-p" style={{padding:'.5rem 1.1rem',fontSize:'.58rem'}} onClick={()=>setPage('signup')}>Start</button>
            </>
          )}
        </div>
      </nav>

      {page==='landing' && <Landing onNav={setPage}/>}
      {page==='signup' && <Auth mode="signup" onNav={setPage} onSuccess={handleAuthSuccess}/>}
      {page==='login' && <Auth mode="login" onNav={setPage} onSuccess={handleAuthSuccess}/>}
      {page==='onboarding' && <Onboarding onComplete={handleOnboardComplete}/>}
      {page==='dashboard' && loggedIn && <Dashboard user={user} onRefresh={handleOnboardComplete}/>}
      {page==='profile' && loggedIn && <Profile user={user}/>}
      {page==='settings' && loggedIn && <Settings user={user} onUpdate={handleUserUpdate} onLogout={handleLogout}/>}
    </>
  );
}
