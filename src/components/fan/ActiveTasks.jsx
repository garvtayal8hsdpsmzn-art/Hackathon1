'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiCheckCircle, FiAward } from 'react-icons/fi';

export default function ActiveTasks({ userId, onTaskComplete }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.tasks.getActive();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (taskId, answer) => {
    setSubmitting(taskId);
    try {
      await api.tasks.submit({
        user_id: userId,
        task_id: taskId,
        answer,
      });
      
      // Refresh tasks and dashboard
      await fetchTasks();
      if (onTaskComplete) onTaskComplete();
      
      alert('Task completed! Points added to your account.');
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to submit task. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiAward className="text-green-600" />
        Active Tasks & Trivia
      </h2>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No active tasks at the moment. Check back later!</p>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSubmit={handleTaskSubmit}
              submitting={submitting === task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onSubmit, submitting }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(task.id, answer);
      setAnswer('');
    }
  };

  return (
    <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        </div>
        <div className="ml-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          +{task.points} pts
        </div>
      </div>

      {task.task_type === 'trivia' && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="input-field"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      )}

      {task.task_type === 'prediction' && (
        <button
          onClick={() => window.location.href = '/predictions'}
          className="btn-primary w-full"
        >
          Make Prediction
        </button>
      )}

      {task.task_type === 'content_upload' && (
        <button
          onClick={() => alert('Content upload feature coming soon!')}
          className="btn-primary w-full"
        >
          Upload Content
        </button>
      )}
    </div>
  );
}
