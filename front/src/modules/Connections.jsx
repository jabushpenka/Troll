import styles from "../styles/Connections.module.css";

export default function Connections({ users, onlineUsers }) {

  if (!users || !onlineUsers){
    return <div>Loading...</div>
  }

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.user_id}
          className={onlineUsers.includes(user.username) ? styles.online : ""}
        >
          {user.username}
        </li>
      ))}
    </ul>
  );
}