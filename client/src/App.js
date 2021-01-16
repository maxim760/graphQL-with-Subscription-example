import React from "react";
import {
  useLazyQuery,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { getYear } from "./utils/getYear";
import { GET_ALL_USERS, GET_USER } from "./query/user";
import { PLUSES } from "./subscription/plus";
import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER_USERNAME,
} from "./mutation/user";
import { ADD_PLUS } from "./mutation/plus";
import { notEmpty } from "./utils/notEmpty";
import { GET_PLUSES } from "./query/plus";

function App() {
  // option poolInterval для запросов каждые 500мс например чтобы постоянно знать инфу
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const { data: dataPlusesQuery } = useQuery(GET_PLUSES);
  const { data: dataPlusesSubs } = useSubscription(PLUSES);
  const [getUserQr, { data: userData }] = useLazyQuery(GET_USER);
  const [addPlusMut] = useMutation(ADD_PLUS);
  const [createUserMut] = useMutation(CREATE_USER);
  const [deleteUserMut] = useMutation(DELETE_USER);
  const [updateUserMut] = useMutation(UPDATE_USER_USERNAME);
  const [users, setUsers] = React.useState([]);
  const [username, setUsername] = React.useState("");
  const [age, setAge] = React.useState(0);
  const [id, setId] = React.useState("");
  // const handleSetUsers = () => {
  //   data.users && setUsers(data.users);
  // };
  React.useEffect(() => {
    console.log("get all effet");
    if (data?.users) {
      setUsers(data.users);
    }
  }, [data]);
  React.useEffect(() => {
    console.log("get one effet");
    if (userData?.user) {
      setUsers([userData.user]);
    }
  }, [userData]);

  const pluses = React.useMemo(() => {
    console.log(dataPlusesSubs?.pluses?.pluses)
    console.log(dataPlusesQuery?.getPluses?.pluses)
    console.log(dataPlusesQuery)
    return dataPlusesSubs?.pluses?.pluses || dataPlusesQuery?.getPluses?.pluses || 0
  }, [dataPlusesQuery,dataPlusesSubs])

  const clearInputs = () => {
    setUsername("");
    setAge(0);
    setId("");
  };

  const getAll = () => {
    refetch();
  };
  const getAllUsers = (e) => {
    e.preventDefault();
    if (data?.users) {
      // handleSetUsers();
      setUsers(data.users);
    } else {
      getAll();
    }
  };

  const getUser = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        console.log(id);
        getUserQr({
          variables: {
            id,
          },
        });
        clearInputs();
      } catch (error) {}
    } else {
      alert(notEmpty("id"));
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    if (username && age >= 0) {
      try {
        console.log(username, age);
        await createUserMut({
          variables: {
            input: { username, age: +age },
          },
        });
        clearInputs();
        getAll();
      } catch (error) {
        console.log(error);
      }
    } else if (username.length > 1) {
      alert("Возраст не может быть отрицательным");
    } else if (age >= 0) {
      alert("Имя - минимум 2 буквы");
    } else {
      alert("Имя - минимум 2 буквы и возраст не может быть отрицательным");
    }
  };

  const removeUser = (e) => {
    e.preventDefault();
    if (id) {
      deleteUserMut({
        variables: {
          id,
        },
      });
      getAll();
      clearInputs();
    } else {
      alert(notEmpty("id"));
    }
  };
  const updateUser = (e) => {
    e.preventDefault();
    if (id && username.length > 2) {
      updateUserMut({
        variables: {
          user: { id, username },
        },
      });
      getAll();
      clearInputs();
    } else {
      alert(notEmpty("id"));
    }
  };

  const addPlus = () => addPlusMut();

  if (loading) {
    return <h2>Загрузка...</h2>;
  }
  return (
    <div className="app">
      <form>
        <input
          value={id}
          type="text"
          placeholder="id"
          onChange={(e) => setId(e.target.value)}
        />
        <input
          value={username}
          type="text"
          placeholder="Имя"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          value={age}
          type="number"
          placeholder="Возраст"
          onChange={(e) => setAge(e.target.value)}
        />
        <div>
          <button onClick={getUser}>Получить</button>
          <button onClick={getAllUsers}>Получить всех</button>
          <button onClick={createUser}>Создать</button>
          <button onClick={updateUser}>Изменить имя</button>
          <button onClick={removeUser}>Удалить</button>
        </div>
      </form>
      <div>
        <button className="plus" onClick={addPlus}>
          +
        </button>
        <div className={"number"}>{pluses}</div>
      </div>
      <div style={{ marginBottom: 15 }}>
        {users.map((user) => (
          <div key={user.id} className="user">
            {user.id}. {user.username}: {user.age} {getYear(user.age)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
