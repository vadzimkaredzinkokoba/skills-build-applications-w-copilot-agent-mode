import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyBadge = (level) => {
    const levelLower = (level || '').toLowerCase();
    if (levelLower.includes('easy') || levelLower.includes('beginner')) return 'success';
    if (levelLower.includes('medium') || levelLower.includes('intermediate')) return 'warning';
    if (levelLower.includes('hard') || levelLower.includes('advanced')) return 'danger';
    return 'secondary';
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">💪 Workout Suggestions</h2>
        <span className="badge bg-primary">{workouts.length} Workouts</span>
      </div>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <div key={workout.id || index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{workout.name || 'Unnamed Workout'}</h5>
                  <span className={`badge bg-${getDifficultyBadge(workout.difficulty_level)}`}>
                    {workout.difficulty_level || 'N/A'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{workout.description || 'No description available'}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🏃 Type</span>
                    <span className="badge bg-info">{workout.workout_type || 'N/A'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>⏱️ Duration</span>
                    <span className="badge bg-primary">{workout.duration || 0} min</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🔥 Calories</span>
                    <span className="badge bg-danger">~{workout.estimated_calories || 0} kcal</span>
                  </li>
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              No workout suggestions available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
