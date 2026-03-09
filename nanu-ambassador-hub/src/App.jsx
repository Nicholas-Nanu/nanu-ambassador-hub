import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Themes ───
const DARK = { bg:"#0D1B21",surface:"#1F2A30",surfaceLight:"#2A3840",teal:"#1FC2C2",lightTeal:"#82F9F6",text:"#E8F0F2",textMuted:"#8A9BA5",danger:"#FF6B6B",warning:"#FFD93D",success:"#6BCB77",modalBg:"rgba(0,0,0,0.7)",inputBg:"#0D1B21" };
const LIGHT = { bg:"#F4F6F8",surface:"#FFFFFF",surfaceLight:"#E2E8ED",teal:"#1AA3A3",lightTeal:"#17918F",text:"#1A2B33",textMuted:"#5F7580",danger:"#E04848",warning:"#D4A017",success:"#4DA65B",modalBg:"rgba(0,0,0,0.4)",inputBg:"#FFFFFF" };
const STATUS = { trial:{label:"30-Day Trial",color:"#FFD93D",icon:"⏳"},active:{label:"Active",color:"#6BCB77",icon:"✦"},paused:{label:"Paused",color:"#8A9BA5",icon:"⏸"},alumni:{label:"Alumni",color:"#1FC2C2",icon:"★"} };

const KEYS = { ambassadors:"nanu-amb-v2",prompts:"nanu-amb-prompts",resources:"nanu-amb-resources",feedback:"nanu-amb-feedback",settings:"nanu-amb-settings",recruits:"nanu-amb-recruits",activity:"nanu-amb-activity",applications:"nanu-amb-applications",events:"nanu-amb-events",socials:"nanu-amb-socials",outreach:"nanu-amb-outreach" };
const DEFAULT_SETTINGS = { pin:"nanu2026",adminUsername:"admin",masterCode:"NANU-MASTER-2026",welcomeMessage:"",theme:"dark" };

const ThemeCtx = createContext(DARK);
const useTheme = () => useContext(ThemeCtx);
const mono = "'Space Mono', monospace";
const sans = "'Syne', sans-serif";
const PLATFORMS = ["Discord","Reddit","X / Twitter","Facebook","YouTube","TikTok","Instagram","LinkedIn","Telegram","Forums","Other"];
const OUTREACH_STATUS = {not_started:{label:"Not Started",color:"#8A9BA5"},in_talks:{label:"In Talks",color:"#FFD93D"},approved:{label:"Approved",color:"#6BCB77"},denied:{label:"Denied",color:"#FF6B6B"}};
const FOCUS_OPTS = [{value:"both",label:"Both (Internal + External)"},{value:"internal",label:"Internal Focus"},{value:"external",label:"External Focus"}];

// ─── Helpers ───
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const genCode = (n) => `NANU-${n.replace(/[^A-Za-z]/g,"").substring(0,5).toUpperCase()}-${Math.floor(Math.random()*900+100)}`;
const daysSince = (d) => d?Math.floor((Date.now()-new Date(d).getTime())/864e5):0;
const fmtDate = (d) => d?new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"—";
const fmtDateTime = (d) => d?new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"—";
const daysLeft = (a) => a.startDate?Math.max(0,(a.status==="trial"?30:90)-daysSince(a.startDate)):0;
const load = async(k,fb)=>{try{const r=await window.storage.get(k);return r?.value?JSON.parse(r.value):fb}catch{return fb}};
const sv = async(k,d)=>{try{await window.storage.set(k,JSON.stringify(d))}catch(e){console.error("Save:",e)}};
const exportCSV=(h,rows,fn)=>{const csv=[h.join(","),...rows.map(r=>r.map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=fn;a.click()};

// ─── Logo ───
const Logo=({size=80})=>(<svg viewBox="0 0 2000 2000" width={size} height={size}><path fill="#fff" d="m508.73 872.95c-14.98 0-27.12 12.13-27.12 27.13v128.83l-106-139.19c-7.49-9.64-15.35-16.07-28.56-16.07h-5.7c-15.35 0-27.48 12.14-27.48 27.5v198.78c0 15 12.13 27.13 27.12 27.13 14.99 0 27.13-12.13 27.13-27.13v-133.83l109.92 144.19c7.5 9.64 15.34 16.05 28.55 16.05h1.79c15.34 0 27.48-12.13 27.48-27.48v-198.78c0-15-12.14-27.13-27.13-27.13z"/><path fill="#fff" d="m930.22 1089.58l-87.08-196.65c-6.07-13.56-16.77-21.77-31.76-21.77h-3.22c-14.99 0-26.05 8.21-32.12 21.77l-87.08 196.65c-1.78 3.93-3.21 7.86-3.21 11.78 0 14.28 11.06 25.7 25.34 25.7 11.42 0 20.7-6.43 25.34-17.13l17.48-41.05 54.97-130.98 34.62 82.44 20.34 48.54 16.77 39.26c5 11.42 13.57 18.92 26.42 18.92 14.63 0 26.05-11.78 26.05-26.41 0-3.57-1.07-7.14-2.86-11.07z"/><path fill="#fff" d="m1278.2 872.95c-15 0-27.13 12.13-27.13 27.13v128.83l-106-139.19c-7.49-9.64-15.34-16.07-28.54-16.07h-5.72c-15.35 0-27.48 12.14-27.48 27.5v198.78c0 15 12.13 27.13 27.12 27.13 14.99 0 27.13-12.13 27.13-27.13v-133.83l109.92 144.19c7.5 9.64 15.34 16.05 28.56 16.05h1.78c15.34 0 27.48-12.13 27.48-27.48v-198.78c0-15-12.14-27.13-27.12-27.13z"/><path fill="#fff" d="m1658.64 872.95c-15.34 0-27.48 12.13-27.48 27.47v117.79c0 39.61-20.34 59.95-53.89 59.95-33.55 0-53.9-21.05-53.9-61.74v-116c0-15.34-12.13-27.47-27.47-27.47-15.35 0-27.48 12.13-27.48 27.47v117.43c0 73.52 41.04 110.99 108.13 110.99 67.11 0 109.58-37.11 109.58-112.79v-115.63c0-15.34-12.13-27.47-27.49-27.47z"/><path fill="#1FC2C2" d="m834.31 1047.44c0 13.74-11.15 24.89-24.9 24.89-13.74 0-24.89-11.15-24.89-24.89 0-13.75 11.15-24.89 24.89-24.89 13.75 0 24.9 11.14 24.9 24.89z"/></svg>);
const Noise=()=>(<svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.03}}><filter id="n"><feTurbulence baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>);
const GearIcon=({size=18,color})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>);

