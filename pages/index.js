import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

import Loader from '@/components/Loader';

import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import { useState } from 'react';

export default function Home() {
  const { authUser, isLoading, signOut } = useAuth();
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  const router = useRouter();
  // routing to login page if !authed
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/login');
    }
    if (!!authUser) {
      fetchTodos(authUser.uid);
    }
  }, [authUser, isLoading]);

  //add todo
  const addTodo = async () => {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        author: authUser.uid,
        content: todoInput,
        done: false,
      });
      fetchTodos(authUser.uid);
      setTodoInput('');
    } catch (error) {
      console.error(error);
    }
  };
  //fetch todos
  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, 'todos'), where('author', '==', uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  //delete todos
  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, 'todos', docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };
  // mark as checked
  const checkTodo = async (event, docId) => {
    try {
      const docRef = doc(db, 'todos', docId);
      await updateDoc(docRef, {
        done: event.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };
  // on Enter add todo
  const onKeyUpHandler = () => {
    if (event.key === 'Enter' && todoInput.length > 0) {
      addTodo();
    }
  };
  return !authUser ? (
    <Loader />
  ) : (
    <main>
      <div
        className='bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer'
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className='max-w-3xl mx-auto mt-10 p-8'>
        <div className='bg-white -m-6 p-3 sticky top-0'>
          <div className='flex justify-center flex-col items-center'>
            <span className='text-7xl mb-10'>📝</span>
            <h1 className='text-5xl md:text-7xl font-bold'>Easy Todos</h1>
          </div>
          <div className='flex items-center gap-2 mt-10'>
            <input
              placeholder={`👋 ${authUser.username}! Add your new task here`}
              type='text'
              className='font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-main text-lg transition-all duration-300 text-center md:text-left'
              autoFocus
              onChange={(e) => setTodoInput(e.target.value)}
              value={todoInput}
              onKeyUp={onKeyUpHandler}
            />
            <button
              className='w-[60px] h-[60px] rounded-md bg-main flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]'
              onClick={addTodo}
            >
              <AiOutlinePlus size={30} color='#fff' />
            </button>
          </div>
        </div>
        <div className='my-10'>
          {todos.length > 0 &&
            todos.map((todo) => (
              <div
                className='flex items-center justify-between mt-4'
                key={todo.id}
              >
                <div className='flex items-center gap-3'>
                  <input
                    id={`todo-${todo.id}`}
                    type='checkbox'
                    className='w-4 h-4 accent-main rounded-lg'
                    checked={todo.done}
                    onChange={(e) => checkTodo(e, todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`font-medium ${todo.done ? 'line-through' : ''}`}
                  >
                    {todo.content}
                  </label>
                </div>

                <div className='flex items-center gap-3'>
                  <MdDeleteForever
                    size={24}
                    className='text-red-400 hover:text-red-600 cursor-pointer'
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
