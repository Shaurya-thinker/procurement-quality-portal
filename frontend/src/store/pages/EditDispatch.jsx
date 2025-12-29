import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MaterialDispatchForm from './MaterialDispatchForm';

export default function EditDispatch() {
  const { dispatchId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/store/material-dispatch/${dispatchId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())  
      .then(data => {
        if (data.dispatch_status === 'CANCELLED') {
            alert('Cancelled dispatch cannot be edited');
            navigate('/store/dispatches');
            return;
        }
        setInitialData(data);
        setLoading(false);
       });
  }, [dispatchId]);

  if (loading) return <p>Loading draft...</p>;

  return (
    <MaterialDispatchForm
      initialData={initialData}
      mode="EDIT"
    />
  );
}
