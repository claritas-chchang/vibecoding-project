import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CreditCard, Filter, X, Users, DollarSign } from 'lucide-react'

const ExpenseTracker = ({ familyMembers }) => {
    const constraintsRef = useRef(null)
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('homeplan_expenses')
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Groceries', amount: 85.50, paidBy: 'Mom', splitWith: ['Alex', 'Mom', 'Dad', 'Sam'], date: '2026-01-08' },
            { id: 2, title: 'Electricity Bill', amount: 120.00, paidBy: 'Dad', splitWith: ['Mom', 'Dad'], date: '2026-01-05' },
            { id: 3, title: 'Pizza Night', amount: 45.00, paidBy: 'Alex', splitWith: ['Alex', 'Sam'], date: '2026-01-09' },
        ]
    })

    useEffect(() => {
        localStorage.setItem('homeplan_expenses', JSON.stringify(expenses))
    }, [expenses])

    const [isModalOpen, setIsModalOpen] = useState(false)

    // New Expense State
    const [newTitle, setNewTitle] = useState('')
    const [newAmount, setNewAmount] = useState('')
    const [newPayer, setNewPayer] = useState(familyMembers[0])
    const [newSplits, setNewSplits] = useState(familyMembers)

    // Calculate balances
    const calculateShares = () => {
        const shares = {}
        familyMembers.forEach(m => shares[m] = 0)

        expenses.forEach(exp => {
            const share = exp.amount / exp.splitWith.length
            exp.splitWith.forEach(person => {
                shares[person] += share
            })
        })

        return shares
    }

    const shares = calculateShares()

    const handleAddExpense = (e) => {
        e.preventDefault()
        if (!newTitle.trim() || !newAmount) return

        const newExp = {
            id: Date.now(),
            title: newTitle,
            amount: parseFloat(newAmount),
            paidBy: newPayer,
            splitWith: newSplits,
            date: new Date().toISOString().split('T')[0]
        }

        setExpenses([newExp, ...expenses])
        setIsModalOpen(false)
        setNewTitle('')
        setNewAmount('')
        setNewSplits(familyMembers)
    }

    const toggleSplit = (member) => {
        if (newSplits.includes(member)) {
            if (newSplits.length > 1) {
                setNewSplits(newSplits.filter(m => m !== member))
            }
        } else {
            setNewSplits([...newSplits, member])
        }
    }

    return (
        <div className="expenses-view">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Expense Tracker</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Keep track of who owes what</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ margin: 0, padding: '20px', textAlign: 'center', background: 'var(--accent-blue)', color: 'white', border: 'none' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Total Spent</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </div>
                </div>
                <div className="card" style={{ margin: 0, padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This Month</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-blue)' }}>
                        ${expenses.filter(e => e.date.startsWith('2026-01')).reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: '600' }}>Personal Expenses</h3>
            <div
                ref={constraintsRef}
                className="no-scrollbar"
                style={{
                    overflowX: 'hidden',
                    marginBottom: '24px',
                    cursor: 'grab'
                }}
            >
                <motion.div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        paddingBottom: '12px',
                        width: 'max-content'
                    }}
                    drag="x"
                    dragConstraints={constraintsRef}
                >
                    {familyMembers.map(member => (
                        <motion.div
                            key={member}
                            layout
                            className="card"
                            style={{
                                minWidth: '130px',
                                flexShrink: 0,
                                margin: 0,
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderBottom: `3px solid var(--accent-blue)`,
                                userSelect: 'none'
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '8px', fontWeight: '700' }}>
                                {member[0]}
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{member}</div>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                marginTop: '4px'
                            }}>
                                ${shares[member].toFixed(2)}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Expenses</h3>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Filter size={14} /> Filter
                </button>
            </div>

            <div className="expense-list">
                <AnimatePresence>
                    {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(exp => (
                        <motion.div
                            key={exp.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'var(--accent-blue-soft)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-blue)'
                            }}>
                                <CreditCard size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{exp.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Paid by {exp.paidBy} • {exp.date}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>${exp.amount.toFixed(2)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Split with {exp.splitWith.length}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fab"
            >
                <Plus size={28} />
            </button>

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '500px',
                                background: 'white',
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                padding: '24px',
                                paddingBottom: 'calc(24px + var(--safe-area-inset-bottom))'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Add Expense</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Title</label>
                                    <input
                                        autoFocus
                                        placeholder="What did you buy?"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Amount ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newAmount}
                                            onChange={e => setNewAmount(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Paid By</label>
                                        <select
                                            value={newPayer}
                                            onChange={e => setNewPayer(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                                        >
                                            {familyMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Split With</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {familyMembers.map(member => (
                                            <button
                                                key={member}
                                                type="button"
                                                onClick={() => toggleSplit(member)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: newSplits.includes(member) ? 'var(--accent-blue)' : 'var(--border-color)',
                                                    background: newSplits.includes(member) ? 'var(--accent-blue-soft)' : 'white',
                                                    color: newSplits.includes(member) ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {member}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '12px', width: '100%', height: '52px' }}>
                                    <DollarSign size={20} /> Record Expense
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ExpenseTracker
