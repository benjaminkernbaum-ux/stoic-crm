"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Zap, Globe, Users, Clock, Sparkles } from "lucide-react";

interface FormData {
  name: string; email: string; linkedin: string;
  company: string; teamSize: string; languages: string[];
  bottleneck: string; currentStack: string; timeline: string;
  extra: string;
}

const EMPTY: FormData = { name:"",email:"",linkedin:"",company:"",teamSize:"",languages:[],bottleneck:"",currentStack:"",timeline:"",extra:"" };

function Input({ label, placeholder, value, onChange, type="text", required=true, helper="" }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#FAFAFA", marginBottom:6 }}>
        {label} {required && <span style={{ color:"#A855F7" }}>*</span>}
      </label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid #222", background:"#0A0A0A", color:"#FAFAFA", fontSize:14, outline:"none", transition:"border-color 0.2s", fontFamily:"inherit" }}
        onFocus={e=>{e.target.style.borderColor="#9333EA"}} onBlur={e=>{e.target.style.borderColor="#222"}} />
      {helper && <div style={{ fontSize:11, color:"#52525B", marginTop:4 }}>{helper}</div>}
    </div>
  );
}

function TextArea({ label, placeholder, value, onChange, required=true, helper="" }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#FAFAFA", marginBottom:6 }}>
        {label} {required && <span style={{ color:"#A855F7" }}>*</span>}
      </label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} rows={4}
        style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid #222", background:"#0A0A0A", color:"#FAFAFA", fontSize:14, outline:"none", resize:"vertical", fontFamily:"inherit", transition:"border-color 0.2s" }}
        onFocus={e=>{e.target.style.borderColor="#9333EA"}} onBlur={e=>{e.target.style.borderColor="#222"}} />
      {helper && <div style={{ fontSize:11, color:"#52525B", marginTop:4 }}>{helper}</div>}
    </div>
  );
}