// ─── UI Primitives ───
const GlowBar=({pct,color="#1FC2C2"})=>{const T=useTheme();return(<div style={{width:"100%",height:4,background:T.bg,borderRadius:2,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.max(0,pct))}%`,height:"100%",background:`linear-gradient(90deg,${color},${T.lightTeal})`,borderRadius:2,transition:"width 0.6s",boxShadow:`0 0 8px ${color}40`}}/></div>)};
const Card=({children,style:s={},hover=true})=>{const T=useTheme();const ref=useRef();return(<div ref={ref} style={{background:T.surface,borderRadius:14,padding:"20px 24px",border:`1px solid ${T.surfaceLight}`,transition:"border-color 0.2s",...s}} onMouseEnter={()=>hover&&ref.current&&(ref.current.style.borderColor=`${T.teal}40`)} onMouseLeave={()=>hover&&ref.current&&(ref.current.style.borderColor=T.surfaceLight)}>{children}</div>)};
const StatCard=({label,value,sub,accent})=>{const T=useTheme();return(<Card style={{flex:"1 1 160px",minWidth:140}} hover={false}><div style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{label}</div><div style={{fontFamily:sans,fontSize:30,fontWeight:700,color:accent||T.teal,lineHeight:1}}>{value}</div>{sub&&<div style={{fontFamily:mono,fontSize:10,color:T.textMuted,marginTop:5}}>{sub}</div>}</Card>)};
const Badge=({status})=>{const c=STATUS[status]||STATUS.trial;return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:`${c.color}18`,color:c.color,padding:"3px 10px",borderRadius:6,fontSize:11,fontFamily:mono,fontWeight:600,border:`1px solid ${c.color}30`}}>{c.icon} {c.label}</span>};

const Inp=({label,value,onChange,type="text",ph="",rows})=>{const T=useTheme();const base={background:T.inputBg,border:`1px solid ${T.surfaceLight}`,borderRadius:8,padding:"10px 14px",color:T.text,fontSize:13,fontFamily:mono,outline:"none",transition:"border-color 0.2s",width:"100%"};return(<div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.2}}>{label}</label>}{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} style={{...base,resize:"vertical"}} onFocus={e=>(e.target.style.borderColor=T.teal)} onBlur={e=>(e.target.style.borderColor=T.surfaceLight)}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={base} onFocus={e=>(e.target.style.borderColor=T.teal)} onBlur={e=>(e.target.style.borderColor=T.surfaceLight)}/>}</div>)};

const Sel=({label,value,onChange,options})=>{const T=useTheme();return(<div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.2}}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} style={{background:T.inputBg,border:`1px solid ${T.surfaceLight}`,borderRadius:8,padding:"10px 14px",color:T.text,fontSize:13,fontFamily:mono,outline:"none",cursor:"pointer"}}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>)};

const Btn=({children,onClick,v="primary",style:s={}})=>{const T=useTheme();const vs={primary:{background:T.teal,color:T===DARK?"#0D1B21":"#fff",fontWeight:700,border:"none"},secondary:{background:"transparent",color:T.teal,border:`1px solid ${T.teal}`},danger:{background:"transparent",color:T.danger,border:`1px solid ${T.danger}`},ghost:{background:"transparent",color:T.textMuted,border:"none"}};return(<button onClick={onClick} style={{padding:"9px 18px",borderRadius:8,cursor:"pointer",fontFamily:sans,fontSize:13,letterSpacing:0.3,transition:"opacity 0.2s",...vs[v],...s}} onMouseEnter={e=>(e.target.style.opacity=0.8)} onMouseLeave={e=>(e.target.style.opacity=1)}>{children}</button>)};

const Label=({children})=>{const T=useTheme();return <div style={{fontFamily:mono,fontSize:10,color:T.teal,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>{children}</div>};
const SectionTitle=({children,right})=>{const T=useTheme();return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,margin:0}}>{children}</h2>{right}</div>};
const TabBar=({tabs,active,onChange})=>{const T=useTheme();return(<div style={{display:"flex",gap:2,background:T.surface,borderRadius:10,padding:3,marginBottom:24,flexWrap:"wrap"}}>{tabs.map(t=>(<button key={t.key} onClick={()=>onChange(t.key)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,letterSpacing:0.5,transition:"all 0.2s",background:active===t.key?`${T.teal}20`:"transparent",color:active===t.key?T.teal:T.textMuted,fontWeight:active===t.key?700:400}}>{t.icon} {t.label}</button>))}</div>)};
const Modal=({children,onClose})=>{const T=useTheme();return(<div style={{position:"fixed",inset:0,background:T.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:20,padding:32,maxWidth:560,width:"100%",border:`1px solid ${T.surfaceLight}`,maxHeight:"90vh",overflowY:"auto"}}>{children}</div></div>)};
const EmptyState=({icon="✦",title,sub,action})=>{const T=useTheme();return(<Card style={{textAlign:"center",padding:48,border:`1px dashed ${T.surfaceLight}`}} hover={false}><div style={{fontSize:36,marginBottom:12}}>{icon}</div><p style={{fontFamily:sans,fontSize:16,fontWeight:600,color:T.text,margin:0}}>{title}</p><p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:6}}>{sub}</p>{action&&<div style={{marginTop:16}}>{action}</div>}</Card>)};
const Header=({title,subtitle,right})=>{const T=useTheme();return(<header style={{position:"sticky",top:0,zIndex:50,background:`${T.bg}E0`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.surfaceLight}`,padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#1FC2C2,#82F9F6)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Logo size={32}/></div><div><h1 style={{fontFamily:sans,fontSize:17,fontWeight:700,margin:0,lineHeight:1.2,color:T.text}}>{title}</h1><span style={{fontFamily:mono,fontSize:9,color:T.textMuted,letterSpacing:2,textTransform:"uppercase"}}>{subtitle}</span></div></div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>{right}</div></header>)};
const Toggle=({checked,onChange,label})=>{const T=useTheme();return(<div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>onChange(!checked)}><div style={{width:44,height:24,borderRadius:12,background:checked?T.teal:T.surfaceLight,transition:"background 0.2s",position:"relative",flexShrink:0}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:checked?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/></div>{label&&<span style={{fontFamily:mono,fontSize:12,color:T.text}}>{label}</span>}</div>)};
const ShowHideBtn=({show,onToggle})=>{const T=useTheme();return(<button onClick={onToggle} style={{background:"none",border:`1px solid ${T.surfaceLight}`,borderRadius:8,cursor:"pointer",padding:"9px 12px",color:T.textMuted,fontFamily:mono,fontSize:11,transition:"border-color 0.2s",flexShrink:0}} onMouseEnter={e=>(e.target.style.borderColor=T.teal)} onMouseLeave={e=>(e.target.style.borderColor=T.surfaceLight)}>{show?"Hide":"Show"}</button>)};

// ─── SETTINGS PANEL ───
const SettingsPanel=({settings,onUpdate,ambassadors,feedback,onBulkStatus,onClose})=>{
  const T=useTheme();
  const[pin,setPin]=useState(settings.pin);const[adminUsername,setAdminUsername]=useState(settings.adminUsername||"admin");
  const[masterCode,setMasterCode]=useState(settings.masterCode||"NANU-MASTER-2026");
  const[welcome,setWelcome]=useState(settings.welcomeMessage||"");
  const[pinSaved,setPinSaved]=useState(false);const[showPin,setShowPin]=useState(false);const[showMaster,setShowMaster]=useState(false);
  const[usernameSaved,setUsernameSaved]=useState(false);const[masterSaved,setMasterSaved]=useState(false);const[welcomeSaved,setWelcomeSaved]=useState(false);
  const[bulkStatus,setBulkStatus]=useState("active");const[bulkFrom,setBulkFrom]=useState("trial");
  const flash=(fn)=>{fn(true);setTimeout(()=>fn(false),2000)};
  const statusOpts=Object.entries(STATUS).map(([k,v])=>({value:k,label:v.label}));
  const bulkCount=ambassadors.filter(a=>a.status===bulkFrom).length;
  return(
    <Modal onClose={onClose}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontFamily:sans,fontSize:22,fontWeight:700,color:T.text,margin:0}}>Settings</h2>
        <Btn v="ghost" onClick={onClose} style={{fontSize:18,padding:"4px 8px"}}>×</Btn>
      </div>
      <div style={{marginBottom:28}}><Label>Appearance</Label><Toggle checked={settings.theme==="dark"} onChange={d=>onUpdate({...settings,theme:d?"dark":"light"})} label={settings.theme==="dark"?"Dark mode":"Light mode"}/></div>
      <div style={{marginBottom:28}}><Label>Admin Username</Label><div style={{display:"flex",gap:8,alignItems:"end"}}><div style={{flex:1}}><Inp value={adminUsername} onChange={setAdminUsername} ph="Min 3 characters"/></div><Btn onClick={()=>{if(adminUsername.trim().length>=3){onUpdate({...settings,adminUsername:adminUsername.trim()});flash(setUsernameSaved)}}} style={{flexShrink:0}}>{usernameSaved?"✓ Saved":"Update"}</Btn></div></div>
      <div style={{marginBottom:28}}><Label>Admin PIN</Label><div style={{display:"flex",gap:8,alignItems:"end"}}><div style={{flex:1}}><Inp value={pin} onChange={setPin} type={showPin?"text":"password"} ph="Min 4 characters"/></div><ShowHideBtn show={showPin} onToggle={()=>setShowPin(!showPin)}/><Btn onClick={()=>{if(pin.length>=4){onUpdate({...settings,pin});flash(setPinSaved)}}} style={{flexShrink:0}}>{pinSaved?"✓ Saved":"Update PIN"}</Btn></div></div>
      <div style={{marginBottom:28}}><Label>Master Recovery Code</Label><p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:8,marginTop:-4}}>Required to reset PIN from login. Keep this safe.</p><div style={{display:"flex",gap:8,alignItems:"end"}}><div style={{flex:1}}><Inp value={masterCode} onChange={setMasterCode} type={showMaster?"text":"password"} ph="Min 6 characters"/></div><ShowHideBtn show={showMaster} onToggle={()=>setShowMaster(!showMaster)}/><Btn onClick={()=>{if(masterCode.length>=6){onUpdate({...settings,masterCode});flash(setMasterSaved)}}} style={{flexShrink:0}}>{masterSaved?"✓ Saved":"Update"}</Btn></div></div>
      <div style={{marginBottom:28}}><Label>Ambassador Welcome Message</Label><p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:8,marginTop:-4}}>Shown on ambassador login. Leave blank for none.</p><Inp value={welcome} onChange={setWelcome} rows={3} ph="Welcome to the programme..."/><Btn onClick={()=>{onUpdate({...settings,welcomeMessage:welcome});flash(setWelcomeSaved)}} style={{marginTop:8}}>{welcomeSaved?"✓ Saved":"Save Message"}</Btn></div>
      <div style={{marginBottom:28}}><Label>Export Data</Label><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Btn v="secondary" onClick={()=>exportCSV(["Name","Email","Discord","Twitter","LinkedIn","YouTube","TikTok","Reddit","Instagram","Podcast","Facebook","Website","Status","Start Date","Invite Code","Recruited","Notes"],ambassadors.map(a=>[a.name,a.email,a.discord,a.twitter,a.linkedin,a.youtube,a.tiktok,a.reddit,a.instagram,a.podcast,a.facebook,a.website,a.status,a.startDate,a.inviteCode,a.usersRecruited,a.notes]),`nanu-ambassadors-${new Date().toISOString().split("T")[0]}.csv`)} style={{fontSize:12}}>Export Ambassadors CSV</Btn><Btn v="secondary" onClick={()=>exportCSV(["Ambassador","Type","Message","Date"],feedback.map(f=>[f.ambassadorName,f.type,f.message,fmtDate(f.date)]),`nanu-feedback-${new Date().toISOString().split("T")[0]}.csv`)} style={{fontSize:12}}>Export Feedback CSV</Btn></div></div>
      <div style={{marginBottom:8}}><Label>Bulk Update Status</Label><div style={{display:"flex",gap:10,alignItems:"end",flexWrap:"wrap"}}><Sel label="From" value={bulkFrom} onChange={setBulkFrom} options={statusOpts}/><div style={{fontFamily:mono,fontSize:14,color:T.textMuted,paddingBottom:12}}>→</div><Sel label="To" value={bulkStatus} onChange={setBulkStatus} options={statusOpts}/><Btn onClick={()=>onBulkStatus(bulkFrom,bulkStatus)} v={bulkCount>0?"primary":"ghost"} style={{flexShrink:0}}>Update {bulkCount}</Btn></div></div>
    </Modal>
  );
};

