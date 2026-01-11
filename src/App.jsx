import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingBag,
    CheckSquare,
    CreditCard,
    Home,
    LayoutDashboard
} from 'lucide-react'
import Dashboard from './components/Dashboard'
import ShoppingList from './components/ShoppingList'
import TasksEvents from './components/TasksEvents'
import ExpenseTracker from './components/ExpenseTracker'

const App = () => {
    const [activeTab, setActiveTab] = useState('home')
    const [familyMembers] = useState(['Alex', 'Mom', 'Dad', 'Sam'])

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Dashboard familyMembers={familyMembers} setActiveTab={setActiveTab} />
            case 'shopping':
                return <ShoppingList familyMembers={familyMembers} />
            case 'tasks':
                return <TasksEvents familyMembers={familyMembers} />
            case 'expenses':
                return <ExpenseTracker familyMembers={familyMembers} />
            default:
                return <Dashboard familyMembers={familyMembers} setActiveTab={setActiveTab} />
        }
    }

    return (
        <div className="app-container">
            <header className="header">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                >
                    <h1><Home size={24} /> HomePlan</h1>
                    <div style={{ background: 'var(--accent-blue-soft)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-blue)' }}>
                        Family Mode
                    </div>
                </motion.div>
            </header>

            <main className="content-area">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <nav className="nav-bar">
                <button
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                    style={{ background: 'none', border: 'none' }}
                >
                    <LayoutDashboard size={24} />
                    <span>Home</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shopping')}
                    style={{ background: 'none', border: 'none' }}
                >
                    <ShoppingBag size={24} />
                    <span>Shopping</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                    style={{ background: 'none', border: 'none' }}
                >
                    <CheckSquare size={24} />
                    <span>Tasks</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('expenses')}
                    style={{ background: 'none', border: 'none' }}
                >
                    <CreditCard size={24} />
                    <span>Expenses</span>
                </button>
            </nav>
        </div>
    )
}

export default App