function RadioGroup({ label, options, value, onChange, required=true }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#FAFAFA", marginBottom:10 }}>
        {label} {required && <span style={{ color:"#A855F7" }}>*</span>}
      </label>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {options.map((opt: string) => (
          <button key={opt} type="button" onClick={()=>onChange(opt)}
            style={{ padding:"10px 16px", borderRadius:8, border:`1px solid ${value===opt?"#9333EA":"#222"}`, background:value===opt?"rgba(147,51,234,0.1)":"#0A0A0A", color:value===opt?"#A855F7":"#A1A1AA", fontSize:13, textAlign:"left", cursor:"pointer", transition:"all 0.15s" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, value, onChange, helper="" }: any) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v:string)=>v!==opt) : [...value, opt]);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#FAFAFA", marginBottom:10 }}>
        {label} <span style={{ color:"#A855F7" }}>*</span>
      </label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {options.map((opt: string) => (
          <button key={opt} type="button" onClick={()=>toggle(opt)}
            style={{ padding:"8px 16px", borderRadius:20, border:`1px solid ${value.includes(opt)?"#9333EA":"#222"}`, background:value.includes(opt)?"rgba(147,51,234,0.15)":"#0A0A0A", color:value.includes(opt)?"#A855F7":"#A1A1AA", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>
            {value.includes(opt) ? "✓ " : ""}{opt}
          </button>
        ))}
      </div>
      {helper && <div style={{ fontSize:11, color:"#52525B", marginTop:6 }}>{helper}</div>}
    </div>
  );
}

export default function FoundingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = (key: keyof FormData) => (val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const canNext = () => {
    if (step===0) return form.name.length>=2 && form.email.includes("@") && form.linkedin.includes("linkedin");
    if (step===1) return form.company.length>=1 && form.teamSize && form.languages.length>=1;
    if (step===2) return form.bottleneck.length>=30 && form.timeline;
    return true;
  };

  const isHot = form.timeline==="Esta semana" || form.timeline==="Próximas 2 semanas";
  const isMultilingual = form.languages.length >= 2;

  const handleSubmit = () => {
    console.log("FOUNDING 100 SUBMISSION:", JSON.stringify(form, null, 2));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Inter',sans-serif" }}>
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.5}}
          style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"2px solid #22C55E", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <Check size={28} color="#22C55E" />
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#FAFAFA", marginBottom:8 }}>Você está na waitlist do Founding 100.</h1>
          <p style={{ fontSize:14, color:"#A1A1AA", lineHeight:1.6, marginBottom:24 }}>
            Obrigado por preencher.<br/><br/>
            Vou ler tua resposta hoje à noite e te respondo em {"<"} 24h via:<br/>
            1. LinkedIn DM (se conectados)<br/>
            2. Email (caso contrário)<br/><br/>
            Próximo passo: agendar demo de 15 min — eu rodo os 7 agentes ao vivo contra a tua empresa.
          </p>
          {isMultilingual && (
            <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(147,51,234,0.1)", border:"1px solid rgba(147,51,234,0.3)", marginBottom:16, fontSize:13, color:"#A855F7" }}>
              🌍 Vi que vendes em mais de 1 idioma — vou priorizar tua demo. Te respondo hoje, não amanhã.
            </div>
          )}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:24 }}>
            <a href="https://linkedin.com/in/benjamin-kernbaum-stoic" target="_blank"
              style={{ padding:"10px 20px", borderRadius:8, background:"#9333EA", color:"#fff", fontSize:13, fontWeight:600, textDecoration:"none" }}>
              Voltar ao LinkedIn
            </a>
          </div>
          <div style={{ marginTop:32, fontSize:11, color:"#3F3F46" }}>Benjamin · Stoic CRM</div>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { title: "Identidade", icon: <Users size={16}/>, fields: (
      <>
        <Input label="Nome completo" placeholder="Benjamin Kernbaum" value={form.name} onChange={set("name")} />
        <Input label="Email profissional" placeholder="benjamin@empresa.com" value={form.email} onChange={set("email")} type="email" helper="Pode ser pessoal se ainda não tiveres email da empresa." />
        <Input label="LinkedIn URL" placeholder="linkedin.com/in/seu-perfil" value={form.linkedin} onChange={set("linkedin")} type="url" helper="Pra eu confirmar que somos conectados ou conectar antes da demo." />
      </>
    )},
    { title: "Empresa", icon: <Globe size={16}/>, fields: (
      <>
        <Input label="Nome da empresa" placeholder="Nome da empresa atual ou que estás construindo" value={form.company} onChange={set("company")} />
        <RadioGroup label="Tamanho do time" value={form.teamSize} onChange={set("teamSize")} options={["Solo (só eu)","2-5 pessoas","6-20 pessoas","21-50 pessoas","50+"]} />
        <CheckboxGroup label="Em quais idiomas vendes?" value={form.languages} onChange={set("languages")} options={["Português","Espanhol","Inglês","Francês","Outro"]}
          helper="Stoic é o único CRM com 4 idiomas nativos — quero saber se isso é diferencial pra ti." />
      </>
    )},
    { title: "Caso de uso", icon: <Zap size={16}/>, fields: (
      <>
        <TextArea label="Qual é o teu maior gargalo em sales hoje?" placeholder="Ex: gasto 2h/dia em follow-up manual, ou Apollo é caro demais, ou copy traduzida não converte..." value={form.bottleneck} onChange={set("bottleneck")}
          helper="Sem fórmula correta. Quanto mais específico, mais útil pra demo." />
        <TextArea label="Qual stack tu usas hoje pra sales/marketing?" placeholder="Ex: Pipedrive + Apollo + Lemlist + Mailchimp + ChatGPT" value={form.currentStack} onChange={set("currentStack")} required={false}
          helper="Pra eu calcular o R$ que tu economiza se trocar pelo Stoic." />
        <RadioGroup label="Quando tu queres começar a usar?" value={form.timeline} onChange={set("timeline")} options={["Esta semana","Próximas 2 semanas","Este mês","Próximo trimestre","Estou só conhecendo, sem urgência"]} />
      </>
    )},
    { title: "Confirmação", icon: <Sparkles size={16}/>, fields: (
      <>
        <TextArea label="Algo mais que eu deveria saber?" placeholder="Ex: já comprei outro CRM e cancelei, ou sou agência e quero white-label, ou te conheço de outro projeto..." value={form.extra} onChange={set("extra")} required={false} />
        {isHot && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{ padding:"12px 16px", borderRadius:10, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", marginBottom:16, fontSize:13, color:"#4ADE80" }}>
            🔥 Marcado como prioritário — vou te responder hoje.
          </motion.div>
        )}
      </>
    )},
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Inter',sans-serif" }}>
      <div style={{ maxWidth:520, width:"100%" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:8 }}>
            <Zap size={20} color="#9333EA" />
            <span style={{ fontSize:16, fontWeight:800, color:"#FAFAFA", letterSpacing:"-0.5px" }}>STOIC</span>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#FAFAFA", marginBottom:4, letterSpacing:"-0.5px" }}>Founding 100 Waitlist</h1>
          <p style={{ fontSize:13, color:"#52525B" }}>R$ 297/mês locked-for-life · 7 agentes IA · 100 vagas</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:4, marginBottom:32 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=step ? "#9333EA" : "#1A1A1A", transition:"background 0.3s" }} />
          ))}
        </div>

        {/* Step label */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"rgba(147,51,234,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#A855F7" }}>
            {steps[step].icon}
          </div>
          <span style={{ fontSize:14, fontWeight:600, color:"#A1A1AA" }}>{steps[step].title}</span>
          <span style={{ fontSize:11, color:"#3F3F46", marginLeft:"auto" }}>{step+1}/{steps.length}</span>
        </div>

        {/* Form fields */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}}>
            {steps[step].fields}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
          {step > 0 ? (
            <button onClick={()=>setStep(s=>s-1)} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", borderRadius:8, border:"1px solid #222", background:"transparent", color:"#A1A1AA", fontSize:13, cursor:"pointer" }}>
              <ArrowLeft size={14} /> Voltar
            </button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button onClick={()=>canNext() && setStep(s=>s+1)} disabled={!canNext()}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 24px", borderRadius:8, background: canNext()?"#9333EA":"#1A1A1A", color: canNext()?"#fff":"#52525B", fontSize:13, fontWeight:600, border:"none", cursor: canNext()?"pointer":"not-allowed", transition:"all 0.2s" }}>
              Próximo <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 24px", borderRadius:8, background:"linear-gradient(135deg,#9333EA,#7C3AED)", color:"#fff", fontSize:13, fontWeight:600, border:"none", cursor:"pointer", boxShadow:"0 4px 16px rgba(147,51,234,0.3)" }}>
              <Check size={14} /> Enviar waitlist
            </button>
          )}
        </div>

        <div style={{ textAlign:"center", marginTop:32, fontSize:10, color:"#27272A" }}>
          Stoic CRM · Build-in-public desde dia 0
        </div>
      </div>
    </div>
  );
}