// ─── LOGIN ───
const LoginScreen=({onLogin,onApply,ambassadors,settings,onResetPin})=>{
  const T=useTheme();const[mode,setMode]=useState("choose");const[username,setUsername]=useState("");const[code,setCode]=useState("");
  const[masterInput,setMasterInput]=useState("");const[error,setError]=useState("");const[showReset,setShowReset]=useState(false);const[resetDone,setResetDone]=useState(false);
  const handleAdmin=()=>{const eu=settings.adminUsername||DEFAULT_SETTINGS.adminUsername;const ep=settings.pin||DEFAULT_SETTINGS.pin;if(username.trim()===eu&&code===ep)onLogin("admin",null);else{setError("Invalid username or PIN.");setTimeout(()=>setError(""),3000)}};
  const handleAmb=()=>{const a=ambassadors.find(a=>a.inviteCode?.toLowerCase()===code.trim().toLowerCase());if(a)onLogin("ambassador",a.id);else{setError("Code not recognised.");setTimeout(()=>setError(""),3000)}};
  const handleReset=()=>{const em=settings.masterCode||DEFAULT_SETTINGS.masterCode;if(masterInput===em){onResetPin();setResetDone(true);setShowReset(false);setUsername("admin");setCode("");setMasterInput("");setTimeout(()=>setResetDone(false),5000)}else{setError("Invalid master recovery code.");setTimeout(()=>setError(""),3000)}};
  const back=()=>{setMode("choose");setCode("");setUsername("");setError("");setShowReset(false);setResetDone(false);setMasterInput("")};
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse at 30% 20%,${T.surfaceLight}40 0%,${T.bg} 70%)`,padding:24}}>
      <Noise/><div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:420,width:"100%"}}>
        <div style={{width:120,height:120,borderRadius:"50%",margin:"0 auto 28px",background:`radial-gradient(circle,${T.teal}30 0%,transparent 70%)`,display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 3s ease-in-out infinite"}}><Logo size={80}/></div>
        <h1 style={{fontFamily:sans,fontSize:24,fontWeight:700,color:T.text,margin:0}}>Ambassador Hub</h1>
        <p style={{fontFamily:mono,fontSize:10,color:T.textMuted,letterSpacing:1.5,marginTop:6,textTransform:"uppercase"}}>Discover · Discuss · Disclose</p>
        {settings.welcomeMessage&&mode==="ambassador"&&<Card style={{marginTop:20,textAlign:"left",borderLeft:`3px solid ${T.teal}`}} hover={false}><div style={{fontFamily:mono,fontSize:12,color:T.text,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{settings.welcomeMessage}</div></Card>}
        {mode==="choose"&&<div style={{display:"flex",flexDirection:"column",gap:12,marginTop:36}}>
          <Btn onClick={()=>setMode("admin")} style={{width:"100%",padding:"14px 20px"}}>Admin Sign In</Btn>
          <Btn onClick={()=>setMode("ambassador")} v="secondary" style={{width:"100%",padding:"14px 20px"}}>Ambassador Portal</Btn>
          <div style={{borderTop:`1px solid ${T.surfaceLight}`,margin:"8px 0",paddingTop:16}}>
            <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:10}}>Want to join the programme?</p>
            <Btn onClick={onApply} v="secondary" style={{width:"100%",padding:"14px 20px",borderColor:T.lightTeal,color:T.lightTeal}}>✦ Become an Ambassador</Btn>
          </div>
        </div>}
        {(mode==="admin"||mode==="ambassador")&&(
          <Card style={{marginTop:mode==="ambassador"&&settings.welcomeMessage?16:28,textAlign:"left"}} hover={false}>
            {mode==="admin"?<><div style={{marginBottom:12}}><Inp label="Username" value={username} onChange={setUsername} ph="Enter username"/></div><Inp label="PIN" value={code} onChange={setCode} type="password" ph="Enter PIN"/></>:<><Label>Your Ambassador Code</Label><Inp value={code} onChange={setCode} ph="e.g. NANU-JANE-421"/></>}
            <div style={{display:"flex",gap:8,marginTop:16}}><Btn v="ghost" onClick={back}>Back</Btn><Btn onClick={mode==="admin"?handleAdmin:handleAmb} style={{flex:1}}>{mode==="admin"?"Sign In":"Enter Portal"}</Btn></div>
            {error&&<div style={{color:T.danger,fontFamily:mono,fontSize:11,marginTop:10,textAlign:"center"}}>{error}</div>}
            {mode==="admin"&&!showReset&&!resetDone&&<div style={{textAlign:"center",marginTop:12}}><button onClick={()=>setShowReset(true)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,color:T.textMuted,textDecoration:"underline"}}>Forgot PIN?</button></div>}
            {showReset&&<div style={{marginTop:12,padding:14,background:`${T.warning}10`,border:`1px solid ${T.warning}30`,borderRadius:10}}><div style={{fontFamily:mono,fontSize:11,color:T.text,marginBottom:10,textAlign:"center"}}>Enter master recovery code.</div><Inp value={masterInput} onChange={setMasterInput} type="password" ph="Master recovery code"/><div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}><Btn v="ghost" onClick={()=>{setShowReset(false);setMasterInput("")}} style={{fontSize:11,padding:"6px 14px"}}>Cancel</Btn><Btn onClick={handleReset} style={{fontSize:11,padding:"6px 14px",background:T.warning,color:"#1A2B33"}}>Reset</Btn></div></div>}
            {resetDone&&<div style={{marginTop:12,padding:10,background:`${T.success}15`,border:`1px solid ${T.success}30`,borderRadius:10,textAlign:"center"}}><div style={{fontFamily:mono,fontSize:11,color:T.success}}>Reset done. Username: <strong>admin</strong> / PIN: <strong>nanu2026</strong></div></div>}
          </Card>
        )}
        <p style={{fontFamily:mono,fontSize:9,color:T.textMuted,marginTop:28}}>Nanu Ambassador Programme · Unknown Systems Ltd</p>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────
// APPLICATION PAGE
// ────────────────────────────────────────────────────────
const CATEGORIES = ["UAP","NHI","Cryptids","Paranormal","Consciousness","Myths & History","Ritual / Magic / Occult","Natural Phenomena","Other / Fortean"];
const HEARD_FROM = ["Social media","Podcast","Discord","Reddit","Friend / word of mouth","Event","Search engine","Other"];

const PerkCard = ({icon, title, desc}) => {
  const T = useTheme();
  return (
    <div style={{background:T.surface,borderRadius:12,padding:"18px 20px",border:`1px solid ${T.surfaceLight}`,transition:"border-color 0.3s"}}
      onMouseEnter={e=>(e.currentTarget.style.borderColor=`${T.teal}50`)}
      onMouseLeave={e=>(e.currentTarget.style.borderColor=T.surfaceLight)}>
      <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
      <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{title}</div>
      <div style={{fontFamily:mono,fontSize:11,color:T.textMuted,lineHeight:1.6}}>{desc}</div>
    </div>
  );
};

const ApplicationPage = ({onSubmit, onBack}) => {
  const T = useTheme();
  const [step, setStep] = useState("info"); // info | form | done
  const [f, setF] = useState({name:"",email:"",twitter:"",linkedin:"",youtube:"",tiktok:"",reddit:"",instagram:"",discord:"",podcast:"",website:"",audienceSize:"",motivation:"",categories:[],heardFrom:"",location:"",timezone:""});
  const u = (k) => (v) => setF(p=>({...p,[k]:v}));
  const toggleCat = (c) => setF(p=>({...p,categories:p.categories.includes(c)?p.categories.filter(x=>x!==c):[...p.categories,c]}));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = true;
    if (!f.email.trim() || !f.email.includes("@")) e.email = true;
    if (!f.motivation.trim()) e.motivation = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({...f, id:uid(), date:new Date().toISOString(), status:"pending"});
    setStep("done");
  };

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 20% 10%,${T.surfaceLight}30 0%,${T.bg} 60%)`,color:T.text}}>
      <Noise/>
      <Header title="Become an Ambassador" subtitle="Nanu Ambassador Programme" right={<Btn v="ghost" onClick={onBack} style={{fontSize:11}}>← Back</Btn>}/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"32px 20px",position:"relative",zIndex:1}}>

        {/* ─── MARKETING / INFO ─── */}
        {step === "info" && <>
          {/* Hero */}
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 20px",background:`radial-gradient(circle,${T.teal}30 0%,transparent 70%)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Logo size={56}/>
            </div>
            <h2 style={{fontFamily:sans,fontSize:28,fontWeight:800,color:T.text,margin:0,lineHeight:1.2}}>Help shape the world's most thoughtful community for unexplained phenomena.</h2>
            <p style={{fontFamily:mono,fontSize:12,color:T.textMuted,marginTop:12,lineHeight:1.7,maxWidth:540,margin:"12px auto 0"}}>
              Nanu Ambassadors are recognised community leaders who help Nanu grow, keep discussions high quality, and directly shape the platform before everyone else. They're not "influencers" — they're builders.
            </p>
          </div>

          {/* What you get */}
          <div style={{marginBottom:36}}>
            <Label>What you get</Label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
              <PerkCard icon="⭐" title="Free Premium" desc="Full Premium access for the duration of your ambassadorship — the core perk."/>
              <PerkCard icon="🚀" title="Early Access" desc="Get community features, moderation tools, and new releases before the public."/>
              <PerkCard icon="🎯" title="Direct Influence" desc="Monthly Ambassador Council calls. Vote on priorities. Your ideas ship with your name on them."/>
              <PerkCard icon="🏅" title="Official Status" desc="Ambassador badge, highlighted profile, and featured carousel on the website."/>
              <PerkCard icon="📈" title="Career Value" desc="LinkedIn shoutouts, reference letters, and first consideration for future paid roles."/>
              <PerkCard icon="🎪" title="Exclusive Events" desc="Ambassador-only livestreams, case nights, AMAs with advisors and special guests."/>
            </div>
          </div>

          {/* What we ask */}
          <div style={{marginBottom:36}}>
            <Label>What we ask</Label>
            <Card hover={false}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
                <div>
                  <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.teal,marginBottom:8}}>Weekly rhythm</div>
                  <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                    1 quality post per week<br/>5 meaningful interactions<br/>Welcome a few new members
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.teal,marginBottom:8}}>How it works</div>
                  <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                    30-day trial to start<br/>90-day renewable terms<br/>Stay active = keep all perks
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Values */}
          <div style={{marginBottom:36}}>
            <Label>Who we're looking for</Label>
            <Card hover={false} style={{borderLeft:`3px solid ${T.teal}`}}>
              <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                People who are curious, respectful, and evidence-minded. You label speculation as speculation. You encourage structured reporting and constructive discussion. You don't need a huge audience — you need genuine interest in exploring the unknown responsibly.
              </div>
            </Card>
          </div>

          <div style={{textAlign:"center"}}>
            <Btn onClick={()=>setStep("form")} style={{padding:"16px 48px",fontSize:15,fontWeight:700}}>Apply Now</Btn>
          </div>
        </>}

        {/* ─── FORM ─── */}
        {step === "form" && <>
          <div style={{marginBottom:24}}>
            <button onClick={()=>setStep("info")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,color:T.textMuted}}>← Back to info</button>
          </div>
          <SectionTitle>Your Application</SectionTitle>
          <Card hover={false}>
            <div style={{display:"grid",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><Inp label="Full Name *" value={f.name} onChange={u("name")} ph="Your name"/>{errors.name&&<div style={{fontFamily:mono,fontSize:10,color:T.danger,marginTop:2}}>Required</div>}</div>
                <div><Inp label="Email *" value={f.email} onChange={u("email")} type="email" ph="you@example.com"/>{errors.email&&<div style={{fontFamily:mono,fontSize:10,color:T.danger,marginTop:2}}>Valid email required</div>}</div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Location" value={f.location} onChange={u("location")} ph="City, Country"/>
                <Inp label="Timezone" value={f.timezone} onChange={u("timezone")} ph="e.g. GMT, EST, PST"/>
              </div>

              <div><Inp label="Why do you want to be a Nanu Ambassador? *" value={f.motivation} onChange={u("motivation")} rows={4} ph="What draws you to Nanu? What would you bring to the community?"/>{errors.motivation&&<div style={{fontFamily:mono,fontSize:10,color:T.danger,marginTop:2}}>Required</div>}</div>

              {/* Categories */}
              <div>
                <label style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:8}}>Which categories interest you?</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {CATEGORIES.map(c=>(
                    <button key={c} onClick={()=>toggleCat(c)} style={{
                      padding:"6px 12px",borderRadius:6,border:`1px solid ${f.categories.includes(c)?T.teal:T.surfaceLight}`,cursor:"pointer",
                      fontFamily:mono,fontSize:11,transition:"all 0.2s",
                      background:f.categories.includes(c)?`${T.teal}20`:"transparent",
                      color:f.categories.includes(c)?T.teal:T.textMuted,
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <Sel label="How did you hear about Nanu?" value={f.heardFrom} onChange={u("heardFrom")} options={[{value:"",label:"Select..."},...HEARD_FROM.map(h=>({value:h,label:h}))]}/>

              {/* Social links */}
              <div style={{borderTop:`1px solid ${T.surfaceLight}`,paddingTop:14,marginTop:4}}>
                <label style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:10}}>Social links &amp; audience (optional)</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Inp label="Twitter / X" value={f.twitter} onChange={u("twitter")} ph="@handle"/>
                  <Inp label="Discord" value={f.discord} onChange={u("discord")} ph="username"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                  <Inp label="YouTube" value={f.youtube} onChange={u("youtube")} ph="channel"/>
                  <Inp label="TikTok" value={f.tiktok} onChange={u("tiktok")} ph="@handle"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                  <Inp label="Reddit" value={f.reddit} onChange={u("reddit")} ph="u/username"/>
                  <Inp label="Instagram" value={f.instagram} onChange={u("instagram")} ph="@handle"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                  <Inp label="LinkedIn" value={f.linkedin} onChange={u("linkedin")} ph="linkedin.com/in/..."/>
                  <Inp label="Podcast" value={f.podcast} onChange={u("podcast")} ph="name or URL"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                  <Inp label="Website" value={f.website} onChange={u("website")} ph="https://..."/>
                  <Inp label="Approx. audience size" value={f.audienceSize} onChange={u("audienceSize")} ph="e.g. 500, 2k, 10k+"/>
                </div>
              </div>

              <Btn onClick={handleSubmit} style={{marginTop:8,width:"100%",padding:"14px 20px",fontSize:14}}>Submit Application</Btn>
            </div>
          </Card>
        </>}

        {/* ─── CONFIRMATION ─── */}
        {step === "done" && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 24px",background:`radial-gradient(circle,${T.success}30 0%,transparent 70%)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:36}}>✓</div>
            </div>
            <h2 style={{fontFamily:sans,fontSize:24,fontWeight:700,color:T.text,margin:0}}>Application Received</h2>
            <p style={{fontFamily:mono,fontSize:12,color:T.textMuted,marginTop:12,lineHeight:1.7,maxWidth:420,margin:"12px auto 0"}}>
              Thank you for applying to the Nanu Ambassador Programme. Nicholas will review your application and get back to you via email. In the meantime, download Nanu and start exploring.
            </p>
            <div style={{marginTop:28}}>
              <Btn onClick={onBack}>Back to Hub</Btn>
            </div>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:40,paddingTop:16,borderTop:`1px solid ${T.surfaceLight}`,fontFamily:mono,fontSize:9,color:T.textMuted}}>Nanu Ambassador Programme · Unknown Systems Ltd · {new Date().getFullYear()}</div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────
// AMBASSADOR PORTAL (with self-service)
// ────────────────────────────────────────────────────────
const AmbassadorPortal=({ambassador,prompts,resources,events,socials,outreach,allRecruits,allActivity,allFeedback,onUpdateProfile,onAddRecruit,onAddActivity,onSubmitFeedback,onAddOutreachLog,onLogout})=>{
  const T=useTheme();
  const[tab,setTab]=useState("dashboard");
  // Recruit form
  const[rName,setRName]=useState("");const[rNotes,setRNotes]=useState("");const[rSaved,setRSaved]=useState(false);
  // Activity form
  const[actType,setActType]=useState("post");const[actDesc,setActDesc]=useState("");const[actLink,setActLink]=useState("");const[actSaved,setActSaved]=useState(false);
  // Profile form
  const[profile,setProfile]=useState({...ambassador});const[profileSaved,setProfileSaved]=useState(false);
  // Feedback
  const[fbText,setFbText]=useState("");const[fbType,setFbType]=useState("general");const[fbDone,setFbDone]=useState(false);

  const myRecruits=allRecruits.filter(r=>r.ambassadorId===ambassador.id);
  const myActivity=allActivity.filter(a=>a.ambassadorId===ambassador.id);
  const remaining=daysLeft(ambassador);const termDays=ambassador.status==="trial"?30:90;const pct=((termDays-remaining)/termDays)*100;
  const currentPrompt=prompts.length>0?prompts[prompts.length-1]:null;
  const up=(k)=>(v)=>setProfile(p=>({...p,[k]:v}));

  const handleRecruit=()=>{if(!rName.trim())return;onAddRecruit({id:uid(),ambassadorId:ambassador.id,ambassadorName:ambassador.name,name:rName,notes:rNotes,date:new Date().toISOString()});setRName("");setRNotes("");setRSaved(true);setTimeout(()=>setRSaved(false),3000)};
  const handleActivity=()=>{if(!actDesc.trim())return;onAddActivity({id:uid(),ambassadorId:ambassador.id,ambassadorName:ambassador.name,type:actType,description:actDesc,link:actLink,date:new Date().toISOString()});setActDesc("");setActLink("");setActSaved(true);setTimeout(()=>setActSaved(false),3000)};
  const handleProfile=()=>{onUpdateProfile(profile);setProfileSaved(true);setTimeout(()=>setProfileSaved(false),2500)};
  const handleFeedback=()=>{if(!fbText.trim())return;onSubmitFeedback({id:uid(),ambassadorId:ambassador.id,ambassadorName:ambassador.name,type:fbType,message:fbText,date:new Date().toISOString()});setFbText("");setFbDone(true);setTimeout(()=>setFbDone(false),4000)};

  const[copied,setCopied]=useState(null);
  const[logTarget,setLogTarget]=useState(null);const[logText,setLogText]=useState("");const[logSaved,setLogSaved]=useState(false);
  const handleOutreachLog=(targetId)=>{if(!logText.trim())return;onAddOutreachLog(targetId,{date:new Date().toISOString(),text:logText,by:ambassador.name});setLogText("");setLogSaved(targetId);setTimeout(()=>setLogSaved(false),3000)};
  const copyLink=(url)=>{navigator.clipboard.writeText(url).then(()=>{setCopied(url);setTimeout(()=>setCopied(null),2000)}).catch(()=>{})};
  const tabs=[{key:"dashboard",label:"Dashboard",icon:"📊"},{key:"outreach",label:`Outreach (${outreach.length})`,icon:"🌐"},{key:"events",label:`Events${events.length?` (${events.length})`:""}`,icon:"📅"},{key:"recruits",label:"Recruits",icon:"👥"},{key:"activity",label:"Activity",icon:"📝"},{key:"perks",label:"Perks & Info",icon:"⭐"},{key:"socials",label:"Socials",icon:"🔗"},{key:"profile",label:"Profile",icon:"✏️"},{key:"toolkit",label:"Toolkit",icon:"📦"},{key:"feedback",label:"Feedback",icon:"💬"}];

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 10% 0%,${T.surfaceLight}30 0%,${T.bg} 50%)`,color:T.text}}>
      <Noise/>
      <Header title={`Welcome, ${ambassador.name?.split(" ")[0]||"Ambassador"}`} subtitle="Ambassador Portal" right={<Btn v="ghost" onClick={onLogout} style={{fontSize:11}}>Sign Out</Btn>}/>
      <div style={{maxWidth:760,margin:"0 auto",padding:"28px 20px",position:"relative",zIndex:1}}>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>

        {/* ─── DASHBOARD ─── */}
        {tab==="dashboard"&&<>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
            <Card style={{flex:"1 1 200px"}} hover={false}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                <div><Label>Your Status</Label><Badge status={ambassador.status}/></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:sans,fontSize:28,fontWeight:700,color:remaining<=7?T.warning:T.teal}}>{remaining}</div><div style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>days left</div></div>
              </div>
              <GlowBar pct={pct} color={remaining<=7?STATUS.trial.color:T.teal}/>
              <div style={{fontFamily:mono,fontSize:10,color:T.textMuted,marginTop:8}}>Started {fmtDate(ambassador.startDate)}</div>
            </Card>
            <StatCard label="Recruits Logged" value={myRecruits.length} sub={`via ${ambassador.inviteCode}`} accent={T.lightTeal}/>
            <StatCard label="Activities Logged" value={myActivity.length} sub="this term"/>
          </div>
          {currentPrompt&&<div style={{marginBottom:28}}><SectionTitle>This Week's Prompt</SectionTitle><Card hover={false} style={{borderLeft:`3px solid ${T.teal}`}}><div style={{fontFamily:sans,fontSize:16,fontWeight:600,color:T.text,marginBottom:8}}>{currentPrompt.title}</div><div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{currentPrompt.body}</div>{currentPrompt.category&&<div style={{fontFamily:mono,fontSize:10,color:T.teal,marginTop:10,textTransform:"uppercase",letterSpacing:1}}>{currentPrompt.category}</div>}</Card></div>}
        </>}

        {/* ─── RECRUITS ─── */}
        {tab==="recruits"&&<>
          <SectionTitle>Log a Recruit</SectionTitle>
          <Card hover={false} style={{marginBottom:24}}>
            {rSaved?<div style={{textAlign:"center",padding:16}}><div style={{fontSize:28,marginBottom:6}}>✓</div><div style={{fontFamily:sans,fontSize:15,fontWeight:600,color:T.success}}>Recruit logged</div></div>:(
              <div style={{display:"grid",gap:12}}>
                <Inp label="Recruit Name" value={rName} onChange={setRName} ph="Who did you bring to Nanu?"/>
                <Inp label="Notes (optional)" value={rNotes} onChange={setRNotes} ph="How did they find out? Any context..."/>
                <Btn onClick={handleRecruit} style={{marginTop:4}}>+ Log Recruit</Btn>
              </div>
            )}
          </Card>
          <SectionTitle>Recruitment Log ({myRecruits.length})</SectionTitle>
          {myRecruits.length===0?<EmptyState icon="👥" title="No recruits yet" sub="Log your first recruit above."/>:(
            <div style={{display:"grid",gap:8}}>{[...myRecruits].reverse().map(r=>(
              <Card key={r.id} style={{padding:"14px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div><div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{r.name}</div>{r.notes&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:2}}>{r.notes}</div>}</div>
                  <div style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDateTime(r.date)}</div>
                </div>
              </Card>
            ))}</div>
          )}
        </>}

        {/* ─── ACTIVITY ─── */}
        {tab==="activity"&&<>
          <SectionTitle>Log Activity</SectionTitle>
          <Card hover={false} style={{marginBottom:24}}>
            {actSaved?<div style={{textAlign:"center",padding:16}}><div style={{fontSize:28,marginBottom:6}}>✓</div><div style={{fontFamily:sans,fontSize:15,fontWeight:600,color:T.success}}>Activity logged</div></div>:(
              <div style={{display:"grid",gap:12}}>
                <Sel label="Type" value={actType} onChange={setActType} options={[{value:"post",label:"Post / Content"},{value:"interaction",label:"Interaction / Comment"},{value:"welcome",label:"Welcomed New Member"},{value:"discussion",label:"Discussion Thread"},{value:"outreach",label:"External Outreach"},{value:"other",label:"Other"}]}/>
                <Inp label="Description" value={actDesc} onChange={setActDesc} ph="What did you do?" rows={2}/>
                <Inp label="Link (optional)" value={actLink} onChange={setActLink} ph="https://..."/>
                <Btn onClick={handleActivity} style={{marginTop:4}}>+ Log Activity</Btn>
              </div>
            )}
          </Card>
          <SectionTitle>Activity History ({myActivity.length})</SectionTitle>
          {myActivity.length===0?<EmptyState icon="📝" title="No activity yet" sub="Log your contributions above."/>:(
            <div style={{display:"grid",gap:8}}>{[...myActivity].reverse().map(a=>(
              <Card key={a.id} style={{padding:"14px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:mono,fontSize:10,background:`${T.teal}15`,color:T.teal,padding:"2px 8px",borderRadius:4}}>{a.type}</span><span style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDateTime(a.date)}</span></div>
                    <div style={{fontFamily:mono,fontSize:12,color:T.text,lineHeight:1.5}}>{a.description}</div>
                    {a.link&&<a href={a.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:mono,fontSize:11,color:T.teal,textDecoration:"none",marginTop:4,display:"inline-block"}}>🔗 {a.link}</a>}
                  </div>
                </div>
              </Card>
            ))}</div>
          )}
        </>}

        {/* ─── PROFILE ─── */}
        {tab==="profile"&&<>
          <SectionTitle>Edit Profile</SectionTitle>
          <Card hover={false}>
            {profileSaved&&<div style={{background:`${T.success}15`,border:`1px solid ${T.success}30`,borderRadius:8,padding:8,marginBottom:16,textAlign:"center"}}><div style={{fontFamily:mono,fontSize:11,color:T.success}}>✓ Profile updated</div></div>}
            <div style={{display:"grid",gap:12}}>
              <Inp label="Bio / Intro" value={profile.bio||""} onChange={up("bio")} rows={3} ph="Tell us about yourself..."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Email" value={profile.email||""} onChange={up("email")} type="email" ph="email@example.com"/>
                <Inp label="Discord" value={profile.discord||""} onChange={up("discord")} ph="username"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Twitter / X" value={profile.twitter||""} onChange={up("twitter")} ph="@handle"/>
                <Inp label="LinkedIn" value={profile.linkedin||""} onChange={up("linkedin")} ph="linkedin.com/in/..."/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="YouTube" value={profile.youtube||""} onChange={up("youtube")} ph="channel name or URL"/>
                <Inp label="TikTok" value={profile.tiktok||""} onChange={up("tiktok")} ph="@handle"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Reddit" value={profile.reddit||""} onChange={up("reddit")} ph="u/username"/>
                <Inp label="Instagram" value={profile.instagram||""} onChange={up("instagram")} ph="@handle"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Podcast" value={profile.podcast||""} onChange={up("podcast")} ph="podcast name or URL"/>
                <Inp label="Facebook" value={profile.facebook||""} onChange={up("facebook")} ph="page or profile"/>
              </div>
              <Inp label="Website" value={profile.website||""} onChange={up("website")} ph="https://..."/>
              <Btn onClick={handleProfile} style={{marginTop:4}}>Save Profile</Btn>
            </div>
          </Card>
        </>}

        {/* ─── TOOLKIT ─── */}
        {tab==="toolkit"&&<>
          <SectionTitle>Toolkit &amp; Resources</SectionTitle>
          {resources.length>0?<div style={{display:"grid",gap:10}}>{resources.map(r=>(<Card key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",flexWrap:"wrap",gap:10}}><div style={{minWidth:0,flex:1}}><div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{r.name}</div>{r.description&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:3}}>{r.description}</div>}</div><a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:mono,fontSize:11,color:T.teal,textDecoration:"none",padding:"6px 14px",border:`1px solid ${T.teal}`,borderRadius:6,flexShrink:0,whiteSpace:"nowrap"}}>{r.type==="download"?"Download":"Open"} →</a></Card>))}</div>:<EmptyState icon="📦" title="Resources coming soon" sub="Check back for brand assets, templates, and guides."/>}
        </>}

        {/* ─── FEEDBACK ─── */}
        {tab==="feedback"&&<>
          <SectionTitle>Feedback &amp; Ideas</SectionTitle>
          <Card hover={false}>
            {fbDone?<div style={{textAlign:"center",padding:20}}><div style={{fontSize:32,marginBottom:8}}>✓</div><div style={{fontFamily:sans,fontSize:16,fontWeight:600,color:T.success}}>Feedback sent</div><div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:4}}>Nicholas will review it.</div></div>:(
              <><Sel label="Type" value={fbType} onChange={setFbType} options={[{value:"general",label:"General Feedback"},{value:"feature",label:"Feature Idea"},{value:"issue",label:"Bug / Issue"},{value:"community",label:"Community Suggestion"}]}/><div style={{marginTop:12}}><Inp label="Your Message" value={fbText} onChange={setFbText} rows={4} ph="What's on your mind?"/></div><Btn onClick={handleFeedback} style={{marginTop:14,width:"100%"}}>Submit Feedback</Btn></>
            )}
          </Card>
        </>}

        {/* ─── OUTREACH ─── */}
        {tab==="outreach"&&<>
          <SectionTitle>Outreach Board</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>External communities we're reaching out to. Add updates to log your progress.</p>
          {outreach.length===0?<EmptyState icon="🌐" title="No outreach targets yet" sub="The team will add communities here as they're identified."/>:(
            <div style={{display:"grid",gap:10}}>
              {outreach.map(o=>{const sc=OUTREACH_STATUS[o.status]||OUTREACH_STATUS.not_started;return (
                <Card key={o.id}>
                  <div style={{marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontFamily:sans,fontSize:16,fontWeight:700,color:T.text}}>{o.communityName}</span>
                      <span style={{fontFamily:mono,fontSize:10,padding:"2px 8px",borderRadius:4,background:`${sc.color}20`,color:sc.color,fontWeight:600}}>{sc.label}</span>
                      <span style={{fontFamily:mono,fontSize:10,color:T.textMuted,background:`${T.teal}10`,padding:"2px 8px",borderRadius:4}}>{o.platform}</span>
                    </div>
                    {o.contactInfo&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:4}}>Contact: {o.contactInfo}</div>}
                    {o.restrictions&&<div style={{fontFamily:mono,fontSize:11,color:T.warning,marginBottom:4}}>⚠ {o.restrictions}</div>}
                    {o.notes&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,fontStyle:"italic"}}>{o.notes}</div>}
                  </div>
                  {/* Log */}
                  {o.log&&o.log.length>0&&<div style={{borderTop:`1px solid ${T.surfaceLight}`,paddingTop:8,marginBottom:8}}>
                    <div style={{fontFamily:mono,fontSize:9,color:T.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Update Log</div>
                    {[...o.log].reverse().slice(0,5).map((l,i)=>(
                      <div key={i} style={{fontFamily:mono,fontSize:10,color:T.textMuted,lineHeight:1.6,display:"flex",gap:8}}>
                        <span style={{flexShrink:0}}>{fmtDateTime(l.date)}</span>
                        <span>{l.text}{l.by&&<span style={{color:T.teal}}> — {l.by}</span>}</span>
                      </div>
                    ))}
                    {o.log.length>5&&<div style={{fontFamily:mono,fontSize:10,color:T.textMuted,marginTop:2}}>+ {o.log.length-5} more</div>}
                  </div>}
                  {/* Add update */}
                  {logTarget===o.id?(
                    <div style={{borderTop:`1px solid ${T.surfaceLight}`,paddingTop:10}}>
                      {logSaved===o.id?<div style={{fontFamily:mono,fontSize:11,color:T.success,textAlign:"center",padding:8}}>✓ Update logged</div>:(
                        <div style={{display:"flex",gap:8,alignItems:"end"}}>
                          <div style={{flex:1}}><Inp value={logText} onChange={setLogText} ph="What happened? Any progress?"/></div>
                          <Btn onClick={()=>handleOutreachLog(o.id)} style={{flexShrink:0,fontSize:11,padding:"9px 14px"}}>Log</Btn>
                          <Btn v="ghost" onClick={()=>{setLogTarget(null);setLogText("")}} style={{flexShrink:0,fontSize:11,padding:"9px 10px"}}>×</Btn>
                        </div>
                      )}
                    </div>
                  ):(
                    <button onClick={()=>setLogTarget(o.id)} style={{fontFamily:mono,fontSize:11,color:T.teal,background:"none",border:"none",cursor:"pointer",padding:0,marginTop:4}}>+ Add update</button>
                  )}
                </Card>
              )})}
            </div>
          )}
        </>}

        {/* ─── EVENTS ─── */}
        {tab==="events"&&<>
          <SectionTitle>Upcoming Events</SectionTitle>
          {events.length===0?<EmptyState icon="📅" title="No events scheduled" sub="Check back soon for upcoming events and dates."/>:(
            <div style={{display:"grid",gap:10}}>
              {[...events].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>{
                const isPast=new Date(e.date)<new Date();
                return (
                  <Card key={e.id} style={{opacity:isPast?0.5:1,borderLeft:`3px solid ${isPast?T.textMuted:e.type==="mandatory"?T.warning:T.teal}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:8}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontFamily:sans,fontSize:15,fontWeight:700,color:T.text}}>{e.title}</span>
                          {e.type==="mandatory"&&<span style={{fontFamily:mono,fontSize:9,background:`${T.warning}20`,color:T.warning,padding:"2px 8px",borderRadius:4,fontWeight:600}}>REQUIRED</span>}
                          {isPast&&<span style={{fontFamily:mono,fontSize:9,color:T.textMuted}}>PAST</span>}
                        </div>
                        <div style={{fontFamily:mono,fontSize:12,color:T.teal,marginBottom:6}}>
                          {new Date(e.date).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                          {e.time&&` · ${e.time}`}
                        </div>
                        {e.description&&<div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.6}}>{e.description}</div>}
                        {e.link&&<a href={e.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:mono,fontSize:11,color:T.teal,textDecoration:"none",marginTop:6,display:"inline-block"}}>🔗 Join / Details →</a>}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>}

        {/* ─── PERKS & INFO ─── */}
        {tab==="perks"&&<>
          <SectionTitle>Your Ambassador Perks</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:28}}>
            <PerkCard icon="⭐" title="Free Premium" desc="Full Premium access for the duration of your ambassadorship."/>
            <PerkCard icon="🚀" title="Early Access" desc="Community features, moderation tools, and new releases before the public."/>
            <PerkCard icon="🎯" title="Direct Influence" desc="Monthly Council calls. Vote on priorities. Your ideas ship with your name."/>
            <PerkCard icon="🏅" title="Official Status" desc="Ambassador badge, highlighted profile, featured on the website."/>
            <PerkCard icon="📈" title="Career Value" desc="LinkedIn shoutouts, reference letters, first look at paid roles."/>
            <PerkCard icon="🎪" title="Exclusive Events" desc="Ambassador-only livestreams, case nights, AMAs with guests."/>
          </div>

          <SectionTitle>What We Ask</SectionTitle>
          <Card hover={false} style={{marginBottom:28}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20}}>
              <div>
                <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.teal,marginBottom:8}}>Weekly Rhythm</div>
                <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                  1 quality post per week<br/>5 meaningful interactions<br/>Welcome a few new members<br/>1 feedback moment per month
                </div>
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.teal,marginBottom:8}}>Standards</div>
                <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                  Be respectful, curious, evidence-minded<br/>Label speculation as speculation<br/>No harassment or pile-ons<br/>Encourage structured discussion
                </div>
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:14,fontWeight:700,color:T.teal,marginBottom:8}}>Term Structure</div>
                <div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.8}}>
                  30-day trial to start<br/>90-day renewable terms<br/>Stay active = keep all perks<br/>2-4 week inactivity = pause
                </div>
              </div>
            </div>
          </Card>
        </>}

        {/* ─── SOCIALS ─── */}
        {tab==="socials"&&<>
          <SectionTitle>Nanu Socials</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>Share these links to help spread the word. Click to copy.</p>
          {socials.length===0?<EmptyState icon="🔗" title="No social links yet" sub="Social links will appear here once added by the team."/>:(
            <div style={{display:"grid",gap:8}}>
              {socials.map(s=>(
                <Card key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",flexWrap:"wrap",gap:10,cursor:"pointer"}} hover={true}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{s.platform}</div>
                    <div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.url}</div>
                  </div>
                  <button onClick={()=>copyLink(s.url)} style={{fontFamily:mono,fontSize:11,color:copied===s.url?T.success:T.teal,background:copied===s.url?`${T.success}15`:`${T.teal}10`,border:`1px solid ${copied===s.url?T.success:T.teal}30`,padding:"6px 14px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",flexShrink:0}}>
                    {copied===s.url?"✓ Copied":"Copy Link"}
                  </button>
                </Card>
              ))}
            </div>
          )}
        </>}

        <div style={{textAlign:"center",marginTop:40,paddingTop:16,borderTop:`1px solid ${T.surfaceLight}`,fontFamily:mono,fontSize:9,color:T.textMuted}}>Nanu Ambassador Hub · Unknown Systems Ltd · {new Date().getFullYear()}</div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ────────────────────────────────────────────────────────
