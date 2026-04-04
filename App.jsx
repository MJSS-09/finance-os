import { useState, useMemo, useEffect, useCallback } from "react";

const COLORS = {
  income: "#1D9E75",
  expense: "#D85A30",
  balance: "#378ADD",
  savings: "#7F77DD",
  cats: ["#378ADD","#1D9E75","#D85A30","#7F77DD","#BA7517","#993556","#0F6E56","#534AB7"],
};

const CATEGORIES = ["Food & Dining","Transport","Shopping","Healthcare","Entertainment","Utilities","Salary","Freelance","Investment","Other"];

const INITIAL_TRANSACTIONS = [
  {id:1,date:"2024-04-01",desc:"Grocery Store",amount:-3200,category:"Food & Dining",type:"expense"},
  {id:2,date:"2024-04-02",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
  {id:3,date:"2024-04-03",desc:"Electric Bill",amount:-2100,category:"Utilities",type:"expense"},
  {id:4,date:"2024-04-04",desc:"Netflix",amount:-649,category:"Entertainment",type:"expense"},
  {id:5,date:"2024-04-05",desc:"Uber Ride",amount:-380,category:"Transport",type:"expense"},
  {id:6,date:"2024-04-06",desc:"Freelance Project",amount:22000,category:"Freelance",type:"income"},
  {id:7,date:"2024-04-08",desc:"Restaurant Dinner",amount:-1800,category:"Food & Dining",type:"expense"},
  {id:8,date:"2024-04-10",desc:"Amazon Shopping",amount:-4200,category:"Shopping",type:"expense"},
  {id:9,date:"2024-04-11",desc:"Doctor Visit",amount:-1500,category:"Healthcare",type:"expense"},
  {id:10,date:"2024-04-12",desc:"Mutual Fund SIP",amount:-5000,category:"Investment",type:"expense"},
  {id:11,date:"2024-04-14",desc:"Petrol",amount:-2500,category:"Transport",type:"expense"},
  {id:12,date:"2024-04-15",desc:"Bonus",amount:15000,category:"Salary",type:"income"},
  {id:13,date:"2024-04-17",desc:"Zomato Order",amount:-650,category:"Food & Dining",type:"expense"},
  {id:14,date:"2024-04-18",desc:"Mobile Recharge",amount:-599,category:"Utilities",type:"expense"},
  {id:15,date:"2024-04-20",desc:"Movie Tickets",amount:-800,category:"Entertainment",type:"expense"},
  {id:16,date:"2024-04-21",desc:"Consulting Fee",amount:12000,category:"Freelance",type:"income"},
  {id:17,date:"2024-04-22",desc:"Gym Membership",amount:-1200,category:"Healthcare",type:"expense"},
  {id:18,date:"2024-04-24",desc:"Clothing Store",amount:-3500,category:"Shopping",type:"expense"},
  {id:19,date:"2024-04-25",desc:"Dividend Income",amount:4500,category:"Investment",type:"income"},
  {id:20,date:"2024-04-28",desc:"Internet Bill",amount:-1499,category:"Utilities",type:"expense"},
  {id:21,date:"2024-03-01",desc:"Grocery Store",amount:-2800,category:"Food & Dining",type:"expense"},
  {id:22,date:"2024-03-02",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
  {id:23,date:"2024-03-05",desc:"Electric Bill",amount:-1900,category:"Utilities",type:"expense"},
  {id:24,date:"2024-03-08",desc:"Freelance Project",amount:18000,category:"Freelance",type:"income"},
  {id:25,date:"2024-03-12",desc:"Petrol",amount:-2200,category:"Transport",type:"expense"},
  {id:26,date:"2024-03-15",desc:"Restaurant",amount:-2100,category:"Food & Dining",type:"expense"},
  {id:27,date:"2024-03-18",desc:"Shopping Mall",amount:-5500,category:"Shopping",type:"expense"},
  {id:28,date:"2024-03-22",desc:"SIP Investment",amount:-5000,category:"Investment",type:"expense"},
  {id:29,date:"2024-03-25",desc:"Netflix",amount:-649,category:"Entertainment",type:"expense"},
  {id:30,date:"2024-03-28",desc:"Water Bill",amount:-450,category:"Utilities",type:"expense"},
  {id:31,date:"2024-02-02",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
  {id:32,date:"2024-02-05",desc:"Grocery",amount:-2600,category:"Food & Dining",type:"expense"},
  {id:33,date:"2024-02-10",desc:"Freelance",amount:8000,category:"Freelance",type:"income"},
  {id:34,date:"2024-02-14",desc:"Valentine Dinner",amount:-3200,category:"Food & Dining",type:"expense"},
  {id:35,date:"2024-02-18",desc:"Transport",amount:-1800,category:"Transport",type:"expense"},
  {id:36,date:"2024-02-22",desc:"Utilities",amount:-2400,category:"Utilities",type:"expense"},
];

const fmt = (n) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fmtShort = (n) => n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:fmt(n);

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = useCallback(v => {
    setVal(p => { const next = typeof v==="function"?v(p):v; try{localStorage.setItem(key,JSON.stringify(next));}catch{} return next; });
  }, [key]);
  return [val, set];
}

function MiniSparkline({ data, color }) {
  const w = 80, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(" ");
  return (
    <svg width={w} height={h} style={{display:"block"}}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} opacity="0.8"/>
    </svg>
  );
}

function BarChart({ data, labels, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:"6px",height:"80px",width:"100%"}}>
      {data.map((v,i) => (
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
          <div style={{width:"100%",background:color,borderRadius:"3px 3px 0 0",height:`${(v/max)*64}px`,minHeight:v>0?2:0,opacity:.85,transition:"height .3s"}}/>
          <span style={{fontSize:"9px",color:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((a,s)=>a+s.value,0)||1;
  let cumulative = 0;
  const r = 42, cx = 50, cy = 50, stroke = 10;
  const paths = segments.map((seg,i) => {
    const pct = seg.value/total;
    const start = cumulative * 2 * Math.PI - Math.PI/2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI/2;
    const x1 = cx + r*Math.cos(start), y1 = cy + r*Math.sin(start);
    const x2 = cx + r*Math.cos(end), y2 = cy + r*Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={seg.color} strokeWidth={stroke} strokeLinecap="butt"/>;
  });
  return (
    <svg viewBox="0 0 100 100" style={{width:"100px",height:"100px",flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke}/>
      {paths}
    </svg>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg-card)",borderRadius:"16px",border:"0.5px solid var(--border)",padding:"24px",width:"100%",maxWidth:"480px",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h3 style={{margin:0,fontSize:"16px",fontWeight:500,color:"var(--text)"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"20px",color:"var(--text-muted)",padding:"0 4px",lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TransactionForm({ onSave, initial, onClose }) {
  const blank = {desc:"",amount:"",category:"Food & Dining",type:"expense",date:new Date().toISOString().slice(0,10)};
  const [form, setForm] = useState(initial||blank);
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.desc||!form.amount||!form.date) return;
    onSave({...form,amount:(form.type==="expense"?-1:1)*Math.abs(parseFloat(form.amount))});
    onClose();
  };
  const inputStyle = {width:"100%",boxSizing:"border-box",padding:"8px 12px",borderRadius:"8px",border:"0.5px solid var(--border)",background:"var(--bg-input)",color:"var(--text)",fontSize:"13px",fontFamily:"inherit",outline:"none"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {[["Description","desc","text"],["Date","date","date"]].map(([label,key,type])=>(
        <div key={key}>
          <label style={{fontSize:"12px",color:"var(--text-muted)",display:"block",marginBottom:"4px"}}>{label}</label>
          <input type={type} value={form[key]} onChange={set(key)} style={inputStyle} placeholder={label}/>
        </div>
      ))}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div>
          <label style={{fontSize:"12px",color:"var(--text-muted)",display:"block",marginBottom:"4px"}}>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={set("amount")} style={inputStyle} placeholder="0"/>
        </div>
        <div>
          <label style={{fontSize:"12px",color:"var(--text-muted)",display:"block",marginBottom:"4px"}}>Type</label>
          <select value={form.type} onChange={set("type")} style={inputStyle}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{fontSize:"12px",color:"var(--text-muted)",display:"block",marginBottom:"4px"}}>Category</label>
        <select value={form.category} onChange={set("category")} style={inputStyle}>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{display:"flex",gap:"10px",marginTop:"4px"}}>
        <button onClick={onClose} style={{flex:1,padding:"8px 16px",borderRadius:"8px",border:"0.5px solid var(--border)",background:"transparent",color:"var(--text)",cursor:"pointer",fontSize:"13px"}}>Cancel</button>
        <button onClick={submit} style={{flex:1,padding:"8px 16px",borderRadius:"8px",border:`0.5px solid ${COLORS.balance}`,background:COLORS.balance+"22",color:COLORS.balance,cursor:"pointer",fontSize:"13px",fontWeight:500}}>
          {initial?"Update":"Add"} Transaction
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useLocalStorage("fin_txns", INITIAL_TRANSACTIONS);
  const [role, setRole] = useLocalStorage("fin_role", "viewer");
  const [darkMode, setDarkMode] = useLocalStorage("fin_dark", false);
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showAdd, setShowAdd] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = role === "admin";

  const dm = darkMode;
  const css = {
    "--bg": dm ? "#0f1117" : "#f4f6fb",
    "--bg-card": dm ? "#161921" : "#ffffff",
    "--bg-input": dm ? "#1a1d27" : "#ffffff",
    "--text": dm ? "#e8eaf0" : "#1a1d27",
    "--text-muted": dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    "--border": dm ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    "--hover": dm ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
    "--row-hover": dm ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
    "--surface": dm ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
  };

  const stats = useMemo(() => {
    const apr = transactions.filter(t=>t.date.startsWith("2024-04"));
    const mar = transactions.filter(t=>t.date.startsWith("2024-03"));
    const income = apr.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
    const expenses = Math.abs(apr.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0));
    const balance = income - expenses;
    const marIncome = mar.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
    const marExpenses = Math.abs(mar.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0));
    const savingsRate = income > 0 ? ((income-expenses)/income*100).toFixed(1) : 0;
    const catMap = {};
    apr.filter(t=>t.type==="expense").forEach(t=>{ catMap[t.category]=(catMap[t.category]||0)+Math.abs(t.amount); });
    const topCat = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
    const totalExp = Object.values(catMap).reduce((a,v)=>a+v,0)||1;
    const weeklyExp = [0,0,0,0];
    apr.filter(t=>t.type==="expense").forEach(t=>{ const d=parseInt(t.date.slice(8,10)); weeklyExp[Math.min(Math.floor((d-1)/7),3)]+=Math.abs(t.amount); });
    const monthlyBalance = [
      {m:"Feb",val:transactions.filter(t=>t.date.startsWith("2024-02")).reduce((a,t)=>a+t.amount,0)},
      {m:"Mar",val:transactions.filter(t=>t.date.startsWith("2024-03")).reduce((a,t)=>a+t.amount,0)},
      {m:"Apr",val:balance},
    ];
    return { income, expenses, balance, marIncome, marExpenses, savingsRate, topCat, totalExp, catMap, weeklyExp, monthlyBalance };
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = transactions.filter(t=>t.date.startsWith("2024-04"));
    if (search) list = list.filter(t=>t.desc.toLowerCase().includes(search.toLowerCase())||t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType!=="all") list = list.filter(t=>t.type===filterType);
    if (filterCat!=="all") list = list.filter(t=>t.category===filterCat);
    return [...list].sort((a,b)=>{
      const dir = sortDir==="asc"?1:-1;
      if (sortBy==="date") return (new Date(a.date)-new Date(b.date))*dir;
      if (sortBy==="amount") return (Math.abs(a.amount)-Math.abs(b.amount))*dir;
      return a.desc.localeCompare(b.desc)*dir;
    });
  }, [transactions, search, filterType, filterCat, sortBy, sortDir]);

  const addTxn = (t) => setTransactions(p=>[...p,{...t,id:Date.now()}]);
  const updateTxn = (t) => setTransactions(p=>p.map(x=>x.id===t.id?t:x));
  const deleteTxn = (id) => { setTransactions(p=>p.filter(x=>x.id!==id)); setDeletingId(null); };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"],...filtered.map(t=>[t.date,t.desc,t.category,t.type,t.amount])];
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(rows.map(r=>r.join(",")).join("\n"));
    a.download = "transactions.csv"; a.click();
  };

  const donutSegs = stats.topCat.slice(0,5).map((c,i)=>({label:c[0],value:c[1],color:COLORS.cats[i],pct:(c[1]/stats.totalExp*100).toFixed(1)}));

  const card = {background:"var(--bg-card)",borderRadius:"14px",border:"0.5px solid var(--border)",padding:"20px"};
  const label = {fontSize:"11px",color:"var(--text-muted)",fontWeight:500,textTransform:"uppercase",letterSpacing:".04em"};
  const inputStyle = {padding:"8px 12px",borderRadius:"8px",border:"0.5px solid var(--border)",background:"var(--bg-input)",color:"var(--text)",fontSize:"13px",fontFamily:"inherit",outline:"none"};

  return (
    <div style={{...css, fontFamily:"'DM Sans', system-ui, sans-serif", background:"var(--bg)", color:"var(--text)", minHeight:"100vh", display:"flex", flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; transition: all .15s; }
        button:active { transform: scale(0.98); }
        input, select { font-family: inherit; }
        input:focus, select:focus { outline: 2px solid ${COLORS.balance}44; outline-offset: 1px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,.3); border-radius: 2px; }
      `}</style>

      {/* HEADER */}
      <header style={{background:"var(--bg-card)",borderBottom:"0.5px solid var(--border)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:0,zIndex:100,gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:COLORS.balance,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="6" width="12" height="7" rx="1.5" stroke="white" strokeWidth="1.2"/>
              <path d="M4 6V4.5a3 3 0 016 0V6" stroke="white" strokeWidth="1.2"/>
            </svg>
          </div>
          <span style={{fontWeight:600,fontSize:"15px",letterSpacing:"-0.02em",color:"var(--text)"}}>FinanceOS</span>
        </div>

        <nav style={{display:"flex",gap:"3px",background:"var(--surface)",borderRadius:"10px",padding:"3px"}}>
          {["dashboard","transactions","insights"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              background:tab===t?"var(--bg-card)":"transparent",
              border:tab===t?"0.5px solid var(--border)":"none",
              borderRadius:"8px",padding:"5px 14px",fontSize:"12px",
              fontWeight:tab===t?500:400,
              color:tab===t?COLORS.balance:"var(--text-muted)",
              textTransform:"capitalize",
            }}>{t}</button>
          ))}
        </nav>

        <div style={{display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,width:"auto",padding:"5px 10px",fontSize:"12px"}}>
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚡ Admin</option>
          </select>
          <button onClick={()=>setDarkMode(p=>!p)} style={{...inputStyle,width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",padding:0}}>
            {dm?"☀":"🌙"}
          </button>
        </div>
      </header>

      {isAdmin && (
        <div style={{background:COLORS.savings+"22",borderBottom:`0.5px solid ${COLORS.savings}44`,padding:"6px 24px",fontSize:"12px",color:COLORS.savings,display:"flex",alignItems:"center",gap:"6px"}}>
          <span style={{width:"6px",height:"6px",borderRadius:"50%",background:COLORS.savings,display:"inline-block"}}/>
          Admin mode — you can add, edit, and delete transactions
        </div>
      )}

      <main style={{flex:1,padding:"20px",maxWidth:"1200px",margin:"0 auto",width:"100%"}}>

        {/* ===== DASHBOARD ===== */}
        {tab==="dashboard" && (
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"12px"}}>
              {[
                {label:"Total Balance",value:fmt(stats.balance),sub:stats.balance>=0?"Surplus this month":"Deficit",color:stats.balance>=0?COLORS.income:COLORS.expense,spark:[40000,52000,48000,61000,stats.balance+10000]},
                {label:"Monthly Income",value:fmt(stats.income),sub:`vs ${fmtShort(stats.marIncome)} last month`,color:COLORS.income,spark:[70000,78000,85000,90000,stats.income]},
                {label:"Monthly Expenses",value:fmt(stats.expenses),sub:`vs ${fmtShort(stats.marExpenses)} last month`,color:COLORS.expense,spark:[20000,24000,28000,22000,stats.expenses]},
                {label:"Savings Rate",value:`${stats.savingsRate}%`,sub:"of income saved",color:COLORS.savings,spark:[28,32,25,38,parseFloat(stats.savingsRate)]},
              ].map(c=>(
                <div key={c.label} style={{...card,display:"flex",flexDirection:"column",gap:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <span style={label}>{c.label}</span>
                    <MiniSparkline data={c.spark} color={c.color}/>
                  </div>
                  <div style={{fontSize:"22px",fontWeight:600,letterSpacing:"-0.03em",color:c.color}}>{c.value}</div>
                  <div style={{fontSize:"11px",color:"var(--text-muted)"}}>{c.sub}</div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"16px"}}>
              <div style={card}>
                <div style={{...label,marginBottom:"16px"}}>Monthly Balance Trend</div>
                <BarChart data={stats.monthlyBalance.map(m=>m.val)} labels={stats.monthlyBalance.map(m=>m.m)} color={COLORS.balance}/>
                <div style={{display:"flex",gap:"16px",marginTop:"12px"}}>
                  {stats.monthlyBalance.map(m=>(
                    <div key={m.m} style={{fontSize:"11px"}}>
                      <span style={{color:"var(--text-muted)"}}>{m.m} </span>
                      <span style={{fontWeight:500,color:m.val>=0?COLORS.income:COLORS.expense}}>{fmtShort(m.val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <div style={{...label,marginBottom:"16px"}}>Spending Breakdown</div>
                <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
                  <DonutChart segments={donutSegs}/>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:"7px",minWidth:0}}>
                    {donutSegs.map(s=>(
                      <div key={s.label} style={{display:"flex",alignItems:"center",gap:"7px"}}>
                        <div style={{width:"8px",height:"8px",borderRadius:"2px",background:s.color,flexShrink:0}}/>
                        <span style={{fontSize:"11px",color:"var(--text-muted)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                        <span style={{fontSize:"11px",fontWeight:500,color:"var(--text)"}}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={{...label,marginBottom:"16px"}}>Weekly Expense Pattern — April</div>
              <BarChart data={stats.weeklyExp} labels={["Week 1","Week 2","Week 3","Week 4"]} color={COLORS.expense}/>
            </div>

            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                <span style={label}>Recent Activity</span>
                <button onClick={()=>setTab("transactions")} style={{...inputStyle,padding:"4px 10px",fontSize:"12px"}}>View all →</button>
              </div>
              {filtered.slice(0,5).map((t,i)=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 0",borderBottom:i<4?`0.5px solid var(--border)`:undefined}}>
                  <div style={{width:"34px",height:"34px",borderRadius:"10px",background:(t.type==="income"?COLORS.income:COLORS.expense)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"16px"}}>
                    {t.type==="income"?"↑":"↓"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"13px",fontWeight:500,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div>
                    <div style={{fontSize:"11px",color:"var(--text-muted)"}}>{t.category} · {t.date.slice(5)}</div>
                  </div>
                  <div style={{fontWeight:600,fontSize:"13px",color:t.type==="income"?COLORS.income:COLORS.expense,fontFamily:"'DM Mono',monospace",flexShrink:0}}>
                    {t.type==="income"?"+":"-"}{fmt(Math.abs(t.amount))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TRANSACTIONS ===== */}
        {tab==="transactions" && (
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
              <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,flex:"1 1 160px",minWidth:"140px"}}/>
              {[
                [filterType,setFilterType,[["all","All Types"],["income","Income"],["expense","Expense"]]],
                [filterCat,setFilterCat,[["all","All Categories"],...CATEGORIES.map(c=>[c,c])]],
                [sortBy,setSortBy,[["date","Date"],["amount","Amount"],["desc","Name"]]],
              ].map(([val,set,opts],i)=>(
                <select key={i} value={val} onChange={e=>set(e.target.value)} style={{...inputStyle,width:"auto"}}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              ))}
              <button onClick={()=>setSortDir(p=>p==="asc"?"desc":"asc")} style={{...inputStyle,width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:"16px"}}>
                {sortDir==="asc"?"↑":"↓"}
              </button>
              {isAdmin && (
                <button onClick={()=>setShowAdd(true)} style={{...inputStyle,background:COLORS.balance+"22",color:COLORS.balance,border:`0.5px solid ${COLORS.balance}55`,fontWeight:500,padding:"8px 14px",whiteSpace:"nowrap"}}>
                  + Add
                </button>
              )}
              <button onClick={exportCSV} style={{...inputStyle,padding:"8px 12px",whiteSpace:"nowrap"}}>Export CSV</button>
            </div>

            <div style={{...card,padding:"12px 16px",display:"flex",gap:"20px",flexWrap:"wrap"}}>
              <span style={{fontSize:"12px",color:"var(--text-muted)"}}>{filtered.length} transactions</span>
              <span style={{fontSize:"12px",color:COLORS.income,fontWeight:500}}>+{fmt(filtered.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0))}</span>
              <span style={{fontSize:"12px",color:COLORS.expense,fontWeight:500}}>-{fmt(Math.abs(filtered.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0)))}</span>
            </div>

            {filtered.length===0 ? (
              <div style={{textAlign:"center",padding:"60px",color:"var(--text-muted)"}}>
                <div style={{fontSize:"32px",marginBottom:"8px"}}>∅</div>
                <div style={{fontSize:"13px"}}>No transactions match your filters</div>
              </div>
            ) : (
              <div style={{...card,padding:0,overflow:"hidden"}}>
                {filtered.map((t,i)=>(
                  <div key={t.id}
                    style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",borderBottom:i<filtered.length-1?"0.5px solid var(--border)":undefined,transition:"background .1s",cursor:"default"}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--row-hover)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{width:"36px",height:"36px",borderRadius:"10px",background:(t.type==="income"?COLORS.income:COLORS.expense)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"16px"}}>
                      {t.type==="income"?"↑":"↓"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"13px",fontWeight:500,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div>
                      <div style={{fontSize:"11px",color:"var(--text-muted)",display:"flex",gap:"6px",marginTop:"2px",flexWrap:"wrap"}}>
                        <span>{t.date}</span>
                        <span>·</span>
                        <span style={{background:"var(--surface)",padding:"1px 6px",borderRadius:"4px"}}>{t.category}</span>
                      </div>
                    </div>
                    <div style={{fontWeight:600,fontSize:"13px",color:t.type==="income"?COLORS.income:COLORS.expense,fontFamily:"'DM Mono',monospace",textAlign:"right",minWidth:"90px",flexShrink:0}}>
                      {t.type==="income"?"+":"-"}{fmt(Math.abs(t.amount))}
                    </div>
                    {isAdmin && (
                      <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                        <button onClick={()=>setEditTxn(t)} style={{...inputStyle,padding:"4px 10px",fontSize:"11px",width:"auto"}}>Edit</button>
                        <button onClick={()=>setDeletingId(t.id)} style={{...inputStyle,padding:"4px 10px",fontSize:"11px",width:"auto",color:COLORS.expense,border:`0.5px solid ${COLORS.expense}55`,background:COLORS.expense+"11"}}>Del</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== INSIGHTS ===== */}
        {tab==="insights" && (
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={card}>
              <div style={{...label,marginBottom:"16px"}}>Category Breakdown — April</div>
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {stats.topCat.map(([cat,val],i)=>{
                  const pct = val/stats.totalExp*100;
                  return (
                    <div key={cat}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                        <span style={{fontSize:"12px",color:"var(--text)",display:"flex",alignItems:"center",gap:"7px"}}>
                          <span style={{width:"8px",height:"8px",borderRadius:"2px",background:COLORS.cats[i]||"#888",display:"inline-block"}}/>
                          {cat}
                        </span>
                        <span style={{fontSize:"12px",fontWeight:500,color:"var(--text)"}}>{fmt(val)} <span style={{color:"var(--text-muted)"}}>({pct.toFixed(0)}%)</span></span>
                      </div>
                      <div style={{height:"6px",borderRadius:"3px",background:"var(--surface)"}}>
                        <div style={{height:"100%",borderRadius:"3px",background:COLORS.cats[i]||"#888",width:`${pct}%`,transition:"width .5s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"16px"}}>
              <div style={card}>
                <div style={{...label,marginBottom:"16px"}}>Key Insights</div>
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                  {[
                    {l:"Highest Spending",v:stats.topCat[0]?`${stats.topCat[0][0]}: ${fmt(stats.topCat[0][1])}`:"None",icon:"↑",color:COLORS.expense},
                    {l:"Savings Rate",v:`${stats.savingsRate}% of income`,icon:"↗",color:COLORS.savings},
                    {l:"Income vs March",v:`${stats.income>=stats.marIncome?"+":"-"}${Math.abs(((stats.income-stats.marIncome)/stats.marIncome)*100).toFixed(0)}% change`,icon:stats.income>=stats.marIncome?"↑":"↓",color:stats.income>=stats.marIncome?COLORS.income:COLORS.expense},
                    {l:"Expenses vs March",v:`${stats.expenses<=stats.marExpenses?"-":"+"}${Math.abs(((stats.expenses-stats.marExpenses)/stats.marExpenses)*100).toFixed(0)}% change`,icon:stats.expenses<=stats.marExpenses?"↓":"↑",color:stats.expenses<=stats.marExpenses?COLORS.income:COLORS.expense},
                  ].map(ins=>(
                    <div key={ins.l} style={{display:"flex",gap:"10px",alignItems:"flex-start",padding:"12px",background:"var(--surface)",borderRadius:"10px"}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"8px",background:ins.color+"22",display:"flex",alignItems:"center",justifyContent:"center",color:ins.color,fontSize:"14px",flexShrink:0}}>{ins.icon}</div>
                      <div>
                        <div style={{fontSize:"11px",color:"var(--text-muted)",marginBottom:"2px"}}>{ins.l}</div>
                        <div style={{fontSize:"13px",fontWeight:500,color:"var(--text)"}}>{ins.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <div style={{...label,marginBottom:"16px"}}>Month Comparison</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
                  {[
                    {l:"April Income",v:fmt(stats.income),color:COLORS.income},
                    {l:"March Income",v:fmt(stats.marIncome),color:"var(--text-muted)"},
                    {l:"April Expenses",v:fmt(stats.expenses),color:COLORS.expense},
                    {l:"March Expenses",v:fmt(stats.marExpenses),color:"var(--text-muted)"},
                  ].map(m=>(
                    <div key={m.l} style={{padding:"12px",background:"var(--surface)",borderRadius:"10px"}}>
                      <div style={{fontSize:"10px",color:"var(--text-muted)",marginBottom:"4px",textTransform:"uppercase",letterSpacing:".04em"}}>{m.l}</div>
                      <div style={{fontSize:"15px",fontWeight:600,color:m.color}}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"14px",background:(stats.balance>=0?COLORS.income:COLORS.expense)+"15",borderRadius:"10px",border:`0.5px solid ${stats.balance>=0?COLORS.income:COLORS.expense}44`}}>
                  <div style={{fontSize:"11px",color:stats.balance>=0?COLORS.income:COLORS.expense,marginBottom:"4px",fontWeight:500}}>Net this month</div>
                  <div style={{fontSize:"20px",fontWeight:700,color:stats.balance>=0?COLORS.income:COLORS.expense}}>{fmt(stats.balance)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Transaction">
        <TransactionForm onSave={addTxn} onClose={()=>setShowAdd(false)}/>
      </Modal>
      <Modal open={!!editTxn} onClose={()=>setEditTxn(null)} title="Edit Transaction">
        {editTxn && <TransactionForm initial={{...editTxn,amount:Math.abs(editTxn.amount)}} onSave={t=>updateTxn({...t,id:editTxn.id})} onClose={()=>setEditTxn(null)}/>}
      </Modal>
      <Modal open={!!deletingId} onClose={()=>setDeletingId(null)} title="Confirm Delete">
        <p style={{fontSize:"13px",color:"var(--text-muted)",marginBottom:"20px",lineHeight:1.6}}>Are you sure you want to delete this transaction? This cannot be undone.</p>
        <div style={{display:"flex",gap:"10px"}}>
          <button onClick={()=>setDeletingId(null)} style={{flex:1,padding:"9px",borderRadius:"8px",border:"0.5px solid var(--border)",background:"transparent",color:"var(--text)"}}>Cancel</button>
          <button onClick={()=>deleteTxn(deletingId)} style={{flex:1,padding:"9px",borderRadius:"8px",border:`0.5px solid ${COLORS.expense}`,background:COLORS.expense+"22",color:COLORS.expense,fontWeight:500}}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}