import "./UserListComponent.css";

export default function UserListComponentHeader() {
  return (
    <div className="userPropertyHeader">
      <div className="userProperty">Id</div>
      <div className="userProperty">Email</div>
      <div className="userProperty">Czy aktywne?</div>
      <div className="userProperty">Rola</div>
    </div>
  );
}
