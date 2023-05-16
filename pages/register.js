import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

const RegisterForm = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  // btn form submit
  const submitHandler = async () => {
    if (!email || !username || !password) return;
    // creating new user w email, updating displayName
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
    } catch (error) {
      console.error('Error', error);
    }
  };
  // google auth
  const signInGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error', error);
    }
  };
  return (
    <main className='flex lg:h-[100vh]'>
      <div className='w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start'>
        <div className='p-8 w-[600px]'>
          <h1 className='text-6xl font-semibold'>Sign Up</h1>
          <p className='mt-6 ml-1'>
            Already have an account ?{' '}
            <span className='underline hover:text-main cursor-pointer'>
              Login
            </span>
          </p>

          <div className='bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group'>
            <FcGoogle size={22} />
            <span
              className='font-medium text-black group-hover:text-white'
              onClick={signInGoogle}
            >
              Login with Google
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className='mt-10 pl-1 flex flex-col'>
              <label>Name</label>
              <input
                type='text'
                className='font-medium border-b border-black p-4 outline-0 focus-within:border-main'
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mt-10 pl-1 flex flex-col'>
              <label>Email</label>
              <input
                type='email'
                className='font-medium border-b border-black p-4 outline-0 focus-within:border-main'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mt-10 pl-1 flex flex-col'>
              <label>Password</label>
              <input
                type='password'
                className='font-medium border-b border-black p-4 outline-0 focus-within:border-main'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className='bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90'
              onClick={submitHandler}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div
        className='w-[60%] bg-center hidden lg:block bg-no-repeat'
        style={{
          backgroundImage: "url('/auth-banner.png')",
        }}
      ></div>
    </main>
  );
};

export default RegisterForm;
