import React, { useMemo, useState } from 'react';
import {
  Wallet, TrendingUp, PiggyBank, CalendarDays, Plus, ArrowUpRight,
  ArrowDownRight, Utensils, Car, ShoppingBag, ReceiptText, Coffee,
  Zap, Target, ShieldCheck, Sparkles, CircleDollarSign, Trash2,
  Menu, X, ChevronDown, AlertTriangle, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

const initialExpenses = [
  { id: 1, name: 'Groceries', category: 'Food', amount: 650, day: 2, icon: 'food' },
  { id: 2, name: 'Metro card', category: 'Travel', amount: 280, day: 3, icon: 'travel' },
  { id: 3, name: 'Coffee with friends', category: 'Lifestyle', amount: 190, day: 4, icon: 'coffee' },
  { id: 4, name: 'Phone recharge', category: 'Bills', amount: 299, day: 5, icon: 'bills' },
  { id: 5, name: 'Lunch', category: 'Food', amount: 240, day: 6, icon: 'food' },
];
const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Lifestyle', 'Other'];
const colors = ['#8b7cff', '#42d6b4', '#ffb86b', '#ff7e9b', '#65b9ff', '#a9b2c7'];
const iconFor = (name) => ({ food: Utensils, travel: Car, shopping: ShoppingBag, bills: ReceiptText, coffee: Coffee }[name] || CircleDollarSign);
const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

function App() {
  const [budget, setBudget] = useState(10000);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [active, setActive] = useState('Overview');
  const [showForm, setShowForm] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [simAmount, setSimAmount] = useState(500);
  const [simOpen, setSimOpen] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(2000);
  const [goalSaved, setGoalSaved] = useState(650);
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Music subscription', amount: 119, date: '12th' },
    { id: 2, name: 'Cloud storage', amount: 75, date: '18th' },
  ]);
  const [form, setForm] = useState({ name: '', amount: '', category: 'Food' });
  const [toast, setToast] = useState('');

  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = budget - spent;
  const day = 8;
  const daysLeft = 30 - day + 1;
  const daily = Math.max(0, balance / daysLeft);
  const spentPercent = Math.min(100, spent / budget * 100);
  const committed = subscriptions.reduce((sum, item) => sum + item.amount, 0);
  const projected = spent / day * 30 + committed;
  const forecastBalance = budget - projected;
  const risk = balance < 0 || daily < 150 ? 'High' : daily < 250 ? 'Moderate' : 'Low';

  const categoryData = useMemo(() => categories.map((name, i) => ({
    name, value: expenses.filter(e => e.category === name).reduce((sum, e) => sum + e.amount, 0), color: colors[i]
  })).filter(x => x.value > 0), [expenses]);

  const trendData = [
    { day: '1', actual: 0, plan: 0 }, { day: '5', actual: 1050, plan: 1000 },
    { day: '10', actual: 1750, plan: 1650 }, { day: '15', actual: 2250, plan: 2300 },
    { day: '20', actual: 3100, plan: 3000 }, { day: '25', actual: 3900, plan: 4000 },
    { day: '30', actual: 4800, plan: 5000 },
  ];

  function addExpense(e) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setToast('Enter an expense name and a valid amount.');
      return;
    }
    const icon = form.category === 'Food' ? 'food' : form.category === 'Travel' ? 'travel' : form.category === 'Shopping' ? 'shopping' : form.category === 'Bills' ? 'bills' : 'other';
    setExpenses(prev => [{ id: Date.now(), name: form.name.trim(), category: form.category, amount, day, icon }, ...prev]);
    setForm({ name: '', amount: '', category: 'Food' });
    setShowForm(false);
    setToast('Expense added to your budget.');
    setTimeout(() => setToast(''), 2500);
  }

  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setToast('Expense removed.');
    setTimeout(() => setToast(''), 2500);
  }

  const navItems = [
    { label: 'Overview', icon: Wallet }, { label: 'Transactions', icon: ReceiptText },
    { label: 'Savings goals', icon: Target }, { label: 'Subscriptions', icon: CalendarDays }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMobileNav ? 'mobile-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Wallet size={21}/></div><span>pocket<span className="brand-light">wise</span></span><button className="close-nav" onClick={() => setShowMobileNav(false)}><X size={18}/></button></div>
        <div className="workspace-label">YOUR MONEY</div>
        <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? 'selected' : ''}`} onClick={() => { setActive(label); setShowMobileNav(false); }}><Icon size={18}/><span>{label}</span>{label === 'Transactions' && <span className="nav-count">{expenses.length}</span>}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="coach-card"><div className="coach-icon"><Sparkles size={17}/></div><div><b>Money coach</b><p>Small steps, better habits.</p></div><ArrowUpRight size={15}/></div>
          <div className="profile"><div className="avatar">J</div><div className="profile-text"><b>Hey, Jay!</b><span>Personal account</span></div><ChevronDown size={16}/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setShowMobileNav(true)}><Menu size={21}/></button>
          <div><div className="eyebrow">SUNDAY, OCTOBER 11, 2026 <span className="live-dot"/></div><h1>{active === 'Overview' ? 'Your money, in focus.' : active}</h1></div>
          <div className="top-actions"><div className="month-pill"><CalendarDays size={15}/> October <ChevronDown size={14}/></div><button className="avatar small-avatar">J</button></div>
        </header>

        {active === 'Overview' ? <div className="content">
          <section className="welcome-row"><div><h2>Let’s make this month count <span>✦</span></h2><p>You’ve got this. Here’s how your money is doing so far.</p></div><button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> Add expense</button></section>

          <section className="hero-grid">
            <div className="balance-card">
              <div className="balance-top"><span className="label-soft">TOTAL AVAILABLE</span><span className="month-tag"><span className="green-dot"/> On track</span></div>
              <div className="balance-number">{money(balance)}<span>.00</span></div>
              <p className="balance-sub">of your {money(budget)} monthly budget remaining</p>
              <div className="progress-track"><div className="progress-fill" style={{width: `${spentPercent}%`}}/></div>
              <div className="progress-labels"><span>{money(spent)} spent</span><span>{Math.round(spentPercent)}% used</span></div>
              <div className="balance-divider"/>
              <div className="balance-stats"><div><span className="mini-icon purple"><Wallet size={16}/></span><div><small>Daily allowance</small><b>{money(daily)}<em>/day</em></b></div></div><div><span className="mini-icon mint"><CalendarDays size={16}/></span><div><small>Days remaining</small><b>{daysLeft} <em>days</em></b></div></div></div>
              <div className="orb orb-one"/><div className="orb orb-two"/>
            </div>
            <div className="insight-card">
              <div className="card-title-row"><div><span className="tiny-kicker">SMART INSIGHT</span><h3>Your spending snapshot</h3></div><div className="sparkle-bubble"><Sparkles size={17}/></div></div>
              <div className="insight-highlight"><div className="insight-icon"><TrendingUp size={18}/></div><div><b>{spentPercent < 25 ? 'Nice start!' : spentPercent < 55 ? 'You’re finding your rhythm.' : 'Keep an eye on spending.'}</b><p>You’ve used {Math.round(spentPercent)}% of your budget. Make every rupee count.</p></div></div>
              <div className="insight-metrics"><div><span>Monthly forecast</span><b className={forecastBalance < 0 ? 'negative' : ''}>{money(forecastBalance)}</b><small>{forecastBalance < 0 ? 'Potential overspend' : 'estimated left'}</small></div><div><span>Financial risk</span><b className={`risk-${risk.toLowerCase()}`}>{risk}</b><small>based on your pace</small></div></div>
              <button className="text-link" onClick={() => { setSimOpen(true); document.getElementById('simulator')?.scrollIntoView({behavior:'smooth'}); }}>Explore your money plan <ArrowUpRight size={15}/></button>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span className="stat-icon violet"><ArrowDownRight size={17}/></span><span className="stat-change">This month</span></div><span className="stat-label">Total spent</span><b>{money(spent)}</b><div className="stat-foot"><span className="tiny-line violet-line"/>Across {expenses.length} transactions</div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon green"><PiggyBank size={17}/></span><span className="stat-change good">+{Math.round(goalSaved/savingsGoal*100)}%</span></div><span className="stat-label">Savings progress</span><b>{money(goalSaved)}</b><div className="mini-progress"><span style={{width:`${Math.min(100,goalSaved/savingsGoal*100)}%`}}/></div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon orange"><Zap size={17}/></span><span className="stat-change">Remaining</span></div><span className="stat-label">Committed bills</span><b>{money(committed)}</b><div className="stat-foot">Recurring subscriptions</div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon blue"><ShieldCheck size={17}/></span><span className="stat-change good">Live</span></div><span className="stat-label">Budget health</span><b className="health-text">{risk === 'Low' ? 'Looking good' : risk === 'Moderate' ? 'Stay mindful' : 'Needs attention'}</b><div className="stat-foot">Based on your current pace</div></div>
          </section>

          <section className="middle-grid">
            <div className="panel trend-panel"><div className="panel-heading"><div><h3>Spending overview</h3><p>Your pace vs. your planned budget</p></div><button className="select-pill">Last 30 days <ChevronDown size={14}/></button></div><div className="chart-legend"><span><i className="legend-dot actual"/> Actual spending</span><span><i className="legend-dot plan"/> Planned spending</span></div><div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{top:10,right:4,left:-22,bottom:0}}><defs><linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b7cff" stopOpacity={0.25}/><stop offset="100%" stopColor="#8b7cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#25283a" vertical={false}/><XAxis dataKey="day" tick={{fill:'#777e99',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#777e99',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>`₹${v/1000}k`}/><Tooltip contentStyle={{background:'#1b1e30',border:'1px solid #353950',borderRadius:12,color:'#fff'}} formatter={(v)=>money(v)}/><Area type="monotone" dataKey="plan" name="Plan" stroke="#50566e" strokeDasharray="5 5" fill="transparent" strokeWidth={2}/><Area type="monotone" dataKey="actual" name="Actual" stroke="#9588ff" fill="url(#actualFill)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div><div className="chart-note"><span className="note-check"><CheckCircle2 size={14}/></span> Your daily spending is being tracked against your monthly plan.</div></div>
            <div className="panel category-panel"><div className="panel-heading"><div><h3>Where it goes</h3><p>Spending by category</p></div><button className="icon-btn"><SlidersHorizontal size={16}/></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={63} outerRadius={84} paddingAngle={4} stroke="none">{categoryData.map((entry,index)=><Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip formatter={(v)=>money(v)} contentStyle={{background:'#1b1e30',border:'1px solid #353950',borderRadius:10,color:'#fff'}}/></PieChart></ResponsiveContainer><div className="donut-center"><b>{money(spent)}</b><span>Total spent</span></div></div><div className="category-legend">{categoryData.length ? categoryData.map(c=><div className="category-row" key={c.name}><span className="category-name"><i style={{background:c.color}}/>{c.name}</span><b>{money(c.value)}</b><span className="category-percent">{Math.round(c.value/(spent||1)*100)}%</span></div>) : <p className="empty-note">Add expenses to see your spending breakdown.</p>}</div></div>
          </section>

          <section className="bottom-grid">
            <div className="panel transactions-panel"><div className="panel-heading"><div><h3>Recent transactions</h3><p>Little things add up — stay aware.</p></div><button className="text-link" onClick={()=>setActive('Transactions')}>View all <ArrowUpRight size={14}/></button></div><div className="transaction-list">{expenses.slice(0,5).map(e=>{const Icon=iconFor(e.icon);return <div className="transaction-row" key={e.id}><div className={`transaction-icon ${e.category.toLowerCase()}`}><Icon size={17}/></div><div className="transaction-desc"><b>{e.name}</b><span>{e.category} · Oct {e.day}</span></div><div className="transaction-amount">−{money(e.amount)}</div><button className="delete-btn" title="Remove expense" onClick={()=>deleteExpense(e.id)}><Trash2 size={14}/></button></div>})}</div></div>
            <div className="panel goal-panel"><div className="panel-heading"><div><h3>Savings goal</h3><p>One step closer to your future.</p></div><div className="goal-icon"><Target size={18}/></div></div><div className="goal-main"><div className="goal-circle"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="49" className="circle-bg"/><circle cx="60" cy="60" r="49" className="circle-progress" style={{strokeDasharray:`${Math.min(1,goalSaved/savingsGoal)*308} 308`}}/></svg><div className="goal-circle-text"><b>{Math.round(goalSaved/savingsGoal*100)}%</b><span>saved</span></div></div><div className="goal-values"><span>Emergency fund</span><b>{money(goalSaved)} <small>of {money(savingsGoal)}</small></b><div className="goal-progress"><span style={{width:`${Math.min(100,goalSaved/savingsGoal*100)}%`}}/></div><p>{money(Math.max(0,savingsGoal-goalSaved))} to reach your goal</p></div></div><button className="secondary-btn" onClick={()=>{setGoalSaved(v=>Math.min(savingsGoal,v+100));setToast('Added ₹100 to your savings progress.');setTimeout(()=>setToast(''),2500)}}><Plus size={15}/> Add ₹100 to savings</button></div>
          </section>

          <section className="panel simulator-panel" id="simulator"><div className="sim-copy"><div className="sim-icon"><Sparkles size={19}/></div><div><span className="tiny-kicker">PLAN BEFORE YOU SPEND</span><h3>What if you spend a little more?</h3><p>Try a decision before you make it. Your budget updates instantly.</p></div></div><button className="sim-toggle" onClick={()=>setSimOpen(v=>!v)}>{simOpen?'Hide simulator':'Try simulator'} <ArrowUpRight size={15}/></button>{simOpen&&<div className="sim-body"><div className="slider-area"><label>Possible extra expense <b>{money(simAmount)}</b></label><input type="range" min="0" max="3000" step="100" value={simAmount} onChange={e=>setSimAmount(Number(e.target.value))}/><div className="slider-labels"><span>₹0</span><span>₹3,000</span></div></div><div className="sim-result"><div><span>New balance</span><b className={balance-simAmount<0?'negative':''}>{money(balance-simAmount)}</b></div><div><span>New daily allowance</span><b>{money((balance-simAmount)/daysLeft)}</b></div><div><span>Budget impact</span><b className={simAmount>balance?'negative':'risk-moderate'}>{Math.round(simAmount/(budget||1)*100)}%</b></div></div><p className="sim-message"><AlertTriangle size={15}/>{simAmount>balance?'This purchase would put you over budget. Consider waiting or reducing another expense.':simAmount>balance*0.25?'This is possible, but it will reduce your daily allowance. Make sure your essentials are covered.':'This purchase looks manageable if you keep to your updated daily allowance.'}</p></div>}</section>
          <footer><span>pocketwise © 2026</span><span>Built for better money habits <span className="footer-heart">♥</span></span></footer>
        </div> : active === 'Transactions' ? <div className="content subpage"><div className="page-intro"><div><h2>Every rupee, accounted for.</h2><p>Review, add, or remove your transactions.</p></div><button className="primary-btn" onClick={()=>setShowForm(true)}><Plus size={17}/> Add expense</button></div><div className="panel"><div className="panel-heading"><div><h3>All transactions</h3><p>{expenses.length} records · October 2026</p></div><b className="table-total">{money(spent)}</b></div>{expenses.map(e=>{const Icon=iconFor(e.icon);return <div className="transaction-row" key={e.id}><div className={`transaction-icon ${e.category.toLowerCase()}`}><Icon size={17}/></div><div className="transaction-desc"><b>{e.name}</b><span>{e.category} · Oct {e.day}</span></div><div className="transaction-amount">−{money(e.amount)}</div><button className="delete-btn" onClick={()=>deleteExpense(e.id)}><Trash2 size={14}/></button></div>})}</div></div> : active === 'Savings goals' ? <div className="content subpage"><div className="page-intro"><div><h2>Make room for future you.</h2><p>Small, consistent savings make a difference.</p></div></div><div className="panel savings-page"><div className="goal-icon large"><Target size={24}/></div><h2>Emergency fund</h2><p className="muted">Your safety net for unexpected expenses</p><div className="savings-big">{money(goalSaved)} <span>saved of {money(savingsGoal)}</span></div><div className="wide-progress"><span style={{width:`${Math.min(100,goalSaved/savingsGoal*100)}%`}}/></div><div className="goal-settings"><label>Goal amount (₹)<input type="number" min="100" value={savingsGoal} onChange={e=>setSavingsGoal(Math.max(100,Number(e.target.value)||100))}/></label><button className="primary-btn" onClick={()=>setGoalSaved(v=>Math.min(savingsGoal,v+100))}><Plus size={16}/> Save ₹100</button></div></div></div> : <div className="content subpage"><div className="page-intro"><div><h2>Know what’s coming up.</h2><p>Keep recurring costs visible, so they don’t surprise you.</p></div><button className="primary-btn" onClick={()=>{const name=prompt('Subscription name?');const amount=Number(prompt('Monthly amount in rupees?'));if(name&&amount>0)setSubscriptions(p=>[...p,{id:Date.now(),name,amount,date:'Next month'}])}}><Plus size={17}/> Add subscription</button></div><div className="panel"><div className="panel-heading"><div><h3>Monthly commitments</h3><p>Upcoming recurring payments</p></div><b className="table-total">{money(committed)}/mo</b></div>{subscriptions.map(s=><div className="transaction-row" key={s.id}><div className="transaction-icon bills"><CalendarDays size={17}/></div><div className="transaction-desc"><b>{s.name}</b><span>Renews on {s.date}</span></div><div className="transaction-amount">{money(s.amount)}<span className="per-month"> / month</span></div><button className="delete-btn" onClick={()=>setSubscriptions(p=>p.filter(x=>x.id!==s.id))}><Trash2 size={14}/></button></div>)}</div></div>}
      </main>

      {showForm && <div className="modal-backdrop" onClick={()=>setShowForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="tiny-kicker">NEW TRANSACTION</span><h2>Add an expense</h2></div><button className="icon-btn" onClick={()=>setShowForm(false)}><X size={18}/></button></div><p className="muted">Keep your budget honest — every little thing counts.</p><form onSubmit={addExpense}><label>What did you spend on?<input autoFocus placeholder="e.g. Lunch, bus fare..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Amount (₹)<input type="number" min="1" placeholder="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><div className="modal-summary"><span>Remaining after expense</span><b>{money(balance-(Number(form.amount)||0))}</b></div><button className="primary-btn submit-btn" type="submit"><Plus size={17}/> Save expense</button></form></div></div>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

export default App;