const AdminDashboard=({settings,onUpdateSettings,onLogout})=>{
  const T=useTheme();const[tab,setTab]=useState("ambassadors");
  const[ambassadors,setAmbassadors]=useState([]);const[prompts,setPrompts]=useState([]);const[resources,setResources]=useState([]);
  const[feedback,setFeedback]=useState([]);const[recruits,setRecruits]=useState([]);const[activity,setActivity]=useState([]);const[applications,setApplications]=useState([]);
  const[events,setEvents]=useState([]);const[socials,setSocials]=useState([]);const[outreach,setOutreach]=useState([]);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[showPromptForm,setShowPromptForm]=useState(false);const[showResourceForm,setShowResourceForm]=useState(false);
  const[showSettings,setShowSettings]=useState(false);const[confirmDelete,setConfirmDelete]=useState(null);
  const[showEventForm,setShowEventForm]=useState(false);const[showSocialForm,setShowSocialForm]=useState(false);
  const[showOutreachForm,setShowOutreachForm]=useState(false);const[editingOutreach,setEditingOutreach]=useState(null);
  const[filter,setFilter]=useState("all");const[loaded,setLoaded]=useState(false);

  useEffect(()=>{(async()=>{setAmbassadors(await load(KEYS.ambassadors,[]));setPrompts(await load(KEYS.prompts,[]));setResources(await load(KEYS.resources,[]));setFeedback(await load(KEYS.feedback,[]));setRecruits(await load(KEYS.recruits,[]));setActivity(await load(KEYS.activity,[]));setApplications(await load(KEYS.applications,[]));setEvents(await load(KEYS.events,[]));setSocials(await load(KEYS.socials,[]));setOutreach(await load(KEYS.outreach,[]));setLoaded(true)})()},[]);

  const up=(k,s)=>d=>{s(d);sv(k,d)};
  const sA=up(KEYS.ambassadors,setAmbassadors),sP=up(KEYS.prompts,setPrompts),sR=up(KEYS.resources,setResources),sF=up(KEYS.feedback,setFeedback),sAp=up(KEYS.applications,setApplications),sEv=up(KEYS.events,setEvents),sSo=up(KEYS.socials,setSocials),sOr=up(KEYS.outreach,setOutreach);
  const saveAmb=a=>{sA(editing?ambassadors.map(x=>x.id===a.id?a:x):[...ambassadors,a]);setShowForm(false);setEditing(null)};
  const delAmb=id=>{sA(ambassadors.filter(a=>a.id!==id));setConfirmDelete(null)};
  const savePr=p=>{sP([...prompts,p]);setShowPromptForm(false)};const delPr=id=>sP(prompts.filter(p=>p.id!==id));
  const saveRe=r=>{sR([...resources,r]);setShowResourceForm(false)};const delRe=id=>sR(resources.filter(r=>r.id!==id));
  const delFb=id=>sF(feedback.filter(f=>f.id!==id));
  const updateAppStatus=(id,status)=>sAp(applications.map(a=>a.id===id?{...a,status}:a));
  const delApp=id=>sAp(applications.filter(a=>a.id!==id));
  const saveEvent=e=>{sEv([...events,e]);setShowEventForm(false)};const delEvent=id=>sEv(events.filter(e=>e.id!==id));
  const saveSocial=s=>{sSo([...socials,s]);setShowSocialForm(false)};const delSocial=id=>sSo(socials.filter(s=>s.id!==id));
  const saveOutreach=o=>{sOr(editingOutreach?outreach.map(x=>x.id===o.id?o:x):[...outreach,o]);setShowOutreachForm(false);setEditingOutreach(null)};
  const delOutreach=id=>sOr(outreach.filter(o=>o.id!==id));
  const updateOutreachStatus=(id,status)=>sOr(outreach.map(o=>o.id===id?{...o,status,log:[...(o.log||[]),{date:new Date().toISOString(),text:`Status changed to ${OUTREACH_STATUS[status]?.label}`,by:"Admin"}]}:o));
  const bulkStatus=(f,t)=>{if(f===t)return;sA(ambassadors.map(a=>a.status===f?{...a,status:t}:a))};

  const filtered=filter==="all"?ambassadors:ambassadors.filter(a=>a.status===filter);
  const totalRecruited=recruits.length;const activeCount=ambassadors.filter(a=>["active","trial"].includes(a.status)).length;
  const urgentRenewals=ambassadors.filter(a=>daysLeft(a)<=7&&["active","trial"].includes(a.status)).length;

  const pendingApps=applications.filter(a=>a.status==="pending").length;
  const tabs=[{key:"ambassadors",label:"Ambassadors",icon:"👥"},{key:"applications",label:`Applications${pendingApps?` (${pendingApps})`:""}`,icon:"📋"},{key:"outreach",label:`Outreach (${outreach.length})`,icon:"🌐"},{key:"events",label:`Events (${events.length})`,icon:"📅"},{key:"socials",label:`Socials (${socials.length})`,icon:"🔗"},{key:"prompts",label:"Prompts",icon:"💡"},{key:"toolkit",label:"Toolkit",icon:"📦"},{key:"recruits",label:`Recruits (${recruits.length})`,icon:"🎯"},{key:"activity",label:`Activity (${activity.length})`,icon:"📝"},{key:"feedback",label:`Feedback (${feedback.length})`,icon:"💬"}];

  if(!loaded)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMuted,fontFamily:mono}}>Loading...</div>;

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 10% 0%,${T.surfaceLight}30 0%,${T.bg} 50%)`,color:T.text}}>
      <Noise/>
      <Header title="Ambassador Hub" subtitle="Admin Dashboard" right={<>
        <Btn onClick={()=>{setEditing(null);setShowForm(true);setTab("ambassadors")}} style={{fontSize:12}}>+ Add Ambassador</Btn>
        <button onClick={()=>setShowSettings(true)} style={{background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>(e.currentTarget.style.background=T.surfaceLight)} onMouseLeave={e=>(e.currentTarget.style.background="none")}><GearIcon size={20} color={T.textMuted}/></button>
        <Btn v="ghost" onClick={onLogout} style={{fontSize:11}}>Sign Out</Btn>
      </>}/>
      <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
          <StatCard label="Ambassadors" value={ambassadors.length} sub={`${activeCount} active`}/>
          <StatCard label="Recruits" value={totalRecruited} sub="logged" accent={T.lightTeal}/>
          <StatCard label="Activities" value={activity.length} sub="logged"/>
          <StatCard label="Renewals" value={urgentRenewals} sub="within 7d" accent={urgentRenewals>0?T.warning:T.success}/>
        </div>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>

        {/* AMBASSADORS */}
        {tab==="ambassadors"&&<>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontFamily:mono,fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginRight:6}}>Filter:</span>
            {[{k:"all",l:"All"},...Object.entries(STATUS).map(([k,v])=>({k,l:v.label}))].map(f=>(
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,background:filter===f.k?`${T.teal}20`:"transparent",color:filter===f.k?T.teal:T.textMuted,transition:"all 0.2s"}}>{f.l}</button>
            ))}
          </div>
          {filtered.length===0?<EmptyState title={ambassadors.length===0?"No ambassadors yet":"No matches"} sub={ambassadors.length===0?"Add your first ambassador.":"Try another filter."} action={ambassadors.length===0&&<Btn onClick={()=>{setEditing(null);setShowForm(true)}}>+ Add First Ambassador</Btn>}/>:(
            <div style={{display:"grid",gap:10}}>{filtered.map(a=>{const rem=daysLeft(a);const term=a.status==="trial"?30:90;const ambRecruits=recruits.filter(r=>r.ambassadorId===a.id).length;const ambActs=activity.filter(ac=>ac.ambassadorId===a.id).length;return(
              <Card key={a.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}><span style={{fontFamily:sans,fontSize:17,fontWeight:700,color:T.text}}>{a.name||"Unnamed"}</span><Badge status={a.status}/>{a.focus&&a.focus!=="both"&&<span style={{fontFamily:mono,fontSize:10,padding:"2px 8px",borderRadius:4,background:`${T.teal}10`,color:T.teal,border:`1px solid ${T.teal}20`}}>{a.focus==="internal"?"Internal":"External"}</span>}</div>
                    {a.bio&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:8,lineHeight:1.5}}>{a.bio}</div>}
                    <div style={{display:"flex",gap:14,flexWrap:"wrap",fontFamily:mono,fontSize:11,color:T.textMuted}}>
                      {a.email&&<span>✉ {a.email}</span>}{a.discord&&<span>💬 {a.discord}</span>}{a.twitter&&<span>𝕏 {a.twitter}</span>}{a.linkedin&&<span>in {a.linkedin}</span>}{a.youtube&&<span>▶ {a.youtube}</span>}{a.tiktok&&<span>♪ {a.tiktok}</span>}{a.reddit&&<span>⬡ {a.reddit}</span>}{a.instagram&&<span>📷 {a.instagram}</span>}{a.podcast&&<span>🎙 {a.podcast}</span>}{a.facebook&&<span>f {a.facebook}</span>}{a.website&&<span>🔗 {a.website}</span>}
                    </div>
                    <div style={{display:"flex",gap:20,marginTop:12,flexWrap:"wrap",alignItems:"end"}}>
                      <div><div style={{fontFamily:mono,fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Code</div><div style={{fontFamily:mono,fontSize:12,color:T.lightTeal,marginTop:1}}>{a.inviteCode||"—"}</div></div>
                      <div><div style={{fontFamily:mono,fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Recruits</div><div style={{fontFamily:sans,fontSize:18,fontWeight:700,color:T.teal}}>{ambRecruits}</div></div>
                      <div><div style={{fontFamily:mono,fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Activities</div><div style={{fontFamily:sans,fontSize:18,fontWeight:700,color:T.teal}}>{ambActs}</div></div>
                      <div><div style={{fontFamily:mono,fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Started</div><div style={{fontFamily:mono,fontSize:12,color:T.text,marginTop:1}}>{fmtDate(a.startDate)}</div></div>
                      <div style={{minWidth:100}}><div style={{fontFamily:mono,fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{rem}d left</div><GlowBar pct={((term-rem)/term)*100} color={rem<=7?STATUS.trial.color:T.teal}/></div>
                    </div>
                    {a.notes&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:8,fontStyle:"italic"}}>"{a.notes}"</div>}
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn v="secondary" onClick={()=>{setEditing(a);setShowForm(true)}} style={{padding:"5px 10px",fontSize:11}}>Edit</Btn>
                    {confirmDelete===a.id?<><Btn v="danger" onClick={()=>delAmb(a.id)} style={{padding:"5px 10px",fontSize:11}}>Confirm</Btn><Btn v="ghost" onClick={()=>setConfirmDelete(null)} style={{padding:"5px 10px",fontSize:11}}>Cancel</Btn></>:<Btn v="danger" onClick={()=>setConfirmDelete(a.id)} style={{padding:"5px 10px",fontSize:11}}>×</Btn>}
                  </div>
                </div>
              </Card>
            )})}</div>
          )}
        </>}

        {/* PROMPTS */}
        {tab==="prompts"&&<>
          <SectionTitle right={<Btn onClick={()=>setShowPromptForm(true)} style={{fontSize:12}}>+ New Prompt</Btn>}>Weekly Prompts</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>Latest = "current" in ambassador portal.</p>
          {prompts.length===0?<EmptyState icon="💡" title="No prompts" sub="Create one to guide ambassadors." action={<Btn onClick={()=>setShowPromptForm(true)}>+ Create Prompt</Btn>}/>:(
            <div style={{display:"grid",gap:10}}>{[...prompts].reverse().map((p,i)=>(<Card key={p.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>{i===0&&<span style={{fontFamily:mono,fontSize:9,color:"#0D1B21",background:T.teal,padding:"2px 8px",borderRadius:4,fontWeight:700}}>CURRENT</span>}<span style={{fontFamily:sans,fontSize:15,fontWeight:600,color:T.text}}>{p.title}</span></div><div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{p.body}</div><div style={{display:"flex",gap:12,marginTop:8,fontFamily:mono,fontSize:10,color:T.textMuted}}>{p.category&&<span style={{color:T.teal}}>{p.category}</span>}<span>{fmtDate(p.date)}</span></div></div><Btn v="danger" onClick={()=>delPr(p.id)} style={{padding:"4px 10px",fontSize:11}}>×</Btn></div></Card>))}</div>
          )}
        </>}

        {/* TOOLKIT */}
        {tab==="toolkit"&&<>
          <SectionTitle right={<Btn onClick={()=>setShowResourceForm(true)} style={{fontSize:12}}>+ Add Resource</Btn>}>Toolkit</SectionTitle>
          {resources.length===0?<EmptyState icon="📦" title="No resources" sub="Add links for ambassadors." action={<Btn onClick={()=>setShowResourceForm(true)}>+ Add Resource</Btn>}/>:(
            <div style={{display:"grid",gap:10}}>{resources.map(r=>(<Card key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",flexWrap:"wrap",gap:10}}><div style={{minWidth:0,flex:1}}><div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{r.name}</div><div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:2}}>{r.description||r.url}</div></div><div style={{display:"flex",gap:6,flexShrink:0}}><a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:mono,fontSize:11,color:T.teal,textDecoration:"none",padding:"5px 12px",border:`1px solid ${T.teal}`,borderRadius:6}}>Open →</a><Btn v="danger" onClick={()=>delRe(r.id)} style={{padding:"5px 10px",fontSize:11}}>×</Btn></div></Card>))}</div>
          )}
        </>}

        {/* RECRUITS (admin view) */}
        {tab==="recruits"&&<>
          <SectionTitle>All Recruits</SectionTitle>
          {recruits.length===0?<EmptyState icon="🎯" title="No recruits logged" sub="Ambassadors log recruits from their portal."/>:(
            <div style={{display:"grid",gap:8}}>{[...recruits].reverse().map(r=>(<Card key={r.id} style={{padding:"14px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><div><div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{r.name}</div><div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:2}}>by <strong>{r.ambassadorName}</strong>{r.notes&&` · ${r.notes}`}</div></div><div style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDateTime(r.date)}</div></div></Card>))}</div>
          )}
        </>}

        {/* ACTIVITY (admin view) */}
        {tab==="activity"&&<>
          <SectionTitle>All Activity</SectionTitle>
          {activity.length===0?<EmptyState icon="📝" title="No activity logged" sub="Ambassadors log activity from their portal."/>:(
            <div style={{display:"grid",gap:8}}>{[...activity].reverse().map(a=>(<Card key={a.id} style={{padding:"14px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:8}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.text}}>{a.ambassadorName}</span><span style={{fontFamily:mono,fontSize:10,background:`${T.teal}15`,color:T.teal,padding:"2px 8px",borderRadius:4}}>{a.type}</span><span style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDateTime(a.date)}</span></div><div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.5}}>{a.description}</div>{a.link&&<a href={a.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:mono,fontSize:11,color:T.teal,textDecoration:"none",marginTop:4,display:"inline-block"}}>🔗 {a.link}</a>}</div></div></Card>))}</div>
          )}
        </>}

        {/* FEEDBACK */}
        {tab==="feedback"&&<>
          <SectionTitle>Feedback</SectionTitle>
          {feedback.length===0?<EmptyState icon="💬" title="No feedback" sub="Ambassador submissions appear here."/>:(
            <div style={{display:"grid",gap:10}}>{[...feedback].reverse().map(f=>(<Card key={f.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}><span style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{f.ambassadorName||"Unknown"}</span><span style={{fontFamily:mono,fontSize:10,background:`${T.teal}15`,color:T.teal,padding:"2px 8px",borderRadius:4}}>{f.type}</span><span style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDate(f.date)}</span></div><div style={{fontFamily:mono,fontSize:12,color:T.textMuted,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{f.message}</div></div><Btn v="danger" onClick={()=>delFb(f.id)} style={{padding:"4px 10px",fontSize:11}}>×</Btn></div></Card>))}</div>
          )}
        </>}

        {/* APPLICATIONS */}
        {tab==="applications"&&<>
          <SectionTitle>Applications</SectionTitle>
          {(()=>{const appFilter=filter==="all"?applications:applications.filter(a=>a.status===filter);return <>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {["all","pending","approved","rejected"].map(s=>{
                const count=s==="all"?applications.length:applications.filter(a=>a.status===s).length;
                return <button key={s} onClick={()=>setFilter(s)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,background:filter===s?`${T.teal}20`:"transparent",color:filter===s?T.teal:T.textMuted,transition:"all 0.2s",textTransform:"capitalize"}}>{s} ({count})</button>
              })}
            </div>
            {appFilter.length===0?<EmptyState icon="📋" title={applications.length===0?"No applications yet":"No matches"} sub="Applications from the public form appear here."/>:(
              <div style={{display:"grid",gap:10}}>
                {[...appFilter].reverse().map(a=>(
                  <Card key={a.id}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontFamily:sans,fontSize:16,fontWeight:700,color:T.text}}>{a.name}</span>
                          <span style={{fontFamily:mono,fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:600,
                            background:a.status==="pending"?`${T.warning}20`:a.status==="approved"?`${T.success}20`:`${T.danger}20`,
                            color:a.status==="pending"?T.warning:a.status==="approved"?T.success:T.danger,
                          }}>{a.status}</span>
                          <span style={{fontFamily:mono,fontSize:10,color:T.textMuted}}>{fmtDate(a.date)}</span>
                        </div>
                        <div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:8}}>{a.email}{a.location&&` · ${a.location}`}{a.timezone&&` (${a.timezone})`}</div>
                        <div style={{fontFamily:mono,fontSize:12,color:T.text,lineHeight:1.6,marginBottom:10,whiteSpace:"pre-wrap",background:T.inputBg,padding:12,borderRadius:8,border:`1px solid ${T.surfaceLight}`}}>
                          <div style={{fontFamily:mono,fontSize:9,color:T.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Why they want to join</div>
                          {a.motivation}
                        </div>
                        {a.categories&&a.categories.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{a.categories.map(c=> <span key={c} style={{fontFamily:mono,fontSize:10,padding:"2px 8px",borderRadius:4,background:`${T.teal}10`,color:T.teal,border:`1px solid ${T.teal}20`}}>{c}</span>)}</div>}
                        {a.heardFrom&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:8}}>Heard via: {a.heardFrom}</div>}
                        <div style={{display:"flex",gap:12,flexWrap:"wrap",fontFamily:mono,fontSize:11,color:T.textMuted}}>
                          {a.twitter&&<span>𝕏 {a.twitter}</span>}{a.discord&&<span>💬 {a.discord}</span>}{a.youtube&&<span>▶ {a.youtube}</span>}{a.tiktok&&<span>♪ {a.tiktok}</span>}{a.reddit&&<span>⬡ {a.reddit}</span>}{a.instagram&&<span>📷 {a.instagram}</span>}{a.linkedin&&<span>in {a.linkedin}</span>}{a.podcast&&<span>🎙 {a.podcast}</span>}{a.website&&<span>🔗 {a.website}</span>}
                        </div>
                        {a.audienceSize&&<div style={{fontFamily:mono,fontSize:11,color:T.teal,marginTop:4}}>Audience: ~{a.audienceSize}</div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                        {a.status==="pending"&&<>
                          <Btn onClick={()=>updateAppStatus(a.id,"approved")} style={{padding:"5px 12px",fontSize:11,background:T.success,color:"#fff",border:"none"}}>Approve</Btn>
                          <Btn v="danger" onClick={()=>updateAppStatus(a.id,"rejected")} style={{padding:"5px 12px",fontSize:11}}>Reject</Btn>
                        </>}
                        {a.status!=="pending"&&<Btn v="ghost" onClick={()=>updateAppStatus(a.id,"pending")} style={{padding:"5px 10px",fontSize:10}}>↩ Revert</Btn>}
                        <Btn v="danger" onClick={()=>delApp(a.id)} style={{padding:"5px 10px",fontSize:10}}>Delete</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>})()}
        </>}

        {/* EVENTS */}
        {tab==="events"&&<>
          <SectionTitle right={<Btn onClick={()=>setShowEventForm(true)} style={{fontSize:12}}>+ Add Event</Btn>}>Events Calendar</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>Ambassadors see these in their portal.</p>
          {events.length===0?<EmptyState icon="📅" title="No events" sub="Add events for ambassadors to track." action={<Btn onClick={()=>setShowEventForm(true)}>+ Add First Event</Btn>}/>:(
            <div style={{display:"grid",gap:10}}>
              {[...events].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>{
                const isPast=new Date(e.date)<new Date();
                return (
                  <Card key={e.id} style={{opacity:isPast?0.6:1,borderLeft:`3px solid ${e.type==="mandatory"?T.warning:T.teal}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontFamily:sans,fontSize:15,fontWeight:700,color:T.text}}>{e.title}</span>
                          {e.type==="mandatory"&&<span style={{fontFamily:mono,fontSize:9,background:`${T.warning}20`,color:T.warning,padding:"2px 8px",borderRadius:4,fontWeight:600}}>REQUIRED</span>}
                          {isPast&&<span style={{fontFamily:mono,fontSize:9,color:T.textMuted}}>PAST</span>}
                        </div>
                        <div style={{fontFamily:mono,fontSize:12,color:T.teal,marginBottom:4}}>
                          {new Date(e.date).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}{e.time&&` · ${e.time}`}
                        </div>
                        {e.description&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,lineHeight:1.5}}>{e.description}</div>}
                        {e.link&&<div style={{fontFamily:mono,fontSize:11,color:T.teal,marginTop:4}}>🔗 {e.link}</div>}
                      </div>
                      <Btn v="danger" onClick={()=>delEvent(e.id)} style={{padding:"5px 10px",fontSize:11}}>×</Btn>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>}

        {/* SOCIALS */}
        {tab==="socials"&&<>
          <SectionTitle right={<Btn onClick={()=>setShowSocialForm(true)} style={{fontSize:12}}>+ Add Social</Btn>}>Nanu Socials</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>Ambassadors can copy these links from their portal.</p>
          {socials.length===0?<EmptyState icon="🔗" title="No social links" sub="Add your Nanu social links for ambassadors to share." action={<Btn onClick={()=>setShowSocialForm(true)}>+ Add First Social</Btn>}/>:(
            <div style={{display:"grid",gap:8}}>
              {socials.map(s=>(
                <Card key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",flexWrap:"wrap",gap:10}}>
                  <div style={{minWidth:0,flex:1}}>
                    <div style={{fontFamily:sans,fontSize:14,fontWeight:600,color:T.text}}>{s.platform}</div>
                    <div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginTop:2}}>{s.url}</div>
                  </div>
                  <Btn v="danger" onClick={()=>delSocial(s.id)} style={{padding:"5px 10px",fontSize:11}}>×</Btn>
                </Card>
              ))}
            </div>
          )}
        </>}

        {/* OUTREACH */}
        {tab==="outreach"&&<>
          <SectionTitle right={<Btn onClick={()=>{setEditingOutreach(null);setShowOutreachForm(true)}} style={{fontSize:12}}>+ Add Target</Btn>}>Outreach Board</SectionTitle>
          <p style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:16,marginTop:-8}}>Track external community outreach. Ambassadors can see and update these.</p>
          {(()=>{const orFilter=filter==="all"?outreach:outreach.filter(o=>o.status===filter);return <>
            <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
              {["all",...Object.keys(OUTREACH_STATUS)].map(s=>{
                const count=s==="all"?outreach.length:outreach.filter(o=>o.status===s).length;
                return <button key={s} onClick={()=>setFilter(s)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:mono,fontSize:11,background:filter===s?`${T.teal}20`:"transparent",color:filter===s?T.teal:T.textMuted,transition:"all 0.2s"}}>{s==="all"?"All":OUTREACH_STATUS[s]?.label} ({count})</button>
              })}
            </div>
            {orFilter.length===0?<EmptyState icon="🌐" title={outreach.length===0?"No outreach targets":"No matches"} sub="Add communities to track outreach progress." action={outreach.length===0&&<Btn onClick={()=>{setEditingOutreach(null);setShowOutreachForm(true)}}>+ Add First Target</Btn>}/>:(
              <div style={{display:"grid",gap:10}}>
                {orFilter.map(o=>{const sc=OUTREACH_STATUS[o.status]||OUTREACH_STATUS.not_started;return (
                  <Card key={o.id}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontFamily:sans,fontSize:16,fontWeight:700,color:T.text}}>{o.communityName}</span>
                          <span style={{fontFamily:mono,fontSize:10,padding:"2px 8px",borderRadius:4,background:`${sc.color}20`,color:sc.color,fontWeight:600}}>{sc.label}</span>
                          <span style={{fontFamily:mono,fontSize:10,color:T.textMuted,background:`${T.teal}10`,padding:"2px 8px",borderRadius:4}}>{o.platform}</span>
                        </div>
                        {o.contactInfo&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:4}}>Contact: {o.contactInfo}</div>}
                        {o.restrictions&&<div style={{fontFamily:mono,fontSize:11,color:T.warning,marginBottom:4}}>⚠ {o.restrictions}</div>}
                        {o.notes&&<div style={{fontFamily:mono,fontSize:11,color:T.textMuted,marginBottom:6,fontStyle:"italic"}}>{o.notes}</div>}
                        {/* Status buttons */}
                        <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                          {Object.entries(OUTREACH_STATUS).map(([k,v])=>(
                            <button key={k} onClick={()=>updateOutreachStatus(o.id,k)} style={{padding:"3px 10px",borderRadius:5,border:`1px solid ${o.status===k?v.color:`${T.surfaceLight}`}`,cursor:"pointer",fontFamily:mono,fontSize:10,background:o.status===k?`${v.color}20`:"transparent",color:o.status===k?v.color:T.textMuted,transition:"all 0.2s"}}>{v.label}</button>
                          ))}
                        </div>
                        {/* Update log */}
                        {o.log&&o.log.length>0&&<div style={{borderTop:`1px solid ${T.surfaceLight}`,paddingTop:8,marginTop:4}}>
                          <div style={{fontFamily:mono,fontSize:9,color:T.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Update Log</div>
                          {[...o.log].reverse().slice(0,5).map((l,i)=>(
                            <div key={i} style={{fontFamily:mono,fontSize:10,color:T.textMuted,lineHeight:1.6,display:"flex",gap:8}}>
                              <span style={{flexShrink:0,color:T.textMuted}}>{fmtDateTime(l.date)}</span>
                              <span>{l.text}{l.by&&<span style={{color:T.teal}}> — {l.by}</span>}</span>
                            </div>
                          ))}
                          {o.log.length>5&&<div style={{fontFamily:mono,fontSize:10,color:T.textMuted,marginTop:4}}>+ {o.log.length-5} more</div>}
                        </div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                        <Btn v="secondary" onClick={()=>{setEditingOutreach(o);setShowOutreachForm(true)}} style={{padding:"5px 10px",fontSize:11}}>Edit</Btn>
                        <Btn v="danger" onClick={()=>delOutreach(o.id)} style={{padding:"5px 10px",fontSize:11}}>×</Btn>
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
            )}
          </>})()}
        </>}

        <div style={{textAlign:"center",marginTop:40,paddingTop:16,borderTop:`1px solid ${T.surfaceLight}`,fontFamily:mono,fontSize:9,color:T.textMuted}}>Nanu Ambassador Hub · Unknown Systems Ltd · {new Date().getFullYear()}</div>
      </div>

      {showForm&&<AmbFormModal amb={editing} onSave={saveAmb} onClose={()=>{setShowForm(false);setEditing(null)}}/>}
      {showPromptForm&&<PromptFormModal onSave={savePr} onClose={()=>setShowPromptForm(false)}/>}
      {showResourceForm&&<ResFormModal onSave={saveRe} onClose={()=>setShowResourceForm(false)}/>}
      {showEventForm&&<EventFormModal onSave={saveEvent} onClose={()=>setShowEventForm(false)}/>}
      {showSocialForm&&<SocialFormModal onSave={saveSocial} onClose={()=>setShowSocialForm(false)}/>}
      {showOutreachForm&&<OutreachFormModal outreach={editingOutreach} onSave={saveOutreach} onClose={()=>{setShowOutreachForm(false);setEditingOutreach(null)}}/>}
      {showSettings&&<SettingsPanel settings={settings} onUpdate={onUpdateSettings} ambassadors={ambassadors} feedback={feedback} onBulkStatus={bulkStatus} onClose={()=>setShowSettings(false)}/>}
    </div>
  );
};

