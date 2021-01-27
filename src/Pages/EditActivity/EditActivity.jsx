import React from "react";

export default function EditActivity() {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const ref = firebase.firestore().collection("activities");

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivity() {
    db.doc(`activities/${id}`)
      .get()
      .then((document) => {
        setActivity(document.data());
        console.log(document.data());
      })
      .catch((error) => {
        console.log(`Error getting documents: ${error}`);
      });
  }

  useEffect(() => {
    getActivity();
    console.log(activity);
  }, []);

  // DELETE FUNCTION
  function deleteActivity(activity) {
    ref
      .doc(id)
      .delete()
      .catch((error) => {
        console.log(error);
      });
  }

  // EDIT FUNCTION
  function editActivity(updatedActivity) {
    ref
      .doc(id)
      .update(updatedActivity)
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Header />
      <div className="view" key={activity.id}>
        <h1 className="view__header">View Comment</h1>
        <div className="view__content-container" key={id}>
          <label className="view__subheader" htmlFor="host">
            Host:
          </label>
          <input className="view__input" type="text" id="host" name="host" value={activity.host} />
          <div className="activity__info-container">
            <label className="view__subheader" htmlFor="game">
              Game:
            </label>
            <input className="view__input" type="text" id="game" name="game" value={activity.selectedGame} />
            <label className="view__subheader" htmlFor="timestamp">
              Posted:
            </label>
            <input className="view__input" type="text" id="timestamp" name="timestamp" value={activity.timestamp} />
          </div>
          <label className="view__subheader" htmlFor="skill">
            Skill:
          </label>
          <input className="view__input" type="text" id="skill" name="skill" value={activity.skill} />
          <label className="view__subheader" htmlFor="description">
            Description:
          </label>
          <textarea className="view__input" type="text" id="description" name="description" value={activity.description} />
        </div>
        <button onClick={() => deleteActivity(activity)}>X</button>
        <button onClick={() => editActivity({ selectedGame: activity.selectedGame, skill: activity.skill, description, id })}>Edit</button>
        <h2>Conversation</h2>
      </div>
    </>
  );
}
