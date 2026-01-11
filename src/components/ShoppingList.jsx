import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, User, X, ShoppingCart, Edit2 } from 'lucide-react'

const ShoppingList = ({ familyMembers }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('homeplan_shopping')
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Eggs', quantity: '1 dozen', requestedBy: 'Mom', bought: false, date: new Date().toISOString().split('T')[0] },
            { id: 2, name: 'Milk', quantity: '2L', requestedBy: 'Alex', bought: true, date: new Date().toISOString().split('T')[0] },
            { id: 3, name: 'Detergent', quantity: '1 pack', requestedBy: 'Dad', bought: false, date: new Date().toISOString().split('T')[0] },
        ]
    })

    useEffect(() => {
        localStorage.setItem('homeplan_shopping', JSON.stringify(items))
    }, [items])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [newQty, setNewQty] = useState('')
    const [newRequester, setNewRequester] = useState(familyMembers[0])
    const [editingItem, setEditingItem] = useState(null)

    const handleAddItem = (e) => {
        e.preventDefault()
        if (!newName.trim()) return

        if (editingItem) {
            setItems(items.map(item =>
                item.id === editingItem.id
                    ? { ...item, name: newName, quantity: newQty || '1', requestedBy: newRequester }
                    : item
            ))
            setEditingItem(null)
        } else {
            const item = {
                id: Date.now(),
                name: newName,
                quantity: newQty || '1',
                requestedBy: newRequester,
                bought: false,
                date: new Date().toISOString().split('T')[0]
            }
            setItems([item, ...items])
        }
        setIsModalOpen(false)
        setNewName('')
        setNewQty('')
    }

    const handleEditItem = (item) => {
        setEditingItem(item)
        setNewName(item.name)
        setNewQty(item.quantity)
        setNewRequester(item.requestedBy || item.assignedTo || familyMembers[0])
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingItem(null)
        setNewName('')
        setNewQty('')
        setNewRequester(familyMembers[0])
    }

    const toggleBought = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, bought: !item.bought } : item
        ))
    }

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const clearBought = () => {
        setItems(items.filter(item => !item.bought))
    }

    return (
        <div className="shopping-view">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Shared Shopping List</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tick off items as you shop</p>
            </div>

            <div className="list-container">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`card ${item.bought ? 'bought' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: item.bought ? 0.6 : 1 }}
                        >
                            <button
                                onClick={() => toggleBought(item.id)}
                                style={{ background: 'none', border: 'none', color: item.bought ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                {item.bought ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', textDecoration: item.bought ? 'line-through' : 'none' }}>
                                    {item.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{item.quantity}</span>
                                    {(item.requestedBy || item.assignedTo) && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={12} /> {item.requestedBy || item.assignedTo}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleEditItem(item)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', opacity: 0.5, cursor: 'pointer' }}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#ff7675', opacity: 0.5, cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {items.some(i => i.bought) && (
                <button
                    onClick={clearBought}
                    style={{ width: '100%', padding: '12px', background: 'none', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '12px', cursor: 'pointer' }}
                >
                    Clear Bought Items
                </button>
            )}

            {/* Standardized FAB */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fab"
            >
                <Plus size={28} />
            </button>

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2001, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
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
                                paddingBottom: 'calc(48px + var(--safe-area-inset-bottom))',
                                marginBottom: 'env(safe-area-inset-bottom)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{editingItem ? 'Edit Item' : 'Add Item'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    autoFocus
                                    placeholder="What do we need?"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Quantity</label>
                                        <input
                                            placeholder="e.g. 2L or 1 pack"
                                            value={newQty}
                                            onChange={e => setNewQty(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Request By</label>
                                        <select
                                            value={newRequester}
                                            onChange={e => setNewRequester(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                                        >
                                            {familyMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '12px', width: '100%', height: '52px' }}>
                                    <ShoppingCart size={20} /> {editingItem ? 'Update Item' : 'Add to List'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ShoppingList