// ─── Form Modals ───
const AmbFormModal=({amb,onSave,onClose})=>{
  const T=useTheme();
  const[f,setF]=useState(amb||{id:uid(),name:"",email:"",discord:"",twitter:"",linkedin:"",youtube:"",tiktok:"",reddit:"",podcast:"",instagram:"",facebook:"",website:"",bio:"",status:"trial",focus:"both",startDate:new Date().toISOString().split("T")[0],inviteCode:"",usersRecruited:0,notes:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const[codeManual,setCodeManual]=useState(!!amb?.inviteCode);
  useEffect(()=>{if(!codeManual&&f.name.length>=3)setF(p=>({...p,inviteCode:genCode(f.name)}))},[f.name]);
  return(
    <Modal onClose={onClose}>
      <h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>{amb?"Edit Ambassador":"Add Ambassador"}</h2>
      <div style={{display:"grid",gap:12}}>
        <Inp label="Full Name" value={f.name} onChange={u("name")} ph="Jane Doe"/>
        <Inp label="Bio" value={f.bio||""} onChange={u("bio")} rows={2} ph="Short intro..."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="Email" value={f.email} onChange={u("email")} type="email" ph="email@example.com"/><Inp label="Discord" value={f.discord} onChange={u("discord")} ph="username"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="Twitter / X" value={f.twitter} onChange={u("twitter")} ph="@handle"/><Inp label="LinkedIn" value={f.linkedin} onChange={u("linkedin")} ph="linkedin.com/in/..."/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="YouTube" value={f.youtube} onChange={u("youtube")} ph="channel"/><Inp label="TikTok" value={f.tiktok} onChange={u("tiktok")} ph="@handle"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="Reddit" value={f.reddit} onChange={u("reddit")} ph="u/username"/><Inp label="Instagram" value={f.instagram} onChange={u("instagram")} ph="@handle"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="Podcast" value={f.podcast} onChange={u("podcast")} ph="name or URL"/><Inp label="Facebook" value={f.facebook} onChange={u("facebook")} ph="page"/></div>
        <Inp label="Website" value={f.website||""} onChange={u("website")} ph="https://..."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}><Sel label="Status" value={f.status} onChange={u("status")} options={Object.entries(STATUS).map(([k,v])=>({value:k,label:v.label}))}/><Sel label="Focus" value={f.focus||"both"} onChange={u("focus")} options={FOCUS_OPTS}/><Inp label="Start Date" value={f.startDate} onChange={u("startDate")} type="date"/></div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:10,alignItems:"end"}}><Inp label="Invite Code (login)" value={f.inviteCode} onChange={v=>{setCodeManual(true);u("inviteCode")(v)}} ph="Auto-generated"/><Inp label="Recruited" value={f.usersRecruited} onChange={v=>u("usersRecruited")(parseInt(v)||0)} type="number"/><button onClick={()=>{setCodeManual(false);setF(p=>({...p,inviteCode:genCode(p.name||"AMB")}))}} style={{background:"none",border:`1px solid ${T.surfaceLight}`,borderRadius:8,cursor:"pointer",padding:"9px 10px",color:T.textMuted,fontFamily:mono,fontSize:10,whiteSpace:"nowrap"}} onMouseEnter={e=>(e.target.style.borderColor=T.teal)} onMouseLeave={e=>(e.target.style.borderColor=T.surfaceLight)}>↻ New</button></div>
        <Inp label="Admin Notes" value={f.notes} onChange={u("notes")} ph="Internal notes..."/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={()=>onSave(f)}>{amb?"Save":"Add Ambassador"}</Btn></div>
    </Modal>
  );
};

