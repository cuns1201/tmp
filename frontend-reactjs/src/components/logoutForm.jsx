import { useUser } from './userContext.jsx';

const MyComponent = () => {
  const { user, logout } = useUser();

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
        
        </>
      )}
    </div>
  );
};

export default MyComponent;