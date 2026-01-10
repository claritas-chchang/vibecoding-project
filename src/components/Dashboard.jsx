import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, CheckSquare, CreditCard, ChevronRight, AlertCircle, ShoppingCart } from 'lucide-react'
import CalendarView from './CalendarView'

const Dashboard = ({ familyMembers, setActiveTab }) => {
    // Get data from localStorage
    const tasks = JSON.parse(localStorage.getItem('weplan_tasks') || '[]')
    const shopping = JSON.parse(localStorage.getItem('weplan_shopping') || '[]')
    const expenses = JSON.parse(localStorage.getItem('weplan_expenses') || '[]')

    const pendingTasks = tasks.filter(t => !t.completed).length
    const itemsToBuy = shopping.filter(i => !i.bought).length
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

    return (
        <div className="dashboard-view">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Hello, Home!</h2>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>WePlan. So you don't forget.</p>
            </div>

            <motion.div
                whileTap={{ scale: 0.98 }}
                className="card"
                onClick={() => setActiveTab('expenses')}
                style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', marginTop: '16px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Monthly Household Spending</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>${totalSpent.toFixed(2)}</div>
                    </div>
                    <CreditCard size={32} opacity={0.5} />
                </div>
            </motion.div>

            <div className="stat-grid">
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('tasks')}
                    className="stat-card"
                >
                    <span className="stat-value">{pendingTasks}</span>
                    <span className="stat-label">Pending Tasks</span>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('shopping')}
                    className="stat-card"
                    style={{ background: '#fff9db', color: '#f08c00' }}
                >
                    <span className="stat-value">{itemsToBuy}</span>
                    <span className="stat-label">Items to Buy</span>
                </motion.div>
            </div>

            <CalendarView familyMembers={familyMembers} />
        </div>
    )
}

export default Dashboard