const PromptFormModal=({onSave,onClose})=>{const T=useTheme();const[f,setF]=useState({title:"",body:"",category:""});return(<Modal onClose={onClose}><h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>New Prompt</h2><div style={{display:"grid",gap:14}}><Inp label="Title" value={f.title} onChange={v=>setF({...f,title:v})} ph="e.g. Community Spotlight"/><Inp label="Prompt" value={f.body} onChange={v=>setF({...f,body:v})} rows={4} ph="This week's activity..."/><Inp label="Category" value={f.category} onChange={v=>setF({...f,category:v})} ph="e.g. Discussion, Content"/></div><div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={()=>{if(f.title)onSave({...f,id:uid(),date:new Date().toISOString()})}}>Publish</Btn></div></Modal>)};

const ResFormModal=({onSave,onClose})=>{const T=useTheme();const[f,setF]=useState({name:"",url:"",description:"",type:"link"});return (<Modal onClose={onClose}><h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>Add Resource</h2><div style={{display:"grid",gap:14}}><Inp label="Name" value={f.name} onChange={v=>setF({...f,name:v})} ph="e.g. Brand Kit"/><Inp label="URL" value={f.url} onChange={v=>setF({...f,url:v})} ph="https://..."/><Inp label="Description" value={f.description} onChange={v=>setF({...f,description:v})} ph="What's in this?"/><Sel label="Type" value={f.type} onChange={v=>setF({...f,type:v})} options={[{value:"link",label:"Link"},{value:"download",label:"Download"}]}/></div><div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={()=>{if(f.name&&f.url)onSave({...f,id:uid()})}}>Add</Btn></div></Modal>)};

