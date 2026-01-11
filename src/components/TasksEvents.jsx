import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, Clock, AlertCircle, Plus, User, X } from 'lucide-react'

const TasksEvents = ({ familyMembers }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('homeplan_tasks')
        return saved ? JSON.parse(saved) : [
            { id: 1, type: 'task', title: 'Vacuum living room', assignedTo: 'Alex', dueDate: 'Thursday', date: new Date().toISOString().split('T')[0], priority: 'medium', completed: false },
            { id: 2, type: 'event', title: 'Aircond servicing', assignedTo: 'All', dueDate: 'Saturday 3 PM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
            { id: 3, type: 'task', title: 'Pay electricity bill', assignedTo: 'Mom', dueDate: '15th', date: new Date().toISOString().split('T')[0], priority: 'high', completed: true },
        ]
    })

    useEffect(() => {
        localStorage.setItem('homeplan_tasks', JSON.stringify(items))
    }, [items])

    const [activeFilter, setActiveFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // New Item State
    const [newType, setNewType] = useState('task')
    const [newTitle, setNewTitle] = useState('')
    const [newAssignee, setNewAssignee] = useState(familyMembers[0])
    const [newDue, setNewDue] = useState('')
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
    const [newPriority, setNewPriority] = useState('medium')

    const toggleComplete = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ))
    }

    const handleAddItem = (e) => {
        e.preventDefault()
        if (!newTitle.trim()) return

        const newItem = {
            id: Date.now(),
            type: newType,
            title: newTitle,
            assignedTo: newAssignee,
            dueDate: newDue || 'Unscheduled',
            date: newDate, // Added for calendar sync
            priority: newType === 'task' ? newPriority : null,
            completed: false
        }

        setItems([newItem, ...items])
        setIsModalOpen(false)
        setNewTitle('')
        setNewDue('')
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--priority-high)'
            case 'medium': return 'var(--priority-medium)'
            case 'low': return 'var(--priority-low)'
            default: return 'var(--border-color)'
        }
    }

    const filteredItems = items.filter(item => {
        if (activeFilter === 'tasks') return item.type === 'task'
        if (activeFilter === 'events') return item.type === 'event'
        return true
    })

    return (
        <div className="tasks-view">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Tasks & Events</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Household agenda and chores</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['all', 'tasks', 'events'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            background: activeFilter === filter ? 'var(--accent-blue)' : 'var(--accent-blue-soft)',
                            color: activeFilter === filter ? 'white' : 'var(--accent-blue)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="agenda-container">
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card"
                            style={{ borderLeft: `4px solid ${item.type === 'event' ? 'var(--accent-blue)' : getPriorityColor(item.priority)}` }}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                {item.type === 'task' && (
                                    <button
                                        onClick={() => toggleComplete(item.id)}
                                        style={{ background: 'none', border: 'none', color: item.completed ? 'var(--accent-blue)' : 'var(--text-secondary)', marginTop: '2px', cursor: 'pointer' }}
                                    >
                                        {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </button>
                                )}
                                {item.type === 'event' && (
                                    <div style={{ color: 'var(--accent-blue)', marginTop: '2px' }}>
                                        <Calendar size={24} />
                                    </div>
                                )}

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                        {item.title}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {item.dueDate}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={12} /> {item.assignedTo}
                                        </span>
                                        {item.type === 'task' && item.priority && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(item.priority), fontWeight: '600' }}>
                                                <AlertCircle size={12} /> {item.priority}
                                            </span>
                                        )}
                                    </div>
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
                                <h3 style={{ fontSize: '1.25rem' }}>Add New Item</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: '12px', padding: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setNewType('task')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: newType === 'task' ? 'white' : 'transparent', boxShadow: newType === 'task' ? 'var(--shadow-sm)' : 'none', fontWeight: '600', cursor: 'pointer' }}
                                    >Task</button>
                                    <button
                                        type="button"
                                        onClick={() => setNewType('event')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: newType === 'event' ? 'white' : 'transparent', boxShadow: newType === 'event' ? 'var(--shadow-sm)' : 'none', fontWeight: '600', cursor: 'pointer' }}
                                    >Event</button>
                                </div>

                                <input
                                    autoFocus
                                    placeholder="What's the plan?"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Assign To</label>
                                        <select
                                            value={newAssignee}
                                            onChange={e => setNewAssignee(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                                        >
                                            {familyMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</label>
                                        <input
                                            type="date"
                                            value={newDate}
                                            onChange={e => setNewDate(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Time/Note</label>
                                        <input
                                            placeholder="e.g. 3 PM"
                                            value={newDue}
                                            onChange={e => setNewDue(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                {newType === 'task' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Priority</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['low', 'medium', 'high'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setNewPriority(p)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: newPriority === p ? getPriorityColor(p) : 'var(--border-color)',
                                                        background: newPriority === p ? getPriorityColor(p) + '20' : 'white',
                                                        color: newPriority === p ? getPriorityColor(p) : 'var(--text-secondary)',
                                                        fontWeight: '600',
                                                        textTransform: 'capitalize',
                                                        cursor: 'pointer'
                                                    }}
                                                >{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                                    Add to Agenda
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TasksEvents
