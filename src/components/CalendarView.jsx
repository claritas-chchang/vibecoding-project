import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingBag,
    CheckSquare,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    DollarSign
} from 'lucide-react'

const CalendarView = ({ familyMembers }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

    // Get data from localStorage
    const tasks = useMemo(() => JSON.parse(localStorage.getItem('homeplan_tasks') || '[]'), [])
    const shopping = useMemo(() => JSON.parse(localStorage.getItem('homeplan_shopping') || '[]'), [])
    const expenses = useMemo(() => JSON.parse(localStorage.getItem('homeplan_expenses') || '[]'), [])

    // Generate 14 days from today
    const dates = useMemo(() => {
        const list = []
        for (let i = -2; i < 12; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i)
            list.push({
                full: d.toISOString().split('T')[0],
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: d.getDate()
            })
        }
        return list
    }, [])

    // Filter items for the selected date
    const agendaItems = useMemo(() => {
        const items = []

        tasks.forEach(t => {
            if (t.date === selectedDate) {
                items.push({ ...t, category: 'task' })
            }
        })

        shopping.forEach(s => {
            if (s.date === selectedDate) {
                items.push({ ...s, category: 'shopping', title: s.name })
            }
        })

        expenses.forEach(e => {
            if (e.date === selectedDate) {
                items.push({ ...e, category: 'expense' })
            }
        })

        return items.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1)
    }, [selectedDate, tasks, shopping, expenses])

    const getCategoryTheme = (cat) => {
        switch (cat) {
            case 'shopping': return { icon: <ShoppingBag size={20} />, color: '#f08c00', bg: '#fff9db' }
            case 'task': return { icon: <CheckSquare size={20} />, color: 'var(--accent-blue)', bg: 'var(--accent-blue-soft)' }
            case 'expense': return { icon: <DollarSign size={20} />, color: '#00b894', bg: '#e6fffa' }
            default: return { icon: <CalendarIcon size={20} />, color: 'var(--text-secondary)', bg: 'var(--bg-primary)' }
        }
    }

    const constraintsRef = React.useRef(null)

    return (
        <div className="calendar-view">
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Your Schedule</h3>
                <div
                    ref={constraintsRef}
                    className="no-scrollbar"
                    style={{
                        overflowX: 'hidden',
                        cursor: 'grab'
                    }}
                >
                    <motion.div
                        className="date-strip"
                        style={{
                            width: 'max-content',
                            padding: '4px',
                            paddingBottom: '12px'
                        }}
                        drag="x"
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                    >
                        {dates.map((d) => (
                            <motion.div
                                key={d.full}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedDate(d.full)}
                                className={`date-card ${selectedDate === d.full ? 'active' : ''}`}
                                style={{ userSelect: 'none' }}
                            >
                                <span>{d.dayName}</span>
                                <span>{d.dateNum}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="agenda-list">
                <AnimatePresence mode="popLayout">
                    {agendaItems.length > 0 ? (
                        agendaItems.map((item) => {
                            const theme = getCategoryTheme(item.category)
                            return (
                                <motion.div
                                    key={`${item.category}-${item.id}`}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="agenda-item"
                                >
                                    <div className="agenda-type-icon" style={{ background: theme.bg, color: theme.color }}>
                                        {theme.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem', color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {item.category === 'expense' ? `$${item.amount.toFixed(2)}` : (item.quantity || item.dueDate)}
                                            {item.assignedTo && <span>• {item.assignedTo}</span>}
                                        </div>
                                    </div>
                                    {item.completed && (
                                        <div style={{ background: '#e6fffa', color: '#38b2ac', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>DONE</div>
                                    )}
                                </motion.div>
                            )
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}
                        >
                            <CalendarIcon size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                            <p>Nothing scheduled for this day.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CalendarView