const EventFormModal=({onSave,onClose})=>{
  const T=useTheme();
  const[f,setF]=useState({title:"",date:"",time:"",description:"",link:"",type:"optional"});
  return (
    <Modal onClose={onClose}>
      <h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>Add Event</h2>
      <div style={{display:"grid",gap:14}}>
        <Inp label="Event Title" value={f.title} onChange={v=>setF({...f,title:v})} ph="e.g. Monthly Ambassador Council"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Date" value={f.date} onChange={v=>setF({...f,date:v})} type="date"/>
          <Inp label="Time" value={f.time} onChange={v=>setF({...f,time:v})} ph="e.g. 7:00 PM GMT"/>
        </div>
        <Inp label="Description" value={f.description} onChange={v=>setF({...f,description:v})} rows={3} ph="What's this event about?"/>
        <Inp label="Link (optional)" value={f.link} onChange={v=>setF({...f,link:v})} ph="https://zoom.us/..."/>
        <Sel label="Type" value={f.type} onChange={v=>setF({...f,type:v})} options={[{value:"optional",label:"Optional"},{value:"mandatory",label:"Required / Mandatory"}]}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}>
        <Btn v="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(f.title&&f.date)onSave({...f,id:uid()})}}>Add Event</Btn>
      </div>
    </Modal>
  );
};

