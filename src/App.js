import React, { useState, useEffect } from 'react';
import sampleCard from './samplecard.png'; // Adjust the path if you put it in a subdirectory
import './KanbanBoard.css';

function KanbanBoard() {
    const [tickets, setTickets] = useState([]);
    const [groupBy, setGroupBy] = useState('status');
    const [sortMethod, setSortMethod] = useState('priority');

    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => {
                setTickets(data.tickets || []);
            });
    }, []);

    const transformedData = Array.isArray(tickets) ? tickets.reduce((acc, ticket) => {
        const key = ticket[groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(ticket);
        return acc;
    }, {}) : {};

    Object.keys(transformedData).forEach(key => {
        transformedData[key].sort((a, b) => {
            if (sortMethod === 'priority') {
                return b.priority - a.priority;
            }
            if (sortMethod === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    });

    useEffect(() => {
        const savedGroupBy = localStorage.getItem('groupBy');
        const savedSortMethod = localStorage.getItem('sortMethod');

        if (savedGroupBy) setGroupBy(savedGroupBy);
        if (savedSortMethod) setSortMethod(savedSortMethod);
    }, []);

    useEffect(() => {
        localStorage.setItem('groupBy', groupBy);
        localStorage.setItem('sortMethod', sortMethod);
    }, [groupBy, sortMethod]);

    return (
        <div className="kanban-board">
            <div className="controls">
                <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                    <option value="status">By Status</option>
                    <option value="user">By User</option>
                    <option value="priority">By Priority</option>
                </select>
                <select value={sortMethod} onChange={e => setSortMethod(e.target.value)}>
                    <option value="priority">Sort by Priority</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
            {Object.keys(transformedData).map(key => (
    <div key={key} className="kanban-column">
        <h2>{key}</h2>
        {transformedData[key].map(ticket => (
            <div key={ticket.id} className="ticket">
                <img src={sampleCard} alt="Sample Card" className="card-image"/>
                <h3>{ticket.title}</h3>
                {/* Other ticket details */}
            </div>
        ))}
    </div>
))}


        </div>
    );
}

export default KanbanBoard;
