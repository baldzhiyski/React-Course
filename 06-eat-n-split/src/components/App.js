import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((st) => !st);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectionOfFriend(friend) {
    setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  function handleRemoveSelectionOfFriend() {
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelectionOfFriend}
          selectedFriend={selectedFriend}
          clearSelectedFriend={handleRemoveSelectionOfFriend}
        />
        {showAddFriend && (
          <FormAddFriend addFriendInCollection={handleAddFriend} />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close ❌" : "Add friend ➕"}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({
  friends,
  onSelection,
  selectedFriend,
  clearSelectedFriend,
}) {
  return (
    <ul>
      {friends.map((fr) => (
        <Friend
          friend={fr}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
          clearSelectedFriend={clearSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend, clearSelectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li key={friend.id} className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} 💵
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} 💵
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even 🚀.</p>}

      {isSelected ? (
        <Button onClick={clearSelectedFriend}>Close</Button>
      ) : (
        <Button onClick={() => onSelection(friend)}>Select</Button>
      )}
    </li>
  );
}

function FormAddFriend({ addFriendInCollection }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    addFriendInCollection(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>🧑‍🤝‍🧑Friend's name</label>
      <input
        type="text"
        required={true}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend }) {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name} </h2>

      <label>💰Bill value</label>
      <input type="text" />

      <label>🕴️ Your expense </label>
      <input type="text" />

      <label>🧑‍🤝‍🧑 {selectedFriend.name} 's expense </label>
      <input type="text" />

      <label>💴 Who is paying the bill ? </label>
      <select>
        <option value="user">You</option>
        <option value={selectedFriend}>{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}

export default App;