const SocialFormModal=({onSave,onClose})=>{
  const T=useTheme();
  const[f,setF]=useState({platform:"",url:""});
  const platforms=["Twitter / X","Instagram","TikTok","LinkedIn","Facebook","YouTube","Discord","Reddit","Website","App Store","Google Play","Other"];
  return (
    <Modal onClose={onClose}>
      <h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>Add Social Link</h2>
      <div style={{display:"grid",gap:14}}>
        <Sel label="Platform" value={f.platform} onChange={v=>setF({...f,platform:v})} options={[{value:"",label:"Select platform..."},...platforms.map(p=>({value:p,label:p}))]}/>
        <Inp label="URL" value={f.url} onChange={v=>setF({...f,url:v})} ph="https://..."/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}>
        <Btn v="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(f.platform&&f.url)onSave({...f,id:uid()})}}>Add</Btn>
      </div>
    </Modal>
  );
};

const OutreachFormModal=({outreach:o,onSave,onClose})=>{
  const T=useTheme();
  const[f,setF]=useState(o||{id:uid(),platform:"Discord",communityName:"",contactInfo:"",status:"not_started",restrictions:"",notes:"",log:[]});
  return (
    <Modal onClose={onClose}>
      <h2 style={{fontFamily:sans,fontSize:20,fontWeight:700,color:T.text,marginBottom:20}}>{o?"Edit Target":"Add Outreach Target"}</h2>
      <div style={{display:"grid",gap:14}}>
        <Sel label="Platform" value={f.platform} onChange={v=>setF({...f,platform:v})} options={PLATFORMS.map(p=>({value:p,label:p}))}/>
        <Inp label="Community Name" value={f.communityName} onChange={v=>setF({...f,communityName:v})} ph="e.g. Strangeora, r/UFOs, UAP Society"/>
        <Inp label="Contact Info" value={f.contactInfo} onChange={v=>setF({...f,contactInfo:v})} ph="Admin name, email, DM handle..."/>
        <Sel label="Status" value={f.status} onChange={v=>setF({...f,status:v})} options={Object.entries(OUTREACH_STATUS).map(([k,v])=>({value:k,label:v.label}))}/>
        <Inp label="Restrictions / Permissions" value={f.restrictions} onChange={v=>setF({...f,restrictions:v})} ph="Any rules about what we can/can't do there..."/>
        <Inp label="Notes" value={f.notes} onChange={v=>setF({...f,notes:v})} rows={2} ph="Any extra context..."/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:24,justifyContent:"flex-end"}}>
        <Btn v="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(f.communityName)onSave(f)}}>{o?"Save":"Add Target"}</Btn>
      </div>
    </Modal>
  );
};

// ────────────────────────────────────────────────────────
// APP ROOT
// ────────────────────────────────────────────────────────
export default function NanuAmbassadorHub(){
  const[role,setRole]=useState(null);const[ambId,setAmbId]=useState(null);
  const[ambassadors,setAmbassadors]=useState([]);const[prompts,setPrompts]=useState([]);const[resources,setResources]=useState([]);
  const[feedback,setFeedback]=useState([]);const[recruits,setRecruits]=useState([]);const[activity,setActivity]=useState([]);
  const[applications,setApplications]=useState([]);
  const[events,setEvents]=useState([]);const[socials,setSocials]=useState([]);const[outreach,setOutreach]=useState([]);
  const[settings,setSettings]=useState(DEFAULT_SETTINGS);const[ready,setReady]=useState(false);

  const reload=async()=>{
    setAmbassadors(await load(KEYS.ambassadors,[]));setPrompts(await load(KEYS.prompts,[]));setResources(await load(KEYS.resources,[]));
    setFeedback(await load(KEYS.feedback,[]));setRecruits(await load(KEYS.recruits,[]));setActivity(await load(KEYS.activity,[]));
    setApplications(await load(KEYS.applications,[]));setEvents(await load(KEYS.events,[]));setSocials(await load(KEYS.socials,[]));
    setOutreach(await load(KEYS.outreach,[]));
    const ls=await load(KEYS.settings,DEFAULT_SETTINGS);setSettings({...DEFAULT_SETTINGS,...ls});
  };

  useEffect(()=>{(async()=>{await reload();setReady(true)})()},[]);

  const handleLogin=(r,id)=>{setRole(r);setAmbId(id)};
  const handleLogout=async()=>{await reload();setRole(null);setAmbId(null)};
  const handleUpdateSettings=async s=>{setSettings(s);await sv(KEYS.settings,s)};
  const handleResetPin=async()=>{const fresh={pin:DEFAULT_SETTINGS.pin,adminUsername:DEFAULT_SETTINGS.adminUsername,masterCode:settings.masterCode||DEFAULT_SETTINGS.masterCode,theme:settings.theme||"dark",welcomeMessage:settings.welcomeMessage||""};try{await window.storage.delete(KEYS.settings)}catch(e){}await sv(KEYS.settings,fresh);setSettings(fresh)};

  // Ambassador self-service handlers
  const handleUpdateProfile=async(profile)=>{const updated=ambassadors.map(a=>a.id===profile.id?{...a,...profile}:a);setAmbassadors(updated);await sv(KEYS.ambassadors,updated)};
  const handleAddRecruit=async(r)=>{const u=[...recruits,r];setRecruits(u);await sv(KEYS.recruits,u)};
  const handleAddActivity=async(a)=>{const u=[...activity,a];setActivity(u);await sv(KEYS.activity,u)};
  const handleSubmitFeedback=async(fb)=>{const u=[...feedback,fb];setFeedback(u);await sv(KEYS.feedback,u)};
  const handleSubmitApplication=async(app)=>{const u=[...applications,app];setApplications(u);await sv(KEYS.applications,u)};
  const handleAddOutreachLog=async(targetId,entry)=>{const updated=outreach.map(o=>o.id===targetId?{...o,log:[...(o.log||[]),entry]}:o);setOutreach(updated);await sv(KEYS.outreach,updated)};

  const theme=settings.theme==="light"?LIGHT:DARK;
  if(!ready) return <div style={{minHeight:"100vh",background:DARK.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:mono,color:DARK.textMuted}}>Loading...</div>;

  return(
    <ThemeCtx.Provider value={theme}>
      <div>
        {!role&&<LoginScreen onLogin={handleLogin} onApply={()=>setRole("apply")} ambassadors={ambassadors} settings={settings} onResetPin={handleResetPin}/>}
        {role==="apply"&&<ApplicationPage onSubmit={handleSubmitApplication} onBack={()=>setRole(null)}/>}
        {role==="ambassador"&&ambId&&ambassadors.find(a=>a.id===ambId)&&<AmbassadorPortal ambassador={ambassadors.find(a=>a.id===ambId)} prompts={prompts} resources={resources} events={events} socials={socials} outreach={outreach} allRecruits={recruits} allActivity={activity} allFeedback={feedback} onUpdateProfile={handleUpdateProfile} onAddRecruit={handleAddRecruit} onAddActivity={handleAddActivity} onSubmitFeedback={handleSubmitFeedback} onAddOutreachLog={handleAddOutreachLog} onLogout={handleLogout}/>}
        {role==="admin"&&<AdminDashboard settings={settings} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout}/>}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
          @keyframes pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.05);opacity:1}}
          *{box-sizing:border-box;margin:0}body{margin:0;background:${theme.bg};transition:background 0.3s}::selection{background:${theme.teal}40}
          ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${theme.bg}}::-webkit-scrollbar-thumb{background:${theme.surfaceLight};border-radius:3px}
        `}</style>
      </div>
    </ThemeCtx.Provider>
  );
}
