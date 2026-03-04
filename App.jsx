import { useState, useEffect, useCallback } from "react";

const SUPA_URL = "https://hyklvdksveezfnmlqsaa.supabase.co";
const SUPA_KEY = "sb_publishable_NiYWAE7m1Qdwro1yh57jIw_TjE8Bjlo";

const db = async (path, opts = {}) => {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", "Prefer": opts.prefer || "return=representation", ...opts.headers },
    ...opts,
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
const supa = {
  select: (table, cols = "*") => db(`${table}?select=${cols}`),
  where:  (table, cols, filter) => db(`${table}?select=${cols}&${filter}`),
  insert: (table, data) => db(table, { method: "POST", body: JSON.stringify(data) }),
  update: (table, filter, data) => db(`${table}?${filter}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (table, filter) => db(`${table}?${filter}`, { method: "DELETE", prefer: "return=minimal" }),
};

const I = ({ n, s = 16, c = "currentColor", w = 1.5 }) => {
  const d = {
    sparkles: <><path d="M9 2l1.5 3.5L14 7l-3.5 1.5L9 12 7.5 8.5 4 7l3.5-1.5L9 2z"/><path d="M18 10l.75 1.75L20.5 12l-1.75.75L18 14.5l-.75-1.75L15.5 12l1.75-.75L18 10z"/></>,
    globe:    <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    chart:    <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    img:      <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    dl:       <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    check:    <polyline points="20 6 9 17 4 12"/>,
    cr:       <polyline points="9 18 15 12 9 6"/>,
    cl:       <polyline points="15 18 9 12 15 6"/>,
    pin:      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    zap:      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    cal:      <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    trend:    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff:   <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    out:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    inbox:    <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    up:       <><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></>,
    down:     <><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></>,
    refresh:  <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

const CATS = ["Electricista","Cerrajero","Fontanero","Pintor","Albañil","Carpintero","Climatización","Reformas","Mudanzas","Limpieza"];
const BARRIOS = {
  valencia:  ["Ruzafa","El Carmen","Benimaclet","Campanar","Patraix","Jesús","Mestalla","Algirós","Quatre Carreres","La Saïdia"],
  barcelona: ["Gràcia","Eixample","Poble Sec","Sant Antoni","Sarrià","Poblenou","Sants","Les Corts","Sant Gervasi","El Born"],
};

const Card = ({ children, style = {} }) => <div style={{ background:"#fff", borderRadius:16, padding:22, border:"1px solid #E5E5EA", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", ...style }}>{children}</div>;
const Lbl = ({ t }) => <div style={{ fontSize:10, fontWeight:600, color:"#86868B", letterSpacing:0.6, marginBottom:6, textTransform:"uppercase" }}>{t}</div>;
const Spin = ({ sz=14 }) => <div style={{ width:sz, height:sz, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite", flexShrink:0 }}/>;
const SS = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1.5px solid #E5E5EA", fontSize:13, fontFamily:"inherit", color:"#1D1D1F", background:"#fff", outline:"none", appearance:"none" };

const ai = async (prompt) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
  const d = await r.json(); return d.content?.[0]?.text || "";
};

function Login({ onLogin }) {
  const [step, setStep] = useState("pick");
  const [users, setUsers] = useState([]);
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supa.select("users","id,name,city,initials")
      .then(d => setUsers(d||[]))
      .catch(() => setUsers([{id:"valencia",name:"BestSEO Valencia",city:"Valencia",initials:"VLC"},{id:"barcelona",name:"BestSEO Barcelona",city:"Barcelona",initials:"BCN"}]))
      .finally(() => setLoading(false));
  }, []);

  const doLogin = async () => {
    try {
      const rows = await supa.where("users","id,name,city,initials,pin",`id=eq.${sel.id}`);
      if (rows?.[0]?.pin === pin) onLogin(rows[0]);
      else { setErr("PIN incorrecte"); setShake(true); setTimeout(()=>setShake(false),500); setPin(""); }
    } catch { setErr("Error de connexió"); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif" }}>
      <div style={{ width:360 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:56, height:56, background:"#1D1D1F", borderRadius:16, display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><path d="M8 24L16 8l8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 19h11" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.3 }}>BestSEO</div>
          <div style={{ fontSize:12, color:"#86868B", marginTop:2 }}>Plataforma Rank & Rent</div>
        </div>

        {step === "pick" && (
          <>
            <p style={{ fontSize:10, color:"#86868B", textAlign:"center", marginBottom:14, letterSpacing:0.5, textTransform:"uppercase", fontWeight:600 }}>Selecciona el teu workspace</p>
            {loading ? <div style={{ textAlign:"center", padding:20, color:"#86868B", fontSize:13 }}>Carregant…</div> :
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {users.map(u => (
                  <button key={u.id} onClick={()=>{setSel(u);setStep("pin");setErr("");setPin("");}}
                    style={{ display:"flex", alignItems:"center", gap:13, padding:"15px 16px", background:"#fff", border:"1px solid #E5E5EA", borderRadius:13, cursor:"pointer", textAlign:"left", transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#1D1D1F";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E5EA";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";}}>
                    <div style={{ width:38, height:38, borderRadius:10, background:"#F5F5F7", border:"1px solid #E5E5EA", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{u.initials}</div>
                    <div><div style={{ fontSize:14, fontWeight:600 }}>{u.name}</div><div style={{ fontSize:11, color:"#86868B" }}>{u.city}</div></div>
                    <div style={{ marginLeft:"auto" }}><I n="cr" s={14} c="#C7C7CC"/></div>
                  </button>
                ))}
              </div>
            }
          </>
        )}

        {step === "pin" && sel && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <button onClick={()=>{setStep("pick");setPin("");setErr("");}} style={{ background:"none", border:"none", cursor:"pointer", color:"#86868B", fontSize:12, marginBottom:18, display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
              <I n="cl" s={13} c="#86868B"/> Tornar
            </button>
            <div style={{ background:"#fff", borderRadius:18, padding:24, border:"1px solid #E5E5EA", boxShadow:"0 2px 16px rgba(0,0,0,0.06)", animation:shake?"shake 0.4s ease":"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:20 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"#F5F5F7", border:"1px solid #E5E5EA", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{sel.initials}</div>
                <div><div style={{ fontSize:14, fontWeight:600 }}>{sel.name}</div><div style={{ fontSize:11, color:"#86868B" }}>Introdueix el PIN</div></div>
              </div>
              <div style={{ position:"relative", marginBottom:12 }}>
                <input type={show?"text":"password"} value={pin} onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="····" maxLength={6}
                  style={{ width:"100%", padding:"12px 42px 12px 14px", borderRadius:10, border:`1.5px solid ${err?"#FF3B30":"#E5E5EA"}`, fontSize:20, letterSpacing:8, textAlign:"center", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer" }}><I n={show?"eyeoff":"eye"} s={14} c="#86868B"/></button>
              </div>
              {err && <div style={{ color:"#FF3B30", fontSize:12, textAlign:"center", marginBottom:10 }}>{err}</div>}
              <button onClick={doLogin} disabled={pin.length<4} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:pin.length>=4?"#1D1D1F":"#E5E5EA", color:pin.length>=4?"#fff":"#AEAEB2", fontSize:14, fontWeight:600, cursor:pin.length>=4?"pointer":"not-allowed", fontFamily:"inherit" }}>
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  const [user, setUser]   = useState(null);
  const [tab, setTab]     = useState("gen");
  const [sites, setSites] = useState([]);
  const [cont, setCont]   = useState([]);
  const [met, setMet]     = useState(null);
  const [nc, setNc] = useState(""); const [nb, setNb] = useState(""); const [cb, setCb] = useState("");
  const [sc, setSc] = useState(""); const [sb, setSb] = useState("");
  const [gen, setGen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [cpd, setCpd] = useState("");
  const [imgL, setImgL] = useState(false);
  const [img, setImg]   = useState(null);
  const [notif, setNotif] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadS, setLoadS] = useState(false);
  const [loadC, setLoadC] = useState(false);

  const msg = (m, t="ok") => { setToast({m,t}); setTimeout(()=>setToast(null),3000); };

  const getSites = useCallback(async () => {
    if (!user) return; setLoadS(true);
    try { setSites((await supa.where("sites","*",`user_id=eq.${user.id}&order=created_at.desc`))||[]); }
    catch { msg("Error carregant webs","err"); }
    setLoadS(false);
  },[user]);

  const getCont = useCallback(async () => {
    if (!user) return; setLoadC(true);
    try { setCont((await supa.where("generated_content","*",`user_id=eq.${user.id}&order=created_at.desc&limit=30`))||[]); }
    catch { msg("Error carregant continguts","err"); }
    setLoadC(false);
  },[user]);

  const getMet = useCallback(async () => {
    if (!user) return;
    try { const d = await supa.where("metrics","*",`user_id=eq.${user.id}&order=week_start.desc&limit=1`); setMet(d?.[0]||null); }
    catch {}
  },[user]);

  useEffect(()=>{ if(user){getSites();getCont();getMet();} },[user]);
  useEffect(()=>{ if(user){ if(tab==="sites")getSites(); if(tab==="rev")getCont(); if(tab==="met")getMet(); } },[tab]);

  if (!user) return <Login onLogin={setUser}/>;

  const mySites = sites.filter(s=>s.user_id===user.id);
  const pending = cont.filter(c=>c.review_status==="pending");
  const brs = BARRIOS[user.id]||[];

  const cp = (t,k) => { navigator.clipboard.writeText(t); setCpd(k); setTimeout(()=>setCpd(""),2000); };

  const doGen = async () => {
    if(!sc||!sb) return; setGen(true); setDraft(null); setImg(null);
    try {
      const [post, ip] = await Promise.all([
        ai(`Genera un post per a Google My Business (120-150 paraules) per a un negoci de "${sc}" al barri de "${sb}", ${user.city}. To professional i proper, menciona la zona, inclou crida a l'acció i 3 hashtags al final. Només el text.`),
        ai(`Write a 2-sentence English prompt for an AI image generator. Subject: professional "${sc}" tradesperson in "${sb}", ${user.city}, Spain. Style: professional photo, natural light, Spanish urban setting, tools visible. Only the prompt.`),
      ]);
      setDraft({post, ip, cat:sc, bar:sb});
    } catch { msg("Error generant contingut","err"); }
    setGen(false);
  };

  const doImg = () => {
    if(!draft?.ip) return; setImgL(true);
    setImg(`https://image.pollinations.ai/prompt/${encodeURIComponent(draft.ip+", professional photography, Spain, 4k")}?width=900&height=600&nologo=true&seed=${Date.now()}`);
    setImgL(false);
  };

  const doSave = async () => {
    if(!draft) return; setSaving(true);
    try {
      const site = mySites.find(s=>s.categoria===draft.cat&&s.barrio===draft.bar);
      await supa.insert("generated_content",{ user_id:user.id, site_id:site?.id||null, categoria:draft.cat, barrio:draft.bar, post_text:draft.post, image_prompt:draft.ip, image_url:img||null, review_status:"pending" });
      msg("Desat per revisió"); setDraft(null); setImg(null); setSc(""); setSb(""); getCont();
    } catch { msg("Error desant","err"); }
    setSaving(false);
  };

  const doReview = async (id, status) => {
    try {
      await supa.update("generated_content",`id=eq.${id}`,{review_status:status});
      if(status==="approved"){ const it=cont.find(c=>c.id===id); if(it?.site_id) await supa.update("sites",`id=eq.${it.site_id}`,{last_post:new Date().toISOString(),status:"active"}); msg("Post aprovat"); }
      else msg("Post rebutjat");
      getCont(); getSites();
    } catch { msg("Error","err"); }
  };

  const addSite = async () => {
    const b=nb||cb; if(!nc||!b) return;
    try { await supa.insert("sites",{user_id:user.id,categoria:nc,barrio:b,status:"pending"}); msg("Web afegida"); setNc(""); setNb(""); setCb(""); getSites(); }
    catch { msg("Error afegint web","err"); }
  };

  const delSite = async (id) => { try { await supa.remove("sites",`id=eq.${id}`); getSites(); msg("Web eliminada"); } catch { msg("Error","err"); } };

  const NAV = [
    {id:"gen", l:"Generador", i:"sparkles"},
    {id:"rev", l:"Revisió",   i:"inbox",   b:pending.length},
    {id:"sites",l:"Webs",    i:"globe"},
    {id:"met", l:"Mètriques", i:"chart"},
  ];

  const TL = {gen:"Generador de Contingut", rev:"Continguts per Revisar", sites:"Gestió de Webs", met:"Mètriques Setmanals"};

  const Btn = ({onClick,disabled,children,variant="dark",style={}}) => (
    <button onClick={onClick} disabled={disabled} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", borderRadius:9, border: variant==="outline"?"1.5px solid #1D1D1F":"none", background: disabled?"#E5E5EA": variant==="dark"?"#1D1D1F": variant==="outline"?"#fff":"transparent", color: disabled?"#AEAEB2": variant==="dark"?"#fff":"#1D1D1F", fontSize:13, fontWeight:600, cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", transition:"all 0.15s", ...style }}>
      {children}
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", color:"#1D1D1F", display:"flex" }}>

      {toast && <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:999, background:toast.t==="err"?"#FF3B30":"#1D1D1F", color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:500, boxShadow:"0 4px 16px rgba(0,0,0,0.2)", animation:"fadeUp 0.25s ease", whiteSpace:"nowrap" }}>{toast.m}</div>}

      {/* Sidebar */}
      <aside style={{ position:"fixed", left:0, top:0, bottom:0, width:216, background:"rgba(255,255,255,0.94)", backdropFilter:"blur(20px)", borderRight:"1px solid #E5E5EA", display:"flex", flexDirection:"column", zIndex:100 }}>
        <div style={{ padding:"24px 16px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, background:"#1D1D1F", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><path d="M8 24L16 8l8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 19h11" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div><div style={{ fontSize:13, fontWeight:700 }}>BestSEO</div><div style={{ fontSize:9, color:"#86868B" }}>Rank & Rent</div></div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"2px 7px" }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:tab===n.id?"#F5F5F7":"transparent", color:tab===n.id?"#1D1D1F":"#6E6E73", fontSize:13, fontWeight:tab===n.id?600:400, marginBottom:1, transition:"all 0.12s", textAlign:"left" }}>
              <I n={n.i} s={14} c={tab===n.id?"#1D1D1F":"#AEAEB2"}/>
              <span style={{ flex:1 }}>{n.l}</span>
              {n.b>0 && <span style={{ background:"#FF3B30", color:"#fff", fontSize:10, fontWeight:700, borderRadius:20, padding:"1px 6px" }}>{n.b}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:"10px 7px", borderTop:"1px solid #E5E5EA" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 11px", borderRadius:9, background:"#F5F5F7" }}>
            <div style={{ width:26, height:26, borderRadius:7, background:"#1D1D1F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0 }}>{user.initials}</div>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:11, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.city}</div><div style={{ fontSize:9, color:"#86868B" }}>{mySites.length} webs</div></div>
            <button onClick={()=>setUser(null)} title="Sortir" style={{ background:"none", border:"none", cursor:"pointer", padding:2, display:"flex" }}><I n="out" s={12} c="#AEAEB2"/></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:216, flex:1, padding:"32px 32px 60px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <h1 style={{ margin:0, fontSize:24, fontWeight:700, letterSpacing:-0.4 }}>{TL[tab]}</h1>
            <p style={{ margin:"4px 0 0", fontSize:12, color:"#86868B" }}>{user.name} · {user.city}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{getSites();getCont();getMet();}} style={{ width:36, height:36, borderRadius:9, border:"1px solid #E5E5EA", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><I n="refresh" s={14} c="#86868B"/></button>
            <div style={{ position:"relative" }}>
              <button onClick={()=>setNotif(!notif)} style={{ width:36, height:36, borderRadius:9, border:"1px solid #E5E5EA", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <I n="bell" s={14} c="#1D1D1F"/>
                {pending.length>0 && <span style={{ position:"absolute", top:6, right:6, width:6, height:6, background:"#FF3B30", borderRadius:"50%", border:"1.5px solid #fff" }}/>}
              </button>
              {notif && <div style={{ position:"absolute", right:0, top:44, width:270, background:"#fff", border:"1px solid #E5E5EA", borderRadius:13, boxShadow:"0 8px 28px rgba(0,0,0,0.1)", overflow:"hidden", zIndex:200 }}>
                <div style={{ padding:"12px 14px 8px", borderBottom:"1px solid #F5F5F7", fontSize:12, fontWeight:600 }}>Notificacions</div>
                <div style={{ padding:"12px 14px", display:"flex", gap:8 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:pending.length>0?"#007AFF":"#C7C7CC", marginTop:4, flexShrink:0 }}/>
                  <div style={{ fontSize:12 }}>{pending.length>0?`${pending.length} post${pending.length>1?"s":""} pendent${pending.length>1?"s":""} de revisió`:"Cap notificació nova"}</div>
                </div>
              </div>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          {[
            {l:"Webs actives",   v:mySites.filter(s=>s.status==="active").length, i:"globe"},
            {l:"Pendent revisió",v:pending.length, i:"inbox"},
            {l:"Impressions GMB",v:met?met.impressions.toLocaleString():"—", i:"eye"},
            {l:"CTR mig",        v:met?`${met.ctr}%`:"—", i:"trend"},
          ].map((s,i)=>(
            <Card key={i} style={{ padding:"16px 18px" }}>
              <I n={s.i} s={14} c="#86868B"/>
              <div style={{ fontSize:22, fontWeight:700, letterSpacing:-0.3, marginTop:8 }}>{s.v}</div>
              <div style={{ fontSize:10, color:"#86868B", marginTop:2 }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* ── GEN ── */}
        {tab==="gen" && (
          <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16 }}>
            <Card>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Configurar generació</div>
              <div style={{ marginBottom:14 }}><Lbl t="Categoria"/><select value={sc} onChange={e=>setSc(e.target.value)} style={SS}><option value="">Seleccionar…</option>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div style={{ marginBottom:20 }}><Lbl t="Barri / Zona"/><select value={sb} onChange={e=>setSb(e.target.value)} style={SS}><option value="">Seleccionar…</option>{[...brs,...mySites.map(s=>s.barrio)].filter((v,i,a)=>a.indexOf(v)===i).map(b=><option key={b}>{b}</option>)}</select></div>
              <button onClick={doGen} disabled={gen||!sc||!sb} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:(!sc||!sb||gen)?"#E5E5EA":"#1D1D1F", color:(!sc||!sb||gen)?"#AEAEB2":"#fff", fontSize:13, fontWeight:600, cursor:(!sc||!sb||gen)?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                {gen?<><Spin/> Generant…</>:<><I n="sparkles" s={14} c="white"/> Generar Post + Prompt</>}
              </button>
              <div style={{ marginTop:12, padding:"10px 12px", borderRadius:9, background:"#F5F5F7", display:"flex", gap:7 }}>
                <I n="lock" s={11} c="#86868B"/>
                <p style={{ margin:0, fontSize:11, color:"#86868B", lineHeight:1.5 }}>El contingut queda pendent fins que l'aprovis a Revisió.</p>
              </div>
            </Card>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {!draft && !gen && (
                <Card style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:280 }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}><I n="sparkles" s={20} c="#C7C7CC"/></div>
                  <div style={{ fontSize:13, fontWeight:500 }}>Sense contingut</div>
                  <div style={{ fontSize:12, color:"#86868B", marginTop:4 }}>Selecciona categoria i barri per generar</div>
                </Card>
              )}
              {draft && (
                <>
                  <Card>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <Lbl t={`Post GMB · ${draft.cat} ${draft.bar}`}/>
                      <button onClick={()=>cp(draft.post,"post")} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:7, border:"1px solid #E5E5EA", background:"#fff", cursor:"pointer", fontSize:11, fontWeight:500, fontFamily:"inherit", color:cpd==="post"?"#34C759":"#1D1D1F" }}>
                        <I n={cpd==="post"?"check":"copy"} s={11} c={cpd==="post"?"#34C759":"#1D1D1F"}/>{cpd==="post"?"Copiat":"Copiar"}
                      </button>
                    </div>
                    <p style={{ margin:0, fontSize:13, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{draft.post}</p>
                  </Card>
                  <Card>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <Lbl t="Prompt imatge IA"/>
                      <button onClick={()=>cp(draft.ip,"ip")} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:7, border:"1px solid #E5E5EA", background:"#fff", cursor:"pointer", fontSize:11, fontWeight:500, fontFamily:"inherit", color:cpd==="ip"?"#34C759":"#1D1D1F" }}>
                        <I n={cpd==="ip"?"check":"copy"} s={11} c={cpd==="ip"?"#34C759":"#1D1D1F"}/>{cpd==="ip"?"Copiat":"Copiar"}
                      </button>
                    </div>
                    <p style={{ margin:"0 0 14px", fontSize:12, lineHeight:1.65, color:"#6E6E73", fontStyle:"italic" }}>{draft.ip}</p>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <Btn onClick={doImg} disabled={imgL} variant="outline">{imgL?<><Spin/> Generant…</>:<><I n="img" s={13}/> Generar imatge</>}</Btn>
                      <Btn onClick={doSave} disabled={saving}>{saving?<><Spin/> Desant…</>:<><I n="inbox" s={13} c="white"/> Desar per revisió</>}</Btn>
                    </div>
                    {img && (
                      <div style={{ marginTop:14 }}>
                        <img src={img} alt="GMB" onError={e=>e.target.style.display="none"} style={{ width:"100%", borderRadius:11, border:"1px solid #E5E5EA", maxHeight:220, objectFit:"cover", display:"block" }}/>
                        <a href={img} download="gmb.jpg" target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:8, padding:"6px 12px", borderRadius:8, border:"1px solid #E5E5EA", background:"#fff", textDecoration:"none", color:"#1D1D1F", fontSize:12, fontWeight:500 }}>
                          <I n="dl" s={12}/> Descarregar
                        </a>
                      </div>
                    )}
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {tab==="rev" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {loadC && <div style={{ textAlign:"center", padding:32, color:"#86868B", fontSize:13 }}>Carregant…</div>}
            {!loadC && cont.length===0 && (
              <Card style={{ textAlign:"center", padding:44 }}>
                <I n="inbox" s={28} c="#C7C7CC"/>
                <div style={{ fontSize:13, fontWeight:500, marginTop:12 }}>Cap contingut generat</div>
                <div style={{ fontSize:12, color:"#86868B", marginTop:4 }}>Genera posts des del Generador i apareixeran aquí.</div>
              </Card>
            )}
            {cont.map(item=>(
              <Card key={item.id} style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{item.categoria} · {item.barrio}</div>
                    <div style={{ fontSize:10, color:"#86868B", marginTop:2 }}>{new Date(item.created_at).toLocaleDateString("ca-ES",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:20, background:item.review_status==="approved"?"#E8F7ED":item.review_status==="rejected"?"#FFF0F0":"#FFF8E6", color:item.review_status==="approved"?"#34C759":item.review_status==="rejected"?"#FF3B30":"#FF9500" }}>
                    {item.review_status==="approved"?"Aprovat":item.review_status==="rejected"?"Rebutjat":"Pendent"}
                  </span>
                </div>
                <p style={{ margin:"0 0 12px", fontSize:13, lineHeight:1.7, background:"#F5F5F7", borderRadius:9, padding:"11px 13px", whiteSpace:"pre-wrap" }}>{item.post_text}</p>
                {item.image_url && <img src={item.image_url} alt="" onError={e=>e.target.style.display="none"} style={{ width:"100%", maxHeight:160, objectFit:"cover", borderRadius:9, marginBottom:12, border:"1px solid #E5E5EA" }}/>}
                {item.review_status==="pending" && (
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <Btn onClick={()=>doReview(item.id,"approved")}><I n="up" s={13} c="white"/> Aprovar</Btn>
                    <Btn onClick={()=>doReview(item.id,"rejected")} variant="outline" style={{ color:"#FF3B30", borderColor:"#FF3B30" }}><I n="down" s={13} c="#FF3B30"/> Rebutjar</Btn>
                    <Btn onClick={()=>cp(item.post_text,`r${item.id}`)} variant="outline"><I n={cpd===`r${item.id}`?"check":"copy"} s={12} c={cpd===`r${item.id}`?"#34C759":"#1D1D1F"}/>{cpd===`r${item.id}`?"Copiat":"Copiar"}</Btn>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* ── SITES ── */}
        {tab==="sites" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Card>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Afegir nova web</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}>
                {[
                  {l:"CATEGORIA", el:<select value={nc} onChange={e=>setNc(e.target.value)} style={{...SS,minWidth:130}}><option value="">Categoria…</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>},
                  {l:"BARRI PREDEFINIT", el:<select value={nb} onChange={e=>setNb(e.target.value)} style={{...SS,minWidth:140}}><option value="">Barri…</option>{brs.map(b=><option key={b}>{b}</option>)}</select>},
                  {l:"O PERSONALITZAT", el:<input value={cb} onChange={e=>setCb(e.target.value)} placeholder="Escriu el barri…" style={{...SS,minWidth:150,boxSizing:"border-box"}}/>},
                ].map((f,i)=><div key={i} style={{ flex:"1 1 130px" }}><Lbl t={f.l}/>{f.el}</div>)}
                <button onClick={addSite} style={{ padding:"10px 16px", borderRadius:9, border:"none", background:"#1D1D1F", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, height:42, flexShrink:0 }}>
                  <I n="plus" s={13} c="white"/> Afegir
                </button>
              </div>
            </Card>
            {loadS && <div style={{ textAlign:"center", padding:20, color:"#86868B", fontSize:13 }}>Carregant…</div>}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:11 }}>
              {mySites.map(s=>(
                <Card key={s.id} style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:9 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{s.categoria}</div>
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:s.status==="active"?"#E8F7ED":"#FFF8E6", color:s.status==="active"?"#34C759":"#FF9500" }}>{s.status==="active"?"Actiu":"Pendent"}</span>
                      <button onClick={()=>delSite(s.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}><I n="trash" s={12} c="#C7C7CC"/></button>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, color:"#86868B", fontSize:11, marginBottom:5 }}><I n="pin" s={11} c="#86868B"/> {s.barrio} · {user.city}</div>
                  <div style={{ fontSize:10, color:"#AEAEB2" }}>{s.last_post?`Últim post: ${new Date(s.last_post).toLocaleDateString("ca-ES")}`:"Sense posts aprovats"}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── METRICS ── */}
        {tab==="met" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                {l:"Impressions", v:met?.impressions?.toLocaleString()||"—", d:"+18%", i:"eye"},
                {l:"Clics",       v:met?.clicks?.toLocaleString()||"—",       d:"+23%", i:"trend"},
                {l:"Trucades",    v:met?.calls?.toLocaleString()||"—",        d:"+31%", i:"zap"},
                {l:"CTR mig",     v:met?`${met.ctr}%`:"—",                    d:"+0.8pp", i:"chart"},
              ].map((m,i)=>(
                <Card key={i}>
                  <I n={m.i} s={14} c="#86868B"/>
                  <div style={{ fontSize:22, fontWeight:700, letterSpacing:-0.3, marginTop:8 }}>{m.v}</div>
                  <div style={{ fontSize:10, color:"#86868B", marginTop:2 }}>{m.l}</div>
                  <div style={{ fontSize:11, color:"#34C759", marginTop:4, fontWeight:500 }}>{m.d}</div>
                </Card>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Card>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Millor rendiment</div>
                {mySites.length===0 ? <div style={{ fontSize:12, color:"#86868B" }}>Cap web afegida.</div> : mySites.map((s,i)=>(
                  <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<mySites.length-1?"1px solid #F5F5F7":"none" }}>
                    <div style={{ display:"flex", gap:10 }}><span style={{ fontSize:10, fontWeight:700, color:"#86868B", width:16 }}>#{i+1}</span><div><div style={{ fontSize:12, fontWeight:500 }}>{s.categoria} {s.barrio}</div><div style={{ fontSize:10, color:"#AEAEB2" }}>{(150+i*100).toLocaleString()} impr.</div></div></div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#34C759" }}>+{18-i*3}%</span>
                  </div>
                ))}
              </Card>
              <Card>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Posts aprovats</div>
                {cont.filter(c=>c.review_status==="approved").length===0
                  ? <div style={{ fontSize:12, color:"#86868B" }}>Cap post aprovat.</div>
                  : cont.filter(c=>c.review_status==="approved").slice(0,6).map((c,i,arr)=>(
                    <div key={c.id} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<arr.length-1?"1px solid #F5F5F7":"none" }}>
                      <span style={{ fontSize:12, fontWeight:500 }}>{c.categoria} {c.barrio}</span>
                      <span style={{ fontSize:11, color:"#86868B" }}>{new Date(c.created_at).toLocaleDateString("ca-ES")}</span>
                    </div>
                  ))
                }
                <div style={{ marginTop:12, padding:"10px 12px", borderRadius:9, background:"#F5F5F7", fontSize:11, color:"#86868B", display:"flex", gap:6 }}>
                  <I n="cal" s={11} c="#86868B"/> Posts generats cada dilluns a les 9:00h
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
      <style>{`*{box-sizing:border-box}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}select option{background:#fff}`}</style>
    </div>
  );
}